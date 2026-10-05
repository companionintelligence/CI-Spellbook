import { describe, it, expect } from 'vitest';
import marked, { safeHref } from './markdown.js';

// The card body and the search snippets are injected with dangerouslySetInnerHTML
// on this origin, and marked v5 does not sanitize. The shelves are first-party
// today; these pin the behaviour that keeps a contributed row from running as the
// site.

const render = (md) => marked.parse(md);

describe('safeHref', () => {
  it('allows http, https and mailto', () => {
    expect(safeHref('https://example.com/a')).toBe('https://example.com/a');
    expect(safeHref('http://example.com')).toBe('http://example.com');
    expect(safeHref('mailto:hi@example.com')).toBe('mailto:hi@example.com');
  });

  it('refuses everything else, however it is capitalised or padded', () => {
    for (const bad of ['javascript:alert(1)', ' JaVaScRiPt:alert(1)', 'data:text/html,<b>x</b>', 'vbscript:x', '//evil.test', '/relative', '', null, undefined]) {
      expect(safeHref(bad)).toBeNull();
    }
  });
});

describe('links', () => {
  it('open in a new tab with noopener noreferrer, so a click keeps the search and the open shelf', () => {
    const html = render('[Ollama](https://ollama.com)');
    expect(html).toContain('href="https://ollama.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('keep a title', () => {
    expect(render('[a](https://e.com "Hello")')).toContain('title="Hello"');
  });

  it('turn a javascript: link into plain text rather than a link', () => {
    const html = render('[click](javascript:alert(1))');
    expect(html).not.toMatch(/href/i);
    expect(html).not.toMatch(/<a\b/i);
    expect(html).toContain('click');
  });

  it('leave mailto links in the same tab', () => {
    const html = render('[mail](mailto:hi@example.com)');
    expect(html).toContain('href="mailto:hi@example.com"');
    expect(html).not.toContain('target=');
  });

  it('cannot be broken out of the attribute by a quote in the url', () => {
    const html = render('[x](https://e.com/a"onmouseover="alert(1))');
    const anchor = new DOMParser().parseFromString(html, 'text/html').querySelector('a');
    // The quote is percent-encoded, so it stays inside href: no extra attribute.
    expect(anchor.getAttributeNames().sort()).toEqual(['href', 'rel', 'target']);
    expect(anchor.hasAttribute('onmouseover')).toBe(false);
  });
});

describe('raw html', () => {
  it('is shown as text, not parsed', () => {
    const html = render('before <script>alert(1)</script> after\n\n<img src=x onerror=alert(1)>');
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<img/i);
    expect(html).toContain('&lt;script&gt;');
  });

  it('does not touch ordinary markdown', () => {
    const html = render('# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<table>');
  });
});

describe('images', () => {
  it('render for https sources only', () => {
    expect(render('![logo](https://e.com/a.png)')).toContain('<img src="https://e.com/a.png" alt="logo">');
    expect(render('![x](javascript:alert(1))')).not.toMatch(/<img/i);
    expect(render('![x](mailto:a@b.c)')).not.toMatch(/<img/i);
  });
});
