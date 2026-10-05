import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './components/Card';
import MiniSearch from 'minisearch';
import { loadShelf } from './lib/shelves';
import { markMatches, snippetTerms } from './lib/cardContent';
import {
  BUY_LABEL,
  BUY_URL,
  DOCS_URL,
  DOWNLOAD_LABEL,
  DOWNLOAD_URL,
  HEADLINE,
  HOME_URL,
  HUB_NOTE,
  LEDE,
  LICENSE_URL
} from './lib/site';

import bg1 from './assets/background/background1.webp';
import bg2 from './assets/background/background2.webp';
import bg3 from './assets/background/background3.webp';
import bg4 from './assets/background/background4.webp';
import bg5 from './assets/background/background5.webp';
import bg6 from './assets/background/background6.webp';
import bg7 from './assets/background/background7.webp';
import bg8 from './assets/background/background8.webp';
import bg9 from './assets/background/background9.webp';
import bg10 from './assets/background/background10.webp';
import bg11 from './assets/background/background11.webp';
import bg12 from './assets/background/background12.webp';
import bg13 from './assets/background/background13.webp';

// The debug overlay is a development tool. Behind a constant `import.meta.env.DEV`
// the lazy import is dead code in a production build, so the panel, its
// frame-rate and memory monitors and its global key handler are not shipped.
const DebugHost = import.meta.env.DEV ? React.lazy(() => import('./components/DebugHost')) : null;

