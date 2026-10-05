import { describe, it, expect } from 'vitest';
import {
  htmlToSearchLines,
  summarizeCardHtml,
  labelTableCells,
  prepareCardBody,
  markMatches,
  snippetTerms
} from './cardContent';

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

describe('snippetTerms', () => {
  it('prefers the document terms MiniSearch matched over the literal query', () => {
    // A fuzzy hit: the reader typed "kuberentes", the index matched "kubernetes".
    expect(snippetTerms('kuberentes', ['kubernetes'])).toContain('kubernetes');
  });

  it('keeps the raw query too, so an exact hit still marks before terms arrive', () => {
    expect(snippetTerms('obsidian', undefined)).toEqual(['obsidian']);
  });

  it('orders longest first so a prefix cannot claim part of the longer term', () => {
    expect(snippetTerms('moto', ['motorcycle', 'motor'])).toEqual([
      'motorcycle',
      'motor',
      'moto'
    ]);
  });

  it('de-duplicates and caps the list', () => {
    expect(snippetTerms('mcp mcp', ['mcp'])).toEqual(['mcp']);
    expect(snippetTerms(Array.from({ length: 30 }, (_, i) => `t${i}`).join(' ')).length).toBe(12);
  });
});

describe('markMatches', () => {
  it('marks a fuzzy-matched term the query does not literally contain', () => {
    expect(markMatches('Portainer — UI for Docker and Kubernetes.', ['kubernetes'])).toContain(
      '<mark>Kubernetes</mark>'
    );
  });

  it('only marks at a word start, so a short term cannot land mid-word', () => {
    const html = markMatches('Aider helps you maintain a chain of edits', ['ai']);
    expect(html).toContain('<mark>Ai</mark>der');
    expect(html).not.toContain('m<mark>ai</mark>ntain');
    expect(html).not.toContain('ch<mark>ai</mark>n');
  });

  it('escapes the line, and never splits an entity with a term like "amp"', () => {
    const html = markMatches('Tom & Jerry <script>', ['amp', 'quot']);
    expect(html).toBe('Tom &amp; Jerry &lt;script&gt;');
  });

  it('escapes the marked text itself', () => {
    expect(markMatches('<b> is a tag', ['<b>'])).toBe('<mark>&lt;b&gt;</mark> is a tag');
  });

  it('marks every occurrence in the line', () => {
    const html = markMatches('SQLite viewer for SQLite files', ['sqlite']);
    expect(html.match(/<mark>/g)).toHaveLength(2);
  });

  it('falls back to escaping when there is nothing to mark', () => {
    expect(markMatches('a & b', [])).toBe('a &amp; b');
  });
});

describe('prepareCardBody', () => {
  const body = prepareCardBody(SHELF);
  const doc = new DOMParser().parseFromString(body, 'text/html');

  it('pushes every heading down a level, so the page keeps the only <h1>', () => {
    // The markdown's own "# Title" and "## Section" were a second and third
    // set of <h1>/<h2> in the same document: sixteen <h1>s in all.
    expect(doc.querySelectorAll('h1')).toHaveLength(0);
    expect(doc.querySelector('h2')?.textContent).toBe('MCP Servers & Connectors');
    expect(Array.from(doc.querySelectorAll('h3')).map((h) => h.textContent)).toEqual([
      'Registries & Catalogs',
      'Reference Servers'
    ]);
  });

  it('keeps heading attributes and inline content when it demotes', () => {
    const out = prepareCardBody('<h2 id="x" class="y">A <em>b</em> &amp; c</h2>');
    expect(out).toBe('<h3 id="x" class="y">A <em>b</em> &amp; c</h3>');
  });

  it('also labels the table cells, as labelTableCells does', () => {
    const cells = Array.from(doc.querySelector('tbody tr').querySelectorAll('td'));
    expect(cells.map((c) => c.getAttribute('data-label'))).toEqual([
      'Tool',
      'Description',
      'Platforms',
      'Notes'
    ]);
  });

  it('leaves the input string alone: the search lines are computed from the raw html', () => {
    expect(SHELF).toContain('<h1>MCP Servers');
    expect(htmlToSearchLines(SHELF)[0]).toBe('MCP Servers & Connectors');
  });

  it('passes content with no headings or tables through unchanged', () => {
    expect(prepareCardBody('<p>just prose</p>')).toBe('<p>just prose</p>');
  });
});

describe('summarizeCardHtml keys', () => {
  it('gives one key per row, so the catalog can be counted by distinct tool', () => {
    const s = summarizeCardHtml(`
      <table><thead><tr><th>Tool</th></tr></thead><tbody>
        <tr><td><a href="https://example.com/a/">Alpha</a></td></tr>
        <tr><td><a href="https://example.com/b">Beta</a></td></tr>
        <tr><td>No link here</td></tr>
      </tbody></table>`);
    expect(s.tools).toBe(3);
    // The trailing slash is not a different tool; the name stands in for a missing link.
    expect(s.keys).toEqual(['https://example.com/a', 'https://example.com/b', 'no link here']);
  });

  it('keeps the example names capped at four while still keying every row', () => {
    const rows = Array.from({ length: 6 }, (_, i) => `<tr><td><a href="https://e.com/${i}">T${i}</a></td></tr>`).join('');
    const s = summarizeCardHtml(`<table><thead><tr><th>Tool</th></tr></thead><tbody>${rows}</tbody></table>`);
    expect(s.examples).toEqual(['T0', 'T1', 'T2', 'T3']);
    expect(s.keys).toHaveLength(6);
  });
});

