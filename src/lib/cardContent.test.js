import { describe, it, expect } from 'vitest';
import { htmlToSearchLines, summarizeCardHtml, labelTableCells } from './cardContent';

const SHELF = `
<h1>MCP Servers &amp; Connectors</h1>
<blockquote><p>Model Context Protocol is an open standard.</p></blockquote>
<h2>Registries &amp; Catalogs</h2>
<table>
  <thead><tr><th>Tool</th><th>Description</th><th>Platforms</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><a href="#">PulseMCP</a></td><td>Daily-updated directory.</td><td>Web</td><td>Largest independent directory.</td></tr>
    <tr><td><a href="#">Smithery</a></td><td>Marketplace with a CLI.</td><td>Web</td><td>7,000+ servers.</td></tr>
  </tbody>
</table>
<h2>Reference Servers</h2>
<table>
  <thead><tr><th>Tool</th><th>Description</th><th>Platforms</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><a href="#">MCP Fetch</a></td><td>Fetches web URLs.</td><td>Cross-platform</td><td>Official reference.</td></tr>
  </tbody>
</table>
`;

describe('htmlToSearchLines', () => {
  const lines = htmlToSearchLines(SHELF);

  it('collapses a table row into one line rather than one cell per line', () => {
    expect(lines).toContain(
      'PulseMCP — Daily-updated directory. — Web — Largest independent directory.'
    );
  });

  it('drops header rows, which were the bulk of the old snippet noise', () => {
    // "Platforms" and "Notes" used to show up as standalone snippet lines
    // that matched nothing and highlighted nothing.
    expect(lines).not.toContain('Platforms');
    expect(lines).not.toContain('Notes');
    expect(lines.some((l) => l === 'Tool')).toBe(false);
  });

  it('keeps headings and prose, in document order', () => {
    expect(lines[0]).toBe('MCP Servers & Connectors');
    expect(lines).toContain('Registries & Catalogs');
    expect(lines).toContain('Model Context Protocol is an open standard.');
    expect(lines.indexOf('Registries & Catalogs')).toBeLessThan(
      lines.indexOf('Reference Servers')
    );
  });

  it('emits no blank lines', () => {
    expect(lines.every((l) => l.trim().length > 0)).toBe(true);
  });
});

describe('summarizeCardHtml', () => {
  it('counts every body row across every section', () => {
    const s = summarizeCardHtml(SHELF);
    expect(s.tools).toBe(3);
    expect(s.sections).toBe(2);
  });

  it('takes example names from the first column, capped at four', () => {
    const s = summarizeCardHtml(SHELF);
    expect(s.examples).toEqual(['PulseMCP', 'Smithery', 'MCP Fetch']);
  });

  it('returns null when there is nothing to count, so the face stays bare', () => {
    expect(summarizeCardHtml('<h1>Empty shelf</h1><p>Nothing yet.</p>')).toBeNull();
    expect(summarizeCardHtml('')).toBeNull();
  });
});

describe('labelTableCells', () => {
  it('stamps each body cell with its column header', () => {
    const doc = new DOMParser().parseFromString(labelTableCells(SHELF), 'text/html');
    const cells = doc.querySelectorAll('table:first-of-type tbody tr:first-child td');
    expect(Array.from(cells).map((c) => c.getAttribute('data-label'))).toEqual([
      'Tool',
      'Description',
      'Platforms',
      'Notes'
    ]);
  });

  it('leaves header cells and non-table markup alone', () => {
    const out = labelTableCells(SHELF);
    const doc = new DOMParser().parseFromString(out, 'text/html');
    expect(doc.querySelector('th').hasAttribute('data-label')).toBe(false);
    expect(doc.querySelector('h1').textContent).toBe('MCP Servers & Connectors');
  });

  it('passes html through untouched when there are no tables', () => {
    const html = '<p>Just prose.</p>';
    expect(labelTableCells(html)).toBe(html);
  });
});
