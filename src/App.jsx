import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './components/Card';
import DebugPanel from './components/DebugPanel';
import { useDebugPanel } from './hooks/useDebugPanel';
import MiniSearch from 'minisearch';
import marked from './lib/markdown';
import {
  htmlToSearchLines,
  markMatches,
  snippetTerms,
  summarizeCardHtml
} from './lib/cardContent';

// Card configuration
const CARD_CONFIGS = [
  {
    id: 'ai-assisted-code-dev',
    title: 'Developer Tooling & Code Assistants',
    backgroundImage: '/background/background2.png',
    borderColor: '#58ebbf',
    hoverColor: '88, 235, 191',
    baseColor: '36, 72, 89',
    markdownPath: '/markdown/AI-Assisted Code Development.md',
    containerId: 'card-ai-assisted-code-dev'
  },
  {
    id: 'ai-agents',
    title: 'AI Agents, Research & Models',
    backgroundImage: '/background/background1.jpg',
    borderColor: '#8b5cf6',
    hoverColor: '139, 92, 246',
    baseColor: '45, 27, 78',
    markdownPath: '/markdown/AI Agents & Autonomous Systems.md',
    containerId: 'card-ai-agents'
  },
  {
    id: 'mcp-servers',
    title: 'MCP Servers & Connectors',
    backgroundImage: '/background/background11.png',
    borderColor: '#60d9ff',
    hoverColor: '96, 217, 255',
    baseColor: '9, 67, 109',
    markdownPath: '/markdown/MCP Servers & Connectors.md',
    containerId: 'card-mcp-servers'
  },
  {
    id: 'eval-observability',
    title: 'Evals, Observability & Tracing',
    backgroundImage: '/background/background12.png',
    borderColor: '#bea9ff',
    hoverColor: '190, 169, 255',
    baseColor: '58, 63, 108',
    markdownPath: '/markdown/Evaluation, Observability & Tracing.md',
    containerId: 'card-eval-observability'
  },
  {
    id: 'local-first-ai-tools',
    title: 'Local AI Apps & Model Managers',
    backgroundImage: '/background/background1.jpg',
    borderColor: '#3784ff',
    hoverColor: '55, 132, 255',
    baseColor: '7, 21, 51',
    markdownPath: '/markdown/Local-First AI Tools.md',
    containerId: 'card-local-first-ai-tools'
  },
  {
    id: 'cutting-edge-databases',
    title: 'Data Platforms, Backup & Sync',
    backgroundImage: '/background/background3.png',
    borderColor: '#4290e3',
    hoverColor: '66, 144, 227',
    baseColor: '52, 52, 78',
    markdownPath: '/markdown/Cutting Edge Databases.md',
    containerId: 'card-cutting-edge-databases'
  },
  {
    id: 'embeddings-vector',
    title: 'Embeddings & Vector Pipelines',
    backgroundImage: '/background/background13.png',
    borderColor: '#82ffff',
    hoverColor: '130, 255, 255',
    baseColor: '15, 113, 122',
    markdownPath: '/markdown/Embeddings & Vector Pipelines.md',
    containerId: 'card-embeddings-vector'
  },
  {
    id: 'top-public-data-sources',
    title: 'Knowledge, Notes & Productivity',
    backgroundImage: '/background/background4.png',
    borderColor: '#ff6b6b',
    hoverColor: '255, 107, 107',
    baseColor: '89, 36, 36',
    markdownPath: '/markdown/Top Public Data Sources.md',
    containerId: 'card-top-public-data-sources'
  },
  {
    id: 'ai-art-gen',
    title: 'Creative Media & AI Art',
    backgroundImage: '/background/background5.png',
    borderColor: '#ffd93d',
    hoverColor: '255, 217, 61',
    baseColor: '89, 76, 36',
    markdownPath: '/markdown/AI Art Generation Images 3D and Video.md',
    containerId: 'card-ai-art-gen'
  },
  {
    id: 'speech-tts-stt',
    title: 'Communication, Speech & Collaboration',
    backgroundImage: '/background/background6.png',
    borderColor: '#6bcf7f',
    hoverColor: '107, 207, 127',
    baseColor: '36, 89, 45',
    markdownPath: '/markdown/Speech-to-Text & Text-to-Speech.md',
    containerId: 'card-speech-tts-stt'
  },
  {
    id: 'ai-video-games',
    title: 'Entertainment, Games & Social',
    backgroundImage: '/background/background9.png',
    borderColor: '#34d399',
    hoverColor: '52, 211, 153',
    baseColor: '36, 89, 67',
    markdownPath: '/markdown/AI in Video Games & Virtual Beings.md',
    containerId: 'card-ai-video-games'
  },
  {
    id: 'xr-spatial',
    title: 'Desktop Systems & Windowing',
    backgroundImage: '/background/background4.png',
    borderColor: '#06b6d4',
    hoverColor: '6, 182, 212',
    baseColor: '22, 67, 78',
    markdownPath: '/markdown/XR & Spatial Computing.md',
    containerId: 'card-xr-spatial'
  },
  {
    id: 'vm-browser-automation',
    title: 'Browsers, Automation & Virtualization',
    backgroundImage: '/background/background8.png',
    borderColor: '#fb7185',
    hoverColor: '251, 113, 133',
    baseColor: '89, 45, 54',
    markdownPath: '/markdown/Virtual Machine and Browser Automation and Scrapers.md',
    containerId: 'card-vm-browser-automation'
  },
  {
    id: 'networking-vpn',
    title: 'Security, Privacy & Network Access',
    backgroundImage: '/background/background7.png',
    borderColor: '#a78bfa',
    hoverColor: '167, 139, 250',
    baseColor: '67, 56, 89',
    markdownPath: '/markdown/Networking VPN & Infrastructure Security.md',
    containerId: 'card-networking-vpn'
  },
  {
    id: 'home-automation',
    title: 'Self-Hosting, Home Server & Smart Home',
    backgroundImage: '/background/background10.png',
    borderColor: '#fbbf24',
    hoverColor: '251, 191, 36',
    baseColor: '89, 67, 36',
    markdownPath: '/markdown/Home Automation & Security.md',
    containerId: 'card-home-automation'
  },
  {
    id: 'maker-hardware',
    title: 'Hardware, STEM & Edge Labs',
    backgroundImage: '/background/background3.png',
    borderColor: '#f97316',
    hoverColor: '249, 115, 22',
    baseColor: '78, 45, 22',
    markdownPath: '/markdown/Maker & Hardware Prototyping.md',
    containerId: 'card-maker-hardware'
  }
];

