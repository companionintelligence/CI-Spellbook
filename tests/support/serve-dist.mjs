#!/usr/bin/env node
// serve-dist.mjs: serve ./dist the way Cloudflare Pages serves it, for tests/pwa.spec.js.
//
//   node tests/support/serve-dist.mjs [port]      # default 5501
//
// The service worker can only be tested against the production build, because the dev
// server never registers it, and against the production headers, because the page CSP
// decides whether the worker may load at all. `vite preview` applies neither
// public/_headers nor Pages' routing, so this does, in the little that matters here:
//
//   - every header rule of dist/_headers whose path matches: `/*`, `/dir/*`, an exact path;
//   - a `*.html` or a bare `/dir` is redirected (308) to its clean URL, as Pages does. That
//     is why the offline page lives at /offline/ and not /offline.html: a service worker
//     that answers a page load with a redirected response fails the load;
//   - an unknown path is dist/404.html with a 404, because the build has one (so Pages
//     does not fall back to the home page).
//
// It is not a model of Pages beyond that: no _redirects, no Functions, no compression.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml'
};

/** `_headers` as [path pattern, { header: value }] rules, in file order. */
function parseHeaders(text) {
  const rules = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      rules.push([line.trim(), {}]);
      continue;
    }
    const colon = line.indexOf(':');
    if (colon === -1 || rules.length === 0) continue;
    rules[rules.length - 1][1][line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return rules;
}

const matches = (pattern, path) => (pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : pattern === path);

/**
 * Start the server. Resolves once it is listening, with its origin and a function that stops it.
 * @param {{ dist?: string, port?: number }} [options] `port: 0` picks a free one
 * @returns {Promise<{ origin: string, close: () => Promise<void> }>}
 */
export function serveDist({ dist = DIST, port = 0 } = {}) {
  const root = resolve(dist);
  const headersFile = join(root, '_headers');
  const rules = parseHeaders(existsSync(headersFile) ? readFileSync(headersFile, 'utf8') : '');

  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    const send = (status, headers, body) => {
      res.writeHead(status, headers);
      res.end(body);
    };
    const redirect = (to) => send(308, { location: `${to}${url.search}` }, '');

    if (path.endsWith('/index.html')) return redirect(path.slice(0, -'index.html'.length));
    if (path.endsWith('.html')) return redirect(path.slice(0, -'.html'.length));

    let file = normalize(join(root, path));
    if (file !== root && !file.startsWith(root + sep)) return send(403, {}, 'forbidden');

    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!path.endsWith('/')) return redirect(`${path}/`);
      file = join(file, 'index.html');
    } else if (!existsSync(file) && existsSync(`${file}.html`)) {
      file = `${file}.html`; // the clean URL of a built page
    }

    let status = 200;
    if (!existsSync(file) || !statSync(file).isFile()) {
      status = 404;
      file = join(root, '404.html');
    }

    const headers = { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' };
    for (const [pattern, values] of rules) if (matches(pattern, path)) Object.assign(headers, values);
    return send(status, headers, existsSync(file) ? readFileSync(file) : 'not found');
  });

  return new Promise((resolveListening, reject) => {
    server.once('error', reject);
    server.listen(port, 'localhost', () => {
      const address = /** @type {import('node:net').AddressInfo} */ (server.address());
      resolveListening({
        origin: `http://localhost:${address.port}`,
        // A browser keeps its connections open, and close() alone waits for them to idle out.
        close: () =>
          new Promise((done) => {
            server.close(() => done());
            server.closeAllConnections();
          })
      });
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { origin } = await serveDist({ port: Number(process.argv[2] ?? 5501) });
  console.log(`Serving ${DIST} at ${origin} with the headers of dist/_headers`);
}