// Shelf configuration.
//
// `id` and `containerId` are STABLE KEYS, not descriptions: the video
// storyboard and the shelf anchors address cards by them, so they keep their
// historical names even where the shelf has since been retitled (`xr-spatial` is
// the Desktop Systems shelf). The title is what a reader sees and the file is
// named after it; add a shelf by adding a markdown file and an entry here.
//
// The art is imported, not referenced from public/, so Vite fingerprints it and
// it is served with the immutable long cache the rest of /assets/ gets.
const CARD_CONFIGS = [
  {
    id: 'ai-assisted-code-dev',
    title: 'Developer Tooling & Code Assistants',
    backgroundImage: bg2,
    borderColor: '#58ebbf',
    hoverColor: '88, 235, 191',
    baseColor: '36, 72, 89',
    markdownPath: '/markdown/developer-tooling.md',
    containerId: 'card-ai-assisted-code-dev'
  },
  {
    id: 'ai-agents',
    title: 'AI Agents, Research & Models',
    backgroundImage: bg1,
    borderColor: '#8b5cf6',
    hoverColor: '139, 92, 246',
    baseColor: '45, 27, 78',
    markdownPath: '/markdown/ai-agents.md',
    containerId: 'card-ai-agents'
  },
  {
    id: 'mcp-servers',
    title: 'MCP Servers & Connectors',
    backgroundImage: bg11,
    borderColor: '#60d9ff',
    hoverColor: '96, 217, 255',
    baseColor: '9, 67, 109',
    markdownPath: '/markdown/mcp-servers.md',
    containerId: 'card-mcp-servers'
  },
  {
    id: 'eval-observability',
    title: 'Evals, Observability & Tracing',
    backgroundImage: bg12,
    borderColor: '#bea9ff',
    hoverColor: '190, 169, 255',
    baseColor: '58, 63, 108',
    markdownPath: '/markdown/evals-observability.md',
    containerId: 'card-eval-observability'
  },
  {
    id: 'local-first-ai-tools',
    title: 'Local AI Apps & Model Managers',
    backgroundImage: bg1,
    borderColor: '#3784ff',
    hoverColor: '55, 132, 255',
    baseColor: '7, 21, 51',
    markdownPath: '/markdown/local-ai-apps.md',
    containerId: 'card-local-first-ai-tools'
  },
  {
    id: 'cutting-edge-databases',
    title: 'Data Platforms, Backup & Sync',
    backgroundImage: bg3,
    borderColor: '#4290e3',
    hoverColor: '66, 144, 227',
    baseColor: '52, 52, 78',
    markdownPath: '/markdown/data-platforms.md',
    containerId: 'card-cutting-edge-databases'
  },
  {
    id: 'embeddings-vector',
    title: 'Embeddings & Vector Pipelines',
    backgroundImage: bg13,
    borderColor: '#82ffff',
    hoverColor: '130, 255, 255',
    baseColor: '15, 113, 122',
    markdownPath: '/markdown/embeddings-vector.md',
    containerId: 'card-embeddings-vector'
  },
  {
    id: 'top-public-data-sources',
    title: 'Knowledge, Notes & Productivity',
    backgroundImage: bg4,
    borderColor: '#ff6b6b',
    hoverColor: '255, 107, 107',
    baseColor: '89, 36, 36',
    markdownPath: '/markdown/knowledge-notes.md',
    containerId: 'card-top-public-data-sources'
  },
  {
    id: 'ai-art-gen',
    title: 'Creative Media & AI Art',
    backgroundImage: bg5,
    borderColor: '#ffd93d',
    hoverColor: '255, 217, 61',
    baseColor: '89, 76, 36',
    markdownPath: '/markdown/creative-media.md',
    containerId: 'card-ai-art-gen'
  },
  {
    id: 'speech-tts-stt',
    title: 'Communication, Speech & Collaboration',
    backgroundImage: bg6,
    borderColor: '#6bcf7f',
    hoverColor: '107, 207, 127',
    baseColor: '36, 89, 45',
    markdownPath: '/markdown/speech-collaboration.md',
    containerId: 'card-speech-tts-stt'
  },
  {
    id: 'ai-video-games',
    title: 'Entertainment, Games & Social',
    backgroundImage: bg9,
    borderColor: '#34d399',
    hoverColor: '52, 211, 153',
    baseColor: '36, 89, 67',
    markdownPath: '/markdown/entertainment-games.md',
    containerId: 'card-ai-video-games'
  },
  {
    id: 'xr-spatial',
    title: 'Desktop Systems & Windowing',
    backgroundImage: bg4,
    borderColor: '#06b6d4',
    hoverColor: '6, 182, 212',
    baseColor: '22, 67, 78',
    markdownPath: '/markdown/desktop-systems.md',
    containerId: 'card-xr-spatial'
  },
  {
    id: 'vm-browser-automation',
    title: 'Browsers, Automation & Virtualization',
    backgroundImage: bg8,
    borderColor: '#fb7185',
    hoverColor: '251, 113, 133',
    baseColor: '89, 45, 54',
    markdownPath: '/markdown/browsers-automation.md',
    containerId: 'card-vm-browser-automation'
  },
  {
    id: 'networking-vpn',
    title: 'Security, Privacy & Network Access',
    backgroundImage: bg7,
    borderColor: '#a78bfa',
    hoverColor: '167, 139, 250',
    baseColor: '67, 56, 89',
    markdownPath: '/markdown/security-network.md',
    containerId: 'card-networking-vpn'
  },
  {
    id: 'home-automation',
    title: 'Self-Hosting, Home Server & Smart Home',
    backgroundImage: bg10,
    borderColor: '#fbbf24',
    hoverColor: '251, 191, 36',
    baseColor: '89, 67, 36',
    markdownPath: '/markdown/self-hosting.md',
    containerId: 'card-home-automation'
  },
  {
    id: 'maker-hardware',
    title: 'Hardware, STEM & Edge Labs',
    backgroundImage: bg3,
    borderColor: '#f97316',
    hoverColor: '249, 115, 22',
    baseColor: '78, 45, 22',
    markdownPath: '/markdown/hardware-edge.md',
    containerId: 'card-maker-hardware'
  }
];

