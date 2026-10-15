#!/usr/bin/env node
// Checks that the links in public/markdown/*.md still go somewhere.
//
//   node dev-tools/check-links.mjs                 # every link, text report
//   node dev-tools/check-links.mjs --json out.json # also write every result
//   node dev-tools/check-links.mjs --only mcp-servers.md
//   GITHUB_TOKEN=$(gh auth token) node dev-tools/check-links.mjs
//
// The catalog is hundreds of links to other people's projects, and projects
// move: repos get renamed, archived or deleted, product sites change domain. The
// content linter (dev-tools/lint-content.mjs) checks the shape of the tables
// offline; this is the networked half, and it is run on purpose (before a content
// refresh, or on a schedule someone chooses), not on every build.
//
// What it reports:
//   dead      the link is gone: 404/410, or the host does not resolve. Exits 1.
//   moved     the link works only through a redirect. A GitHub repo that was
//             renamed or transferred, or a site that sends a permanent redirect
//             to a different page. Update the catalog to the canonical address.
//             (A site sending its own address to a deeper landing page of itself,
//             such as a docs home to its introduction, is not "moved": see
//             dev-tools/link-rules.mjs.)
//   archived  a GitHub repo its owner has archived (read-only, no longer
//             maintained). Needs GITHUB_TOKEN or GH_TOKEN.
//   blocked   the site answers 401/403/429 to a script. Often a bot wall that
//             a person in a browser never meets; check these by hand.
//   error     a timeout or a server error that survived a retry.
//
// GitHub repo links go through the REST API when a token is set (5,000 requests
// an hour covers the catalog several times over), which is the only reliable way
// to see "archived" and the canonical owner/name; everything else is an HTTP GET.
// Dependency-free on purpose.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { isLandingAlias } from './link-rules.mjs';

const DIR = new URL('../public/markdown', import.meta.url).pathname;
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);

const ONLY = option('--only');
const JSON_OUT = option('--json');
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const TIMEOUT_MS = Number(option('--timeout') ?? 20000);
const USER_AGENT = 'Mozilla/5.0 (compatible; SpellbookLinkCheck/1.0; +https://magic.ci.computer)';

// ---- collect --------------------------------------------------------------------

/** @type {Map<string, string[]>} url -> ["file:line", ...] */
const urls = new Map();

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md') && (!ONLY || f === ONLY)).sort()) {
  readFileSync(join(DIR, file), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const m of line.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)) {
        const where = urls.get(m[1]) ?? [];
        where.push(`${file}:${i + 1}`);
        urls.set(m[1], where);
      }
    });
}

// ---- politeness: a few requests at a time per host --------------------------------

const slots = new Map();
const MAX_PER_HOST = (host) => (host === 'api.github.com' ? 8 : 2);

async function withHost(host, fn) {
  const state = slots.get(host) ?? { active: 0, waiting: [] };
  slots.set(host, state);
  if (state.active >= MAX_PER_HOST(host)) await new Promise((resolve) => state.waiting.push(resolve));
  state.active += 1;
  try {
    return await fn();
  } finally {
    state.active -= 1;
    state.waiting.shift()?.();
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- checks ---------------------------------------------------------------------

const GITHUB_REPO = /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+?)\/?$/i;
const NOT_REPOS = new Set(['orgs', 'topics', 'sponsors', 'marketplace', 'settings', 'features', 'collections', 'users', 'apps']);

async function checkGithubRepo(url, owner, name) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      authorization: `Bearer ${TOKEN}`,
      accept: 'application/vnd.github+json',
      'user-agent': USER_AGENT,
      'x-github-api-version': '2022-11-28'
    },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  if (res.status === 404) return { status: 'dead', detail: 'repository not found (404)' };
  if (res.status === 451) return { status: 'blocked', detail: 'unavailable for legal reasons (451)' };
  if (res.status === 403 || res.status === 429) return { status: 'error', detail: `GitHub API rate limited (${res.status})` };
  if (!res.ok) return { status: 'error', detail: `GitHub API ${res.status}` };

  const repo = await res.json();
  const canonical = `https://github.com/${repo.full_name}`;
  const renamed = repo.full_name.toLowerCase() !== `${owner}/${name}`.toLowerCase();
  const result = {
    status: repo.archived ? 'archived' : renamed ? 'moved' : 'ok',
    canonical,
    detail: [
      repo.archived ? 'archived by its owner' : null,
      renamed ? `now ${repo.full_name}` : null,
      repo.disabled ? 'disabled' : null
    ]
      .filter(Boolean)
      .join('; '),
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    description: repo.description
  };
  // Archived AND renamed: report the more urgent one, keep both facts.
  if (repo.archived && renamed) result.canonical = canonical;
  return result;
}

