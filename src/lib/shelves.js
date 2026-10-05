// One fetch, one parse, per shelf.
//
// The search index (App) and every closed card face (Card) both need each
// shelf's markdown. They used to fetch and `marked.parse` it independently —
// 32 requests and 32 parses for 16 files, each revalidated because the
// markdown is served with a short cache. Everything now goes through
// `loadShelf`, which memoises the promise, so the second caller shares the
// first caller's request and its parse.
//
// The result is deliberately the *derived* views — the HTML, the search lines
// and the face summary — computed once. What only an open card needs (labelled
// cells, demoted headings) is done later by prepareCardBody, on first open.
import marked from './markdown.js';
import { htmlToSearchLines, summarizeCardHtml } from './cardContent.js';

/** @type {Map<string, Promise<Shelf>>} */
const shelves = new Map();

/**
 * @typedef {object} Shelf
 * @property {string} html     marked output, headings as authored
 * @property {string[]} lines  one search line per table row / block
 * @property {ReturnType<typeof summarizeCardHtml>} summary  null when there is no table to count
 */

/** @returns {Shelf} */
export function parseShelf(markdownText) {
  const html = marked.parse(markdownText);
  let lines;
  try {
    lines = htmlToSearchLines(html);
  } catch {
    lines = String(markdownText)
      .split(/\r?\n/)
      .map((l) => l.replace(/\s+$/g, ''));
  }

  let summary = null;
  try {
    summary = summarizeCardHtml(html);
  } catch {
    /* a shelf with no countable table just has no number on its face */
  }

  return { html, lines, summary };
}

/**
 * @param {string} path  where the shelf's markdown is served
 * @returns {Promise<Shelf>}
 */
export function loadShelf(path) {
  let pending = shelves.get(path);
  if (!pending) {
    pending = fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then(parseShelf);
    // A failure must not be cached: the next caller (a re-render, a retry)
    // should get a fresh attempt rather than the same rejected promise.
    pending.catch(() => {
      if (shelves.get(path) === pending) shelves.delete(path);
    });
    shelves.set(path, pending);
  }
  return pending;
}

/** Tests only. */
export function clearShelves() {
  shelves.clear();
}
