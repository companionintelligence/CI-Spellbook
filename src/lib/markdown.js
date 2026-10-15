// Shared, pre-configured marked instance.
//
// - Uses the marked-highlight extension (the `highlight:` parse option was
//   deprecated in marked v5 and spammed a console warning per parse).
// - Imports highlight.js "common" build (~40 languages) instead of the full
//   bundle, which keeps several hundred KB out of the main chunk.
// - Disables the deprecated mangle/headerIds defaults to silence their
//   deprecation warnings.
// - Renders markdown it cannot trust as inert. marked v5 does not sanitize, and
//   the card body is injected with dangerouslySetInnerHTML on this origin, so a
//   contributed row containing raw HTML or a `javascript:` link would run as
//   the site. The catalog is first-party today; this keeps it that way when a
//   pull request adds a row. See also dev-tools/lint-content.mjs, which fails
//   the content check on the same two things.
// - Opens every external link in a new tab (with noopener/noreferrer): a click
//   on a tool used to navigate away and lose the search and the open shelf.
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import { escapeHtml } from './cardContent.js';

const SAFE_URL = /^(https?:|mailto:)/i;

/** The href if it is one we are willing to render as a link, else null. */
export function safeHref(href) {
  const value = String(href ?? '').trim();
  return SAFE_URL.test(value) ? value : null;
}

const attrUrl = (url) => escapeHtml(encodeURI(url).replace(/%25/g, '%'));

const renderer = {
  // Raw HTML in a shelf shows up as text instead of being parsed.
  html(html) {
    return escapeHtml(html);
  },

  link(href, title, text) {
    const safe = safeHref(href);
    // Not a link we trust: keep what the author wrote, drop the destination.
    if (!safe) return text;

    let out = `<a href="${attrUrl(safe)}"`;
    if (title) out += ` title="${escapeHtml(title)}"`;
    if (/^https?:/i.test(safe)) out += ' target="_blank" rel="noopener noreferrer"';
    return `${out}>${text}</a>`;
  },

  image(href, title, text) {
    const safe = safeHref(href);
    if (!safe || /^mailto:/i.test(safe)) return escapeHtml(text);

    let out = `<img src="${attrUrl(safe)}" alt="${escapeHtml(text)}"`;
    if (title) out += ` title="${escapeHtml(title)}"`;
    return `${out}>`;
  }
};

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
  }),
  {
    mangle: false,
    headerIds: false,
    renderer
  }
);

export default marked;
