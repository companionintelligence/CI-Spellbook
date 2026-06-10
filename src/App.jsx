import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './components/Card';
import DebugPanel from './components/DebugPanel';
import { useDebugPanel } from './hooks/useDebugPanel';
import MiniSearch from 'minisearch';
import marked from './lib/markdown';

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
  const miniSearchRef = useRef(null);
  const cardTextLinesRef = useRef(new Map());

  const escapeHtml = useCallback((value) => {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }, []);

  const buildSnippetHtml = useCallback((lines, matchLineIndex, query) => {
    const windowSize = 10;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(0, matchLineIndex - half);
    const end = Math.min(lines.length - 1, start + windowSize - 1);

    const terms = String(query)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 8);

    const highlightLine = (line) => {
      let safe = escapeHtml(line);
      for (const term of terms) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!escaped) continue;
        safe = safe.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
      }
      return safe;
    };

    const rendered = [];
    if (start > 0) rendered.push('<div class="search-snippet-ellipsis">…</div>');
    for (let i = start; i <= end; i++) {
      const line = lines[i] ?? '';
      if (!line.trim()) continue;
      const cls = i === matchLineIndex ? 'search-snippet-line is-hit' : 'search-snippet-line';
      rendered.push(`<div class="${cls}">${highlightLine(line)}</div>`);
    }
    if (end < lines.length - 1) rendered.push('<div class="search-snippet-ellipsis">…</div>');

    return rendered.join('');
  }, [escapeHtml]);

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
            const html = marked.parse(markdownText);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const text = doc.body?.innerText || doc.body?.textContent || '';
            return text
              .split(/\r?\n/)
              .map((l) => l.replace(/\s+$/g, ''));
          } catch {
            return String(markdownText)
              .split(/\r?\n/)
              .map((l) => l.replace(/\s+$/g, ''));
          }
        };

        const docs = [];
        const linesMap = new Map();

        for (const cfg of cardConfigs) {
          const res = await fetch(cfg.markdownPath);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${cfg.markdownPath}: ${res.status} ${res.statusText}`);
          }
          const markdownText = await res.text();

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

    const results = miniSearchRef.current.search(query, { limit: 200 });
    const grouped = new Map();

    for (const r of results) {
      const existing = grouped.get(r.cardId);
      if (!existing || r.score > existing.best.score) {
        grouped.set(r.cardId, { best: r, all: [r] });
      } else {
        existing.all.push(r);
      }
    }

    return grouped;
  }, [searchQuery]);

  const visibleCardConfigs = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return cardConfigs;
    return cardConfigs.filter((cfg) => searchResultsByCard.has(cfg.id));
  }, [cardConfigs, searchQuery, searchResultsByCard]);

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
        <header className="py-1 flex justify-between items-center relative z-[100]">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo/2024_CI__LogoMark_light.png" 
              alt="Companion Intelligence Logo" 
              className="w-auto h-36" 
            />
          </div>
          
          {/* Search Bar */}
          <form className="grow ml-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search the Spellbook..." 
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
                style={{ color: '#abd4d8' }}
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
              <div className="mt-2 text-xs" style={{ color: indexError ? '#fca5a5' : '#abd4d8' }}>
                {indexError ? `Search unavailable: ${indexError}` : 'Indexing spellbook for search…'}
              </div>
            )}
          </form>
        </header>
      </div>

      {/* Main Content */}
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <div className="flex flex-wrap justify-center gap-8" id="cards-container">
          {searchQuery.trim() && !isIndexing && !indexError && visibleCardConfigs.length === 0 ? (
            <div className="w-full max-w-3xl rounded-xl border border-white/10 p-8 text-center" style={{ background: 'rgba(52, 52, 78, 0.55)', color: '#d2f6ff' }}>
              <div className="text-xl font-semibold">No results</div>
              <div className="mt-2 opacity-80">Try fewer words, or a broader term.</div>
            </div>
          ) : null}
          {visibleCardConfigs.map((config) => {
            const query = searchQuery.trim();
            const group = query ? searchResultsByCard.get(config.id) : null;
            const lines = cardTextLinesRef.current.get(config.id) || [];
            const matchLineIndex = group?.best?.lineIndex;
            const snippetHtml =
              query && typeof matchLineIndex === 'number'
                ? buildSnippetHtml(lines, matchLineIndex, query)
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
