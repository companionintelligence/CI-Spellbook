import React from 'react';

const TABS = [
  { id: 'animations', label: 'Animation' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'performance', label: 'Perf' }
];

const formatMilliseconds = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '-';
  return `${value.toFixed(1)}ms`;
};

const formatFileSize = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '-';
  return `${(value / 1024).toFixed(1)} KB`;
};

const formatMemory = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 'Not available';
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
};

const getStatusTone = (status) => {
  if (status === 'complete') {
    return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200';
  }

  if (status === 'error') {
    return 'border-rose-400/50 bg-rose-400/10 text-rose-200';
  }

  return 'border-amber-300/50 bg-amber-300/10 text-amber-100';
};

const StatRow = ({ label, value }) => (
  <dl className="grid grid-cols-[auto,1fr] items-center rounded border border-white/10 bg-white/5 px-3 py-2">
    <dt className="text-[11px] uppercase tracking-[0.18em] text-sky-100/70">{label}</dt>
    <dd className="ml-4 max-w-[12rem] truncate text-[11px] font-semibold text-emerald-200">{value}</dd>
  </dl>
);

const DebugPanel = ({ debugState, onClose, onTabSwitch }) => {
  if (!debugState?.isVisible) {
    return null;
  }

  const performanceMetrics = debugState.performanceMetrics ?? {};
  const markdownFiles = debugState.markdownFiles ?? [];
  const currentTab = debugState.activeTab ?? 'animations';
  const totalLoadTime = performanceMetrics.startTime
    ? (performance.now() - performanceMetrics.startTime) / 1000
    : 0;

  return (
    <aside
      className="fixed bottom-5 left-5 z-[15000] flex max-h-[70vh] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border-2 border-[#3784ff] bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] font-mono text-[12px] text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(55,132,255,0.3)] backdrop-blur-md"
      aria-label="Debug panel"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-[linear-gradient(90deg,#3784ff_0%,#4290e3_100%)] px-4 py-3">
        <h3 className="m-0 text-sm font-bold text-white">Spellbook Debug</h3>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Debug panel tabs" className="flex items-center gap-2">
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`debug-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTabSwitch(tab.id)}
                  className={[
                    'rounded border px-2 py-1 text-[10px] transition',
                    isActive
                      ? 'border-white/30 bg-white/30 font-bold text-white'
                      : 'border-white/20 bg-white/10 text-slate-100 hover:bg-white/20'
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/80 text-base leading-none text-white transition hover:scale-110 hover:bg-rose-500"
            aria-label="Close debug panel"
          >
            ×
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4"
        role="tabpanel"
        aria-labelledby={`debug-tab-${currentTab}`}
      >
        {currentTab === 'animations' ? (
          <div className="space-y-4">
            <div>
              <h4 className="mb-3 border-b border-cyan-300/30 pb-1 text-[13px] font-semibold text-cyan-200">Card state</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <StatRow label="Stage" value={debugState.currentStage ?? '-'} />
                <StatRow label="Expanded" value={String(debugState.currentExpanded ?? false)} />
                <StatRow label="Flipped" value={String(debugState.currentFlipped ?? false)} />
                <StatRow label="Size" value={debugState.currentSize ?? '-'} />
                <StatRow label="Position" value={debugState.currentPosition ?? '-'} />
                <StatRow label="Updated" value={debugState.lastUpdate ?? '-'} />
              </div>
            </div>

            <div>
              <h4 className="mb-3 border-b border-cyan-300/30 pb-1 text-[13px] font-semibold text-cyan-200">Controls</h4>
              <p className="text-[11px] leading-5 text-slate-200/80">
                Press <span className="font-semibold text-white">Ctrl</span> or <span className="font-semibold text-white">Cmd</span> + <span className="font-semibold text-white">`</span> to toggle the panel. Press <span className="font-semibold text-white">Esc</span> to close it.
              </p>
            </div>
          </div>
        ) : null}

        {currentTab === 'markdown' ? (
          <div>
            <h4 className="mb-3 border-b border-cyan-300/30 pb-1 text-[13px] font-semibold text-cyan-200">Markdown loads</h4>
            {markdownFiles.length === 0 ? (
              <div className="rounded border border-white/10 bg-white/5 px-4 py-6 text-center italic text-white/50">
                No markdown files loaded yet...
              </div>
            ) : (
              <div className="space-y-2">
                {markdownFiles.map((file) => {
                  const statusTone = getStatusTone(file.status);
                  const filename = file.path?.split('/').pop() ?? file.path ?? 'Unknown file';

                  return (
                    <div
                      key={`${file.path}-${file.containerId}`}
                      className={`rounded border px-3 py-3 ${statusTone}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="truncate text-[11px] font-bold text-cyan-100">{filename}</div>
                        <div className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                          {file.status ?? 'unknown'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-white/75 sm:grid-cols-3">
                        <div>Size: {formatFileSize(file.fileSize)}</div>
                        <div>Load: {formatMilliseconds(file.loadTime)}</div>
                        <div>Parse: {formatMilliseconds(file.parseTime)}</div>
                        <div>Render: {formatMilliseconds(file.renderTime)}</div>
                        <div>Total: {formatMilliseconds(file.totalTime)}</div>
                        <div>ID: {file.containerId ?? '-'}</div>
                      </div>
                      {file.error ? (
                        <div className="mt-2 text-[10px] font-semibold text-rose-200">Error: {file.error}</div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {currentTab === 'performance' ? (
          <div className="space-y-4">
            <div>
              <h4 className="mb-3 border-b border-cyan-300/30 pb-1 text-[13px] font-semibold text-cyan-200">Runtime</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <StatRow label="Session" value={`${totalLoadTime.toFixed(2)}s`} />
                <StatRow label="FPS" value={`${performanceMetrics.fps ?? 0} fps`} />
                <StatRow label="Memory" value={formatMemory(performanceMetrics.memory)} />
                <StatRow
                  label="Cards"
                  value={`${performanceMetrics.cardsLoaded ?? 0}/${performanceMetrics.totalCards ?? 0}`}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 bg-black/30 px-4 py-2 text-center">
        <small className="text-[10px] text-white/40">Developer overlay</small>
      </div>
    </aside>
  );
};

export default DebugPanel;