async function checkHttp(url) {
  let current = url;
  let permanent = false;

  for (let hop = 0; hop < 6; hop++) {
    const res = await fetch(current, {
      redirect: 'manual',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en' },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    res.body?.cancel().catch(() => {});

    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      if (hop === 0 && (res.status === 301 || res.status === 308)) permanent = true;
      if (res.status === 301 || res.status === 308) permanent = true;
      current = new URL(res.headers.get('location'), current).href;
      continue;
    }

    if (res.status === 404 || res.status === 410) return { status: 'dead', detail: `HTTP ${res.status}`, finalUrl: current };
    if ([401, 403, 429, 999].includes(res.status)) return { status: 'blocked', detail: `HTTP ${res.status} to a script`, finalUrl: current };
    if (res.status >= 500) return { status: 'error', detail: `HTTP ${res.status}`, finalUrl: current };
    if (res.status >= 400) return { status: 'dead', detail: `HTTP ${res.status}`, finalUrl: current };

    // Same address, or the owner's own deeper landing page for it (dev-tools/link-rules.mjs):
    // nothing to change in the catalog.
    const same = current.replace(/\/$/, '') === url.replace(/\/$/, '') || isLandingAlias(url, current);
    return same
      ? { status: 'ok', finalUrl: current }
      : { status: permanent ? 'moved' : 'ok', canonical: current, detail: permanent ? `permanent redirect to ${current}` : `temporary redirect to ${current}`, finalUrl: current };
  }

  return { status: 'error', detail: 'too many redirects', finalUrl: current };
}

async function checkOne(url) {
  const repo = TOKEN ? url.match(GITHUB_REPO) : null;
  const isRepo = repo && !NOT_REPOS.has(repo[1].toLowerCase());
  const host = isRepo ? 'api.github.com' : new URL(url).host;

  return withHost(host, async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const out = isRepo ? await checkGithubRepo(url, repo[1], repo[2]) : await checkHttp(url);
        if (out.status === 'error' && attempt === 0) {
          await sleep(1500);
          continue;
        }
        return out;
      } catch (e) {
        const code = e?.cause?.code ?? e?.code ?? '';
        if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') return { status: 'dead', detail: `host does not resolve (${code})` };
        if (code === 'ERR_TLS_CERT_ALTNAME_INVALID' || /certificate/i.test(String(e?.cause?.message ?? ''))) {
          return { status: 'dead', detail: `TLS certificate problem (${code || e.cause.message})` };
        }
        if (attempt === 0) {
          await sleep(1500);
          continue;
        }
        return { status: 'error', detail: `${e.name}: ${code || e.message}` };
      }
    }
    return { status: 'error', detail: 'unreachable' };
  });
}

// ---- run ------------------------------------------------------------------------

const list = [...urls.keys()];
console.log(`Checking ${list.length} unique links in ${ONLY ?? 'every shelf'}${TOKEN ? ' (GitHub repos via the API)' : ' (no GITHUB_TOKEN: GitHub repos by plain HTTP, so archived repos are not detected)'}...`);

const results = new Map();
let done = 0;
const queue = [...list];
const workers = Array.from({ length: 24 }, async () => {
  for (let url = queue.shift(); url; url = queue.shift()) {
    results.set(url, await checkOne(url));
    done += 1;
    if (done % 100 === 0) console.error(`  ${done}/${list.length}`);
  }
});
await Promise.all(workers);

const order = ['dead', 'moved', 'archived', 'blocked', 'error'];
const groups = Object.fromEntries(order.map((k) => [k, []]));
let ok = 0;
for (const [url, r] of results) {
  if (r.status === 'ok') ok += 1;
  else groups[r.status]?.push([url, r]);
}

const titles = {
  dead: 'DEAD: the link goes nowhere',
  moved: 'MOVED: works only through a redirect; point the catalog at the new address',
  archived: 'ARCHIVED: read-only upstream',
  blocked: 'BLOCKED: answers a script with 401/403/429; check by hand',
  error: 'ERROR: timed out or server error'
};

for (const key of order) {
  if (!groups[key].length) continue;
  console.log(`\n${titles[key]} (${groups[key].length})`);
  for (const [url, r] of groups[key].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${url}\n      ${r.detail ?? ''}${r.canonical && r.status !== 'moved' ? ` -> ${r.canonical}` : ''}\n      ${urls.get(url).join(', ')}`);
  }
}

console.log(`\n${ok} ok, ${order.map((k) => `${groups[k].length} ${k}`).join(', ')}`);

if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify(Object.fromEntries([...results].map(([url, r]) => [url, { ...r, where: urls.get(url) }])), null, 2));
  console.log(`Wrote ${JSON_OUT}`);
}

process.exit(groups.dead.length || (flag('--strict') && (groups.moved.length || groups.archived.length)) ? 1 : 0);
