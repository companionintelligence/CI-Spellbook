import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BUY_LABEL, BUY_URL, DOCS_URL, DOWNLOAD_LABEL, DOWNLOAD_URL, HEADLINE, HOME_URL } from './lib/site.js';

// The whole app, rendered in jsdom against the real shelves in public/markdown.
// What this pins is the page's structure: the cross-links to ci.computer and the
// docs, the landmarks and the single <h1>, and shelves that are real buttons with
// their closed back faces out of the tab order. src/lib/site.test.js and
// scripts/assert-site.mjs cover the static HTML; this covers what React renders.

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Vitest runs from the repo root (see vitest.config.js).
const markdownDir = `${resolve(process.cwd(), 'public/markdown')}/`;

let container;
let root;
let App;

const settle = async (ms = 0) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
};

const $$ = (selector, scope = container) => Array.from(scope.querySelectorAll(selector));

async function mount() {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(React.createElement(App)));
  // Every shelf's fetch and parse, and the search index built from them.
  await settle(50);
  await settle(50);
}

beforeEach(async () => {
  vi.resetModules();
  // A production bundle: the dev-only debug overlay is not loaded.
  vi.stubEnv('DEV', false);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (path) => {
      const file = decodeURI(String(path)).replace(/^\/markdown\//, '');
      try {
        const body = readFileSync(`${markdownDir}${file}`, 'utf8');
        return { ok: true, status: 200, statusText: 'OK', text: async () => body };
      } catch {
        return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' };
      }
    })
  );
  Element.prototype.scrollIntoView = vi.fn();

  ({ default: App } = await import('./App.jsx'));
  await mount();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('cross-links to the main site', () => {
  const links = (href) => $$('a').filter((a) => a.getAttribute('href') === href);

  it('links the logo and name to ci.computer in the header, and again in the footer', () => {
    const home = links(HOME_URL);
    expect(home.map((a) => a.closest('header, footer')?.tagName)).toEqual(['HEADER', 'FOOTER']);
    expect(home.every((a) => a.textContent.trim() === 'Companion Intelligence')).toBe(true);
    // The mark is decorative: the link is named by the words beside it.
    expect(home[0].querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('puts "Buy Companion Core" at ci.computer/core in the header and the footer band', () => {
    expect(BUY_URL).toBe('https://ci.computer/core');
    const buy = links(BUY_URL);
    expect(buy.map((a) => a.closest('header, footer')?.tagName)).toEqual(['HEADER', 'FOOTER']);
    expect(buy.every((a) => a.textContent.trim() === BUY_LABEL && BUY_LABEL === 'Buy Companion Core')).toBe(true);
  });

  it('puts "Download Companion" at ci.computer/download in the header and the footer band', () => {
    expect(DOWNLOAD_URL).toBe('https://ci.computer/download');
    const download = links(DOWNLOAD_URL);
    expect(download.map((a) => a.closest('header, footer')?.tagName)).toEqual(['HEADER', 'FOOTER']);
    expect(download.every((a) => a.textContent.trim() === DOWNLOAD_LABEL && DOWNLOAD_LABEL === 'Download Companion')).toBe(true);
  });

  it("links this app's page in the docs from the header and the footer", () => {
    expect(DOCS_URL).toBe('https://docs.ci.computer/docs/apps-available/first-party-apps/spellbook');
    const docs = links(DOCS_URL);
    expect(docs.map((a) => a.closest('header, footer')?.tagName)).toEqual(['HEADER', 'FOOTER']);
    expect(docs.every((a) => a.textContent.trim() === 'Docs')).toBe(true);
  });

  it('opens every one of them in the same tab', () => {
    for (const href of [HOME_URL, BUY_URL, DOWNLOAD_URL, DOCS_URL]) {
      for (const a of links(href)) expect(a.getAttribute('target'), href).toBeNull();
    }
  });
});

describe('page structure', () => {
  it('has one h1, and it says what the page is', () => {
    const h1s = $$('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(HEADLINE);
  });

  it('has a header, a main, a footer and a skip link that lands on the shelves', () => {
    expect($$('header')).toHaveLength(1);
    expect($$('main')).toHaveLength(1);
    expect($$('footer')).toHaveLength(1);

    const skip = $$('a.skip-link')[0];
    expect(skip.getAttribute('href')).toBe('#shelves');
    expect(container.querySelector('#shelves')?.tagName).toBe('MAIN');
  });

  it('labels the search field and the controls that have no text', () => {
    expect($$('input[type=text]')[0].getAttribute('aria-label')).toBe('Search the Spellbook');
    expect($$('button').every((b) => b.textContent.trim() || b.getAttribute('aria-label'))).toBe(true);
  });

  it('ships no debug overlay: Ctrl+` does nothing in a production bundle', async () => {
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '`', ctrlKey: true, bubbles: true }));
    });
    await settle(20);
    expect(container.textContent).not.toMatch(/Perf|Animation/);
  });
});

