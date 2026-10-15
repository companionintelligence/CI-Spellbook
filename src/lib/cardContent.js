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
      // 'tbody tr' is a compound selector, so lib.dom's tag-name overload of
      // querySelectorAll doesn't kick in and `row` types as plain `Element`.
      // Cast only — same node, same runtime behavior.
      const tr = /** @type {HTMLTableRowElement} */ (row);
      Array.from(tr.cells).forEach((cell, i) => {
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
 * Everything the OPEN face of a shelf needs done to its rendered markdown, in
 * one parse: label the table cells (see labelTableCells) and push every heading
 * down a level.
 *
 * The page owns the one <h1>, and each closed shelf face owns an <h2>. The
 * markdown's own "# Title" / "## Section" used to be a second and third set of
 * <h1>/<h2> in the same document — sixteen <h1>s in the accessibility tree.
 * Demoting here, on the way into the open card, leaves the summary and the
 * search lines (computed from the raw markdown HTML) alone.
 */
export function prepareCardBody(html) {
  const doc = parseCardHtml(html);
  if (!doc) return html;

  let touched = false;

  for (const table of doc.querySelectorAll('table')) {
    const headers = Array.from(table.querySelectorAll('thead th')).map(clean);
    if (!headers.length) continue;
    for (const row of table.querySelectorAll('tbody tr')) {
      const tr = /** @type {HTMLTableRowElement} */ (row);
      Array.from(tr.cells).forEach((cell, i) => {
        if (headers[i]) {
          cell.setAttribute('data-label', headers[i]);
          touched = true;
        }
      });
    }
  }

  // Document order, deepest last: replacing a heading never moves another one.
  for (const heading of Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5'))) {
    const level = Number(heading.tagName.slice(1));
    const next = doc.createElement(`h${level + 1}`);
    for (const attr of Array.from(heading.attributes)) next.setAttribute(attr.name, attr.value);
    while (heading.firstChild) next.appendChild(heading.firstChild);
    heading.replaceWith(next);
    touched = true;
  }

  return touched ? doc.body.innerHTML : html;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * The terms a snippet should mark, longest first.
 *
 * The index searches with `prefix: true, fuzzy: 0.2`, so a hit does not have to
 * contain what was typed — "kuberentes" matches "Kubernetes", "sqllite" matches
 * "SQLite". Highlighting only the literal query left those rows with no mark on
 * them at all, so the reader had to take the result on faith. MiniSearch
 * already reports the DOCUMENT terms a result matched on (`SearchResult.terms`:
 * "if a prefix search for 'moto' matches 'motorcycle', terms will contain
 * 'motorcycle'"), so mark those, keeping the raw query as a fallback for the
 * pre-index render.
 */
export function snippetTerms(query, matchedTerms) {
  return Array.from(
    new Set(
      [
        ...(Array.isArray(matchedTerms) ? matchedTerms : []),
        ...String(query || '').trim().split(/\s+/)
      ].filter(Boolean)
    )
  )
    // Longest first so "motorcycle" wins over "moto" and the shorter term
    // cannot claim a fragment inside the span the longer one already owns.
    .sort((a, b) => b.length - a.length)
    .slice(0, 12);
}

/**
 * Escape `line` and wrap every occurrence of `terms` in <mark>.
 *
 * Two things this deliberately does not do the obvious way:
 *  · It scans the RAW line and escapes each piece as it emits it. Matching
 *    against already-escaped text would let a term like "amp" or "quot" mark
 *    the inside of an entity and split it.
 *  · A match must start at a word boundary. An index term is a whole token, so
 *    "ai" should mark the start of "Aider" but not the middle of "maintain".
 */
export function markMatches(line, terms) {
  const text = String(line ?? '');
  const list = (terms || []).filter(Boolean);
  if (!list.length) return escapeHtml(text);

  const pattern = new RegExp(
    `(^|[^A-Za-z0-9])(${list.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  let out = '';
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const hitStart = m.index + m[1].length;
    out += escapeHtml(text.slice(last, hitStart));
    out += `<mark>${escapeHtml(m[2])}</mark>`;
    last = hitStart + m[2].length;
    if (pattern.lastIndex <= m.index) pattern.lastIndex = m.index + 1;
  }
  return out + escapeHtml(text.slice(last));
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
  const keys = [];
  for (const row of rows) {
    // Same compound-selector caveat as labelTableCells above.
    const cell = /** @type {HTMLTableRowElement} */ (row).cells?.[0];
    const name = clean(cell);
    if (name && examples.length < 4 && !examples.includes(name)) examples.push(name);
    keys.push(toolKey(cell));
  }

  if (!rows.length) return null;
  return { tools: rows.length, sections, examples, keys };
}

/**
 * What identifies a tool across shelves: its link, which is what the rows are
 * keyed on in dev-tools/lint-content.mjs, or its name when a row has none.
 * A tool that sits on two shelves has two rows and one key, so the catalog's
 * true size is the number of distinct keys, not the number of rows.
 */
function toolKey(cell) {
  const href = cell?.querySelector?.('a[href]')?.getAttribute('href');
  return (href ? href.replace(/\/+$/, '') : clean(cell)).toLowerCase();
}
