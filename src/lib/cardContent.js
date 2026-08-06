// Derived views of a shelf's rendered markdown.
//
// Every shelf is a handful of `## Section` headings over four-column tables
// (Tool | Description | Platforms | Notes). Two features read those tables and
// both used to get them wrong in the same way — by flattening the HTML with
// `textContent` and treating each resulting newline as a "line":
//
//   · Search snippets showed one table CELL per line, so a hit on "code-server"
//     rendered as the disconnected fragments "Platforms" / "Notes" /
//     "code-server" / "VS Code running…" — column headers and neighbouring
//     cells stacked with no structure. It read as debug output.
//   · Closed cards showed nothing at all but a title, on a catalog whose whole
//     value is how much is in it.
//
// So: one walk, table-row aware, feeding both.

const BLOCK_TEXT = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'LI', 'PRE']);

export function parseCardHtml(html) {
  if (typeof DOMParser === 'undefined' || !html) return null;
  try {
    return new DOMParser().parseFromString(String(html), 'text/html');
  } catch {
    return null;
  }
}

const clean = (node) => (node?.textContent || '').replace(/\s+/g, ' ').trim();

/**
 * Ordered, human-meaningful lines for the search index and its snippets.
 * A table row collapses to ONE line — "Tool — Description — Platforms — Notes"
 * — so a hit is a whole record and the lines around it are neighbouring
 * records rather than stray cells. Header rows are dropped: they are column
 * labels, they match nothing a reader is looking for, and they were the
 * bulk of the noise in the old snippets.
 */
export function htmlToSearchLines(html) {
  const doc = parseCardHtml(html);
  if (!doc) {
    return String(html || '')
      .split(/\r?\n/)
      .map((l) => l.trimEnd());
  }

  const lines = [];
  const walk = (node) => {
    for (const el of node.children) {
      if (el.tagName === 'TABLE') {
        for (const row of el.querySelectorAll('tr')) {
          if (row.querySelector('th')) continue; // column labels, not content
          const cells = Array.from(row.cells).map(clean).filter(Boolean);
          if (cells.length) lines.push(cells.join(' — '));
        }
      } else if (BLOCK_TEXT.has(el.tagName)) {
        const text = clean(el);
        if (text) lines.push(text);
      } else {
        walk(el);
      }
    }
  };
  walk(doc.body);
  return lines;
}

/**
 * Stamp each body cell with the label of its column.
 *
 * The shelf tables are four columns wide with an 8rem floor per cell, i.e.
 * ~450px minimum against a 360px viewport. `overflow-x: auto` kept them
 * *reachable* but a screenshot of a horizontally scrolled table is
 * indistinguishable from a broken one — the store shots show a header row
 * reading "Tool | Description | Pla" and body cells cut to "Sel", "Cro".
 * With a label on every cell, narrow viewports can stack the row instead of
 * scrolling it (see the `max-width: 640px` block in styles.css).
 */
export function labelTableCells(html) {
  const doc = parseCardHtml(html);
  if (!doc) return html;

  let touched = false;
  for (const table of doc.querySelectorAll('table')) {
    const headers = Array.from(table.querySelectorAll('thead th')).map(clean);
    if (!headers.length) continue;
    for (const row of table.querySelectorAll('tbody tr')) {
      Array.from(row.cells).forEach((cell, i) => {
        if (headers[i]) {
          cell.setAttribute('data-label', headers[i]);
          touched = true;
        }
      });
    }
  }
  return touched ? doc.body.innerHTML : html;
}

/**
 * What a shelf is worth, for the closed card face: how many tools it lists,
 * how many sections they are grouped into, and the first few names. All three
 * are counted from the shelf's own markdown — nothing here is authored copy.
 */
export function summarizeCardHtml(html) {
  const doc = parseCardHtml(html);
  if (!doc) return null;

  const rows = Array.from(doc.querySelectorAll('table tr')).filter(
    (row) => !row.querySelector('th')
  );
  const sections = doc.querySelectorAll('h2').length;

  const examples = [];
  for (const row of rows) {
    const name = clean(row.cells?.[0]);
    if (name && !examples.includes(name)) examples.push(name);
    if (examples.length === 4) break;
  }

  if (!rows.length) return null;
  return { tools: rows.length, sections, examples };
}