describe('shelves', () => {
  it('are sixteen real buttons, each closed and pointing at its own contents', () => {
    const buttons = $$('button.card-open-btn');
    expect(buttons).toHaveLength(16);
    for (const b of buttons) {
      expect(b.getAttribute('aria-expanded')).toBe('false');
      expect(container.querySelector(`#${b.getAttribute('aria-controls')}`), b.textContent).not.toBeNull();
    }
  });

  it('count what is on the face from the same markdown the search is built from', () => {
    const counts = $$('.card-front-count').map((p) => p.textContent);
    expect(counts).toHaveLength(16);
    expect(counts.every((t) => /^\d+ tools/.test(t))).toBe(true);
  });

  it('keep a closed shelf out of the tab order and the accessibility tree', () => {
    const backs = $$('.card-back');
    expect(backs).toHaveLength(16);
    expect(backs.every((b) => b.hasAttribute('inert'))).toBe(true);
    // 797 links used to be focusable behind sixteen closed faces. Now nothing is
    // rendered in a back face until its shelf has been opened.
    expect($$('.card-back a[href]')).toHaveLength(0);
  });

  it('open on Enter or click: expanded, no longer inert, table rendered, headings demoted', async () => {
    const button = $$('button.card-open-btn')[0];
    await act(async () => button.click());
    await settle(150);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    const card = button.closest('.group');
    expect(card.classList.contains('expanded')).toBe(true);
    expect(card.querySelector('.card-back').hasAttribute('inert')).toBe(false);
    expect(card.querySelectorAll('.markdown-body table tbody tr').length).toBeGreaterThan(10);

    // The page still has its one h1; the shelf's own "# Title" became an h2.
    expect($$('h1')).toHaveLength(1);
    expect(card.querySelector('.markdown-body h1')).toBeNull();
    expect(card.querySelector('.markdown-body h2')).not.toBeNull();

    // A tool's link opens elsewhere and leaves this page where it was.
    const tool = card.querySelector('.markdown-body a[href^="http"]');
    expect(tool.getAttribute('target')).toBe('_blank');
    expect(tool.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('close on Escape and hand focus back to the button that opened them', async () => {
    const button = $$('button.card-open-btn')[0];
    await act(async () => button.click());
    await settle(150);
    const close = container.querySelector('.fullscreen-close-btn');
    expect(document.activeElement).toBe(close);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    await settle(20);

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
    expect(button.closest('.group').querySelector('.card-back').hasAttribute('inert')).toBe(true);
  });
});

describe('search', () => {
  const type = async (value) => {
    const input = $$('input[type=text]')[0];
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    await act(async () => {
      set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await settle(50);
    return input;
  };

  it('keeps a backtick or a tilde in the query', async () => {
    const input = await type('~/.config `x`');
    expect(input.value).toBe('~/.config `x`');
  });

  it('narrows the shelves to those with a match, and says how many hits', async () => {
    await type('ollama');
    const cards = $$('#cards-container .group');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(16);
    expect(cards.every((c) => c.classList.contains('search-result'))).toBe(true);
    expect($$('.search-snippet-subtitle')[0].textContent).toMatch(/hit/);
    expect($$('[role=status]').some((s) => /shel(f|ves) match/.test(s.textContent))).toBe(true);
  });

  it('answers a miss with the directory of shelves instead of an empty page', async () => {
    await type('zzzzqqqqxxxx');
    expect(container.querySelector('.no-results-panel')).not.toBeNull();
    expect($$('.no-results-shelf')).toHaveLength(16);
  });
});
