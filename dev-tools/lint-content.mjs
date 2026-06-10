#!/usr/bin/env node
// Validates public/markdown/*.md against the catalog conventions in
// architecture/content-expansion-plan.md. Run: node dev-tools/lint-content.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('../public/markdown', import.meta.url).pathname;
const HEADER = '| Tool | Description | Platforms | Notes |';
const SEPARATOR = '| --- | --- | --- | --- |';
const PLATFORM_TOKENS = new Set([
  'Cross-platform', 'Self-hosted', 'Web', 'macOS', 'Windows', 'Linux',
  'iOS', 'Android', 'Mobile', 'VS Code', 'JetBrains', 'Neovim', 'Vim',
  'Chromium', 'CLI', 'Open weights', 'Hosted API', 'Hardware'
]);
const MAX_DESC = 140;
const MAX_NOTES = 120;

const urlIndex = new Map(); // url -> [file:line]
let errors = 0;
let warnings = 0;

const report = (kind, file, line, msg) => {
  console.log(`${kind === 'error' ? 'ERROR' : 'warn '} ${file}:${line} ${msg}`);
  if (kind === 'error') errors++; else warnings++;
};

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
  const lines = readFileSync(join(DIR, file), 'utf8').split('\n');

  if (!/^# .+/.test(lines[0] ?? '')) report('error', file, 1, 'first line must be "# <Title>"');
  const blurbIdx = lines.findIndex((l, i) => i > 0 && l.trim() !== '');
  if (blurbIdx === -1 || !lines[blurbIdx].startsWith('> ')) {
    report('error', file, blurbIdx + 1, 'first non-blank line after the title must be a "> blurb"');
  }

  let prev = '';
  lines.forEach((raw, i) => {
    const n = i + 1;
    const line = raw.trimEnd();
    if (!line.startsWith('|')) { prev = line; return; }

    if (line === HEADER) {
      // header row: next line must be the separator
      if ((lines[i + 1] ?? '').trimEnd() !== SEPARATOR) {
        report('error', file, n + 1, 'table header must be followed by the 4-column separator');
      }
      prev = line;
      return;
    }
    if (line === SEPARATOR) {
      if (prev !== HEADER) report('error', file, n, 'separator without canonical header above');
      prev = line;
      return;
    }
    if (/^\|[\s:-]+\|/.test(line) || /^\| Tool \|/.test(line)) {
      report('error', file, n, `non-canonical table header/separator: ${line.slice(0, 60)}`);
      prev = line;
      return;
    }

    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) {
      report('error', file, n, `row has ${cells.length} cells, expected 4`);
      prev = line;
      return;
    }
    const [tool, desc, platforms, notes] = cells;
    const link = tool.match(/^\[(.+?)\]\((https?:\/\/\S+)\)$/);
    if (!link) {
      report('error', file, n, `Tool cell must be [Name](url): ${tool.slice(0, 60)}`);
    } else {
      const url = link[2].replace(/\/$/, '').toLowerCase();
      if (!urlIndex.has(url)) urlIndex.set(url, []);
      urlIndex.get(url).push(`${file}:${n}`);
    }
    if (desc.length > MAX_DESC) report('warn', file, n, `Description ${desc.length} > ${MAX_DESC} chars`);
    if (notes.length > MAX_NOTES) report('warn', file, n, `Notes ${notes.length} > ${MAX_NOTES} chars`);
    for (const token of platforms.split(',').map((t) => t.trim()).filter(Boolean)) {
      if (!PLATFORM_TOKENS.has(token)) report('warn', file, n, `unknown Platforms token "${token}"`);
    }
    prev = line;
  });
}

for (const [url, where] of urlIndex) {
  const files = new Set(where.map((w) => w.split(':')[0]));
  if (where.length > 1 && files.size === 1) {
    report('error', where[0].split(':')[0], 0, `duplicate URL within file: ${url} (${where.join(', ')})`);
  } else if (files.size > 1) {
    report('warn', where[0].split(':')[0], 0, `URL appears in multiple files: ${url} (${where.join(', ')})`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