const App = () => {
  const {
    debugState,
    updateDebug,
    hideDebugPanel,
    switchDebugTab,
    addMarkdownFile,
    updateMarkdownFile
  } = useDebugPanel();

  const cardConfigs = CARD_CONFIGS;

  const [searchQuery, setSearchQuery] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexError, setIndexError] = useState(null);
  // Tool counts per shelf, for the no-results directory. Counted from the same
  // markdown the index is built from, so it cannot drift from the shelves.
  const [shelfSizes, setShelfSizes] = useState(() => new Map());
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

        const parseMdToTextLines = (markdownText) => {
          try {
            return htmlToSearchLines(marked.parse(markdownText));
          } catch {
            return String(markdownText)
              .split(/\r?\n/)
              .map((l) => l.replace(/\s+$/g, ''));
          }
        };

        const docs = [];
        const linesMap = new Map();
        const sizeMap = new Map();

        for (const cfg of cardConfigs) {
          const res = await fetch(cfg.markdownPath);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${cfg.markdownPath}: ${res.status} ${res.statusText}`);
          }
          const markdownText = await res.text();

          try {
            const summary = summarizeCardHtml(marked.parse(markdownText));
            if (summary) sizeMap.set(cfg.id, summary.tools);
          } catch {
            /* a shelf with no countable table just has no number in the directory */
          }

          const lines = parseMdToTextLines(markdownText);
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
        }

        if (cancelled) return;

        miniSearch.addAll(docs);
        miniSearchRef.current = miniSearch;
        cardTextLinesRef.current = linesMap;
        setShelfSizes(sizeMap);
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
  }, [searchQuery]);

  const visibleCardConfigs = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return cardConfigs;
    return cardConfigs.filter((cfg) => searchResultsByCard.has(cfg.id));
  }, [cardConfigs, searchQuery, searchResultsByCard]);

  const noResults =
    Boolean(searchQuery.trim()) && !isIndexing && !indexError && visibleCardConfigs.length === 0;

  const shelfTotal = useMemo(
    () => Array.from(shelfSizes.values()).reduce((sum, n) => sum + n, 0),
    [shelfSizes]
  );

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

  const handleMarkdownLoad = useCallback((fileEntry) => {
    if (fileEntry.status === 'loading') {
      addMarkdownFile(fileEntry);
    } else {
      updateMarkdownFile(fileEntry.path, fileEntry);
    }
  }, [addMarkdownFile, updateMarkdownFile]);

  const handleCardExpand = useCallback(() => {
    // This could be used to close other cards if needed
    // For now, the individual card hooks handle their own state
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <header className="app-header py-1 flex justify-between items-center relative z-[100]">
          {/* Logo — h-36 (144px) ate a third of a 360px viewport and squeezed
              the search field until its own placeholder was cut to "Search the
              Spell". Scales down with the viewport now. */}
          <div className="flex items-center">
            <img
              src="/logo/mark-192.png"
              alt="Companion Intelligence Logo"
              className="app-logo w-auto"
            />
          </div>

          {/* Search Bar */}
          <form className="grow ml-8 app-search" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search the Spellbook..."
                aria-label="Search the Spellbook"
                className="w-full h-12 pl-4 pr-12 text-white transition rounded-lg shadow-md focus:outline-none focus:ring-2"
                style={{
                  background: 'rgba(52, 52, 78, 0.8)',
                  border: '1px solid #3784ff',
                  color: '#d2f6ff'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute transition right-3 hover:text-blue-300 focus:outline-none" 
                style={{ color: 'var(--primary)' }}
                aria-label={searchQuery.trim() ? 'Clear search' : 'Search'}
                onClick={() => setSearchQuery('')}
              >
                {searchQuery.trim() ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                )}
              </button>
            </div>
            {(isIndexing || indexError) && (
              <div className="mt-2 text-xs" style={{ color: indexError ? '#fca5a5' : 'var(--primary)' }}>
                {indexError ? `Search unavailable: ${indexError}` : 'Indexing spellbook for search…'}
              </div>
            )}
          </form>
        </header>
      </div>

      {/* Main Content */}
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
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
                {shelfTotal ? ` — ${shelfTotal} tools across ${cardConfigs.length} of them` : ''}:
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
              onCardExpand={handleCardExpand}
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
      </div>

      {/* Debug Panel */}
      <DebugPanel
        debugState={debugState}
        onClose={hideDebugPanel}
        onTabSwitch={switchDebugTab}
      />
    </div>
  );
};

export default App;