// A hyphenated compound ("local-AI", "self-hosting") is one word to the reader, but
// the browser will happily break the line after its hyphen and strand half of it.
// Keep each one whole. The text itself is unchanged, so what a crawler or a screen
// reader gets is exactly HEADLINE.
const keepCompoundsTogether = (text) =>
  text
    .split(/(\b[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+\b)/)
    .map((part, i) =>
      i % 2 ? (
        <span key={i} className="whitespace-nowrap">
          {part}
        </span>
      ) : (
        part
      )
    );

const App = () => {
  const cardConfigs = CARD_CONFIGS;

  const [searchQuery, setSearchQuery] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexError, setIndexError] = useState(null);
  // Shelves the index could not read. One bad file used to throw away the whole
  // index ("Search unavailable" for every shelf); now only that shelf drops out.
  const [missingShelves, setMissingShelves] = useState([]);
  // Bumped when the index finishes, so a query typed while it was still
  // building is searched again instead of staying empty.
  const [indexVersion, setIndexVersion] = useState(0);
  // Tool counts per shelf, for the no-results directory. Counted from the same
  // markdown the index is built from, so it cannot drift from the shelves.
  const [shelfSizes, setShelfSizes] = useState(() => new Map());
  // Distinct tools across all shelves. A tool listed on two shelves is two rows
  // but one tool, so the total is the number of distinct links, not of rows.
  const [distinctTools, setDistinctTools] = useState(0);
  const miniSearchRef = useRef(null);
  const cardTextLinesRef = useRef(new Map());

  const buildSnippetHtml = useCallback((lines, matchLineIndex, query, matchedTerms) => {
    // A "line" is now a whole table row rather than one cell (see
    // lib/cardContent.js), so a window of ten buried the hit under nine
    // unrelated records. Three shows the match with one neighbour either side.
    const windowSize = 3;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(0, matchLineIndex - half);
    const end = Math.min(lines.length - 1, start + windowSize - 1);

    // Mark the terms MiniSearch actually matched, not the literal query — see
    // snippetTerms() for why a fuzzy hit used to come back with nothing marked.
    const terms = snippetTerms(query, matchedTerms);

    const rendered = [];
    if (start > 0) rendered.push('<div class="search-snippet-ellipsis">…</div>');
    for (let i = start; i <= end; i++) {
      const line = lines[i] ?? '';
      if (!line.trim()) continue;
      const cls = i === matchLineIndex ? 'search-snippet-line is-hit' : 'search-snippet-line';
      rendered.push(`<div class="${cls}">${markMatches(line, terms)}</div>`);
    }
    if (end < lines.length - 1) rendered.push('<div class="search-snippet-ellipsis">…</div>');

    return rendered.join('');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const buildIndex = async () => {
      setIsIndexing(true);
      setIndexError(null);
      setMissingShelves([]);

      try {
        const miniSearch = new MiniSearch({
          fields: ['text'],
          storeFields: ['cardId', 'title', 'lineIndex', 'text'],
          searchOptions: {
            prefix: true,
            fuzzy: 0.2,
            boost: { text: 2 }
          }
        });

        // Each shelf is fetched and parsed once for the whole app: the cards
        // ask for the same promises (lib/shelves.js).
        const settled = await Promise.allSettled(
          cardConfigs.map((cfg) => loadShelf(cfg.markdownPath))
        );

        const docs = [];
        const linesMap = new Map();
        const sizeMap = new Map();
        const toolKeys = new Set();
        const missing = [];
        let firstFailure = null;

        settled.forEach((result, index) => {
          const cfg = cardConfigs[index];
          if (result.status !== 'fulfilled') {
            missing.push(cfg.title);
            firstFailure ??= result.reason;
            return;
          }

          const { lines, summary } = result.value;
          if (summary) {
            sizeMap.set(cfg.id, summary.tools);
            for (const key of summary.keys) toolKeys.add(key);
          }

          linesMap.set(cfg.id, lines);

          for (let i = 0; i < lines.length; i++) {
            const text = lines[i];
            if (!text || !text.trim()) continue;
            docs.push({
              id: `${cfg.id}:${i}`,
              cardId: cfg.id,
              title: cfg.title,
              lineIndex: i,
              text
            });
          }
        });

        if (missing.length === cardConfigs.length) {
          throw firstFailure ?? new Error('No shelf could be loaded');
        }

        if (cancelled) return;

        miniSearch.addAll(docs);
        miniSearchRef.current = miniSearch;
        cardTextLinesRef.current = linesMap;
        setShelfSizes(sizeMap);
        setDistinctTools(toolKeys.size);
        setMissingShelves(missing);
        setIndexVersion((v) => v + 1);
      } catch (e) {
        console.error('Search index build failed:', e);
        if (!cancelled) setIndexError(e?.message || String(e));
      } finally {
        if (!cancelled) setIsIndexing(false);
      }
    };

    buildIndex();

    return () => {
      cancelled = true;
    };
  }, [cardConfigs]);

  const searchResultsByCard = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return new Map();
    if (!miniSearchRef.current) return new Map();

    // No `limit`. It used to be 200 ACROSS ALL SHELVES, which meant the per
    // shelf "N hits" the cards print was really "N of the global top 200" —
    // a number that shrank as other shelves matched harder. A count on screen
    // has to be the true count.
    const results = miniSearchRef.current.search(query);
    const grouped = new Map();

    for (const r of results) {
      const existing = grouped.get(r.cardId);
      if (!existing) {
        grouped.set(r.cardId, { best: r, all: [r] });
        continue;
      }
      existing.all.push(r);
      // Results arrive score-descending today, but don't rely on it: the old
      // code reset `all` to [r] whenever a better hit turned up, silently
      // discarding every match counted so far.
      if (r.score > existing.best.score) existing.best = r;
    }

    return grouped;
    // indexVersion: the index is a ref, so nothing else says it has arrived.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, indexVersion]);

  const visibleCardConfigs = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return cardConfigs;
    return cardConfigs.filter((cfg) => searchResultsByCard.has(cfg.id));
  }, [cardConfigs, searchQuery, searchResultsByCard]);

  const noResults =
    Boolean(searchQuery.trim()) && !isIndexing && !indexError && visibleCardConfigs.length === 0;

  // A miss is where a catalog is most likely to lose someone, and the old panel
  // was a dead end: two lines of advice on an otherwise empty page. MiniSearch
  // can already answer "did you mean" from the index it has — no new data, no
  // authored copy — so ask it, and only show the line if it comes back with a
  // real alternative.
  const didYouMean = useMemo(() => {
    const query = searchQuery.trim();
    if (!noResults || !query || !miniSearchRef.current) return null;
    try {
      const [top] = miniSearchRef.current.autoSuggest(query, { fuzzy: 0.4, prefix: true });
      const suggestion = top?.suggestion?.trim();
      if (!suggestion || suggestion.toLowerCase() === query.toLowerCase()) return null;
      return suggestion;
    } catch {
      return null;
    }
  }, [noResults, searchQuery]);

  // Clear the query and take the reader to the shelf they picked. Without this
  // the directory would only be a list of names, which is decoration.
  //
  // The scroll cannot happen in the click handler: clearing the query swaps the
  // no-results panel for all sixteen cards, and the target does not exist until
  // React has committed that render. So record the target and scroll from an
  // effect, which runs after the commit.
  const [pendingShelf, setPendingShelf] = useState(null);

  useEffect(() => {
    if (!pendingShelf) return;
    document
      .getElementById(`shelf-${pendingShelf}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setPendingShelf(null);
  }, [pendingShelf]);

  const goToShelf = useCallback((containerId) => {
    setSearchQuery('');
    setPendingShelf(containerId);
  }, []);

  // What a screen reader hears when the shelves change under a search: the
  // visual result is cards appearing and disappearing, which is silent.
  const searchStatus = (() => {
    const query = searchQuery.trim();
    if (!query || isIndexing || indexError) return '';
    if (visibleCardConfigs.length === 0) return `No shelves match ${query}.`;
    return `${visibleCardConfigs.length} ${visibleCardConfigs.length === 1 ? 'shelf matches' : 'shelves match'} ${query}.`;
  })();

  return (
    <div className="min-h-screen">
      <a className="skip-link" href="#shelves">
        Skip to the shelves
      </a>

      <header className="site-header">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="topbar">
            {/* The way back to the main site. The mark is decorative: the link's
                name is the words beside it. */}
            <a className="brand-link" href={HOME_URL}>
              <img src="/logo/mark.svg" alt="" width="40" height="40" className="brand-mark" />
              <span>Companion Intelligence</span>
            </a>

            <nav className="topnav" aria-label="Companion Intelligence">
              <a className="topnav-link" href={DOCS_URL}>
                Docs
              </a>
              <a className="cta cta-secondary" href={DOWNLOAD_URL}>
                {DOWNLOAD_LABEL}
              </a>
              <a className="cta cta-primary" href={BUY_URL}>
                {BUY_LABEL}
              </a>
            </nav>
          </div>

          <div className="hero">
            <h1 className="hero-title">{keepCompoundsTogether(HEADLINE)}</h1>
            <p className="hero-lede">{LEDE}</p>

            {/* Search Bar */}
            <form
              className="app-search"
              role="search"
              aria-label="Search the Spellbook"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search the Spellbook..."
                  aria-label="Search the Spellbook"
                  className="app-search-input w-full h-12 pl-4 pr-12 transition rounded-lg shadow-md"
                  autoComplete="off"
                  spellCheck="false"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  className="app-search-button absolute transition right-3"
                  aria-label={searchQuery.trim() ? 'Clear search' : 'Search'}
                  onClick={() => setSearchQuery('')}
                >
                  {searchQuery.trim() ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* The slot is always there, so the note arriving (and leaving once the
                  index is built) does not push the shelves down and back up. */}
              <div className="app-search-slot">
                {(isIndexing || indexError || missingShelves.length > 0) && (
                  <div
                    className={`app-search-note${indexError ? ' is-error' : ''}`}
                    role={indexError ? 'alert' : 'status'}
                  >
                    {indexError
                      ? `Search unavailable: ${indexError}`
                      : isIndexing
                        ? 'Indexing spellbook for search…'
                        : `Search is missing ${missingShelves.length === 1 ? 'one shelf' : `${missingShelves.length} shelves`}: ${missingShelves.join(', ')}.`}
                  </div>
                )}
              </div>
              <p className="sr-only" role="status" aria-live="polite">
                {searchStatus}
              </p>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="shelves" tabIndex={-1} className="container p-4 mx-auto sm:p-6 lg:p-8">
        <div className="flex flex-wrap justify-center gap-8" id="cards-container">
          {noResults ? (
            <div className="no-results-panel">
              <div className="no-results-head">
                <div className="no-results-title">
                  Nothing on the shelves matches “{searchQuery.trim()}”
                </div>
                {didYouMean ? (
                  <div className="no-results-suggest">
                    Did you mean{' '}
                    <button
                      type="button"
                      className="no-results-didyoumean"
                      onClick={() => setSearchQuery(didYouMean)}
                    >
                      {didYouMean}
                    </button>
                    ?
                  </div>
                ) : (
                  <div className="no-results-suggest">Try fewer words, or a broader term.</div>
                )}
              </div>

              {/* The whole pitch of the Spellbook is how much is on it. A miss is
                  the one screen that used to say nothing about that at all. */}
              <div className="no-results-browse">
                Or open a shelf
                {distinctTools ? ` — ${distinctTools} tools across ${cardConfigs.length} of them` : ''}:
              </div>
              <ul className="no-results-shelves">
                {cardConfigs.map((cfg) => (
                  <li key={cfg.id}>
                    <button
                      type="button"
                      className="no-results-shelf"
                      style={{ borderColor: cfg.borderColor }}
                      onClick={() => goToShelf(cfg.containerId)}
                    >
                      <span className="no-results-shelf-name">{cfg.title}</span>
                      {shelfSizes.has(cfg.id) ? (
                        <span className="no-results-shelf-count">
                          {shelfSizes.get(cfg.id)} tools
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {visibleCardConfigs.map((config) => {
            const query = searchQuery.trim();
            const group = query ? searchResultsByCard.get(config.id) : null;
            const lines = cardTextLinesRef.current.get(config.id) || [];
            const matchLineIndex = group?.best?.lineIndex;
            const snippetHtml =
              query && typeof matchLineIndex === 'number'
                ? buildSnippetHtml(lines, matchLineIndex, query, group?.best?.terms)
                : null;

            return (
              <Card
                key={config.id}
                title={config.title}
                backgroundImage={config.backgroundImage}
                borderColor={config.borderColor}
                hoverColor={config.hoverColor}
                baseColor={config.baseColor}
                markdownPath={config.markdownPath}
                containerId={config.containerId}
                searchMode={Boolean(query)}
                searchSnippetHtml={snippetHtml}
                searchMeta={
                  query
                    ? {
                        query,
                        matchCount: group?.all?.length ?? 0
                      }
                    : null
                }
              />
            );
          })}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          {/* The same two calls to action as the header, where a reader who has
              read to the bottom of sixteen shelves is looking for what to do next. */}
          <section className="cta-band" aria-labelledby="cta-band-title">
            <div className="cta-band-copy">
              <h2 id="cta-band-title">Get Companion</h2>
              <p>{HUB_NOTE}</p>
            </div>
            <div className="cta-band-actions">
              <a className="cta cta-secondary" href={DOWNLOAD_URL}>
                {DOWNLOAD_LABEL}
              </a>
              <a className="cta cta-primary" href={BUY_URL}>
                {BUY_LABEL}
              </a>
            </div>
          </section>

          <nav className="footer-links" aria-label="Companion Intelligence links">
            <a href={HOME_URL}>Companion Intelligence</a>
            <a href={DOCS_URL}>Docs</a>
          </nav>

          <p className="footer-legal">
            Copyright LifeScope INC, DBA Companion Intelligence. Licensed under the{' '}
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
              PolyForm Noncommercial License 1.0.0
            </a>
            .
          </p>
        </div>
      </footer>

      {DebugHost ? (
        <Suspense fallback={null}>
          <DebugHost />
        </Suspense>
      ) : null}
    </div>
  );
};

export default App;
