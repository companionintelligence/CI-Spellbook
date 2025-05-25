import React from 'react';

const DebugPanel = ({ 
  debugState, 
  onClose, 
  onTabSwitch 
}) => {
  const { isVisible, activeTab, markdownFiles, performanceMetrics } = debugState;

  if (!isVisible) return null;

  const formatTime = (time) => time > 0 ? `${time.toFixed(1)}ms` : '-';
  const formatSize = (bytes) => bytes > 0 ? `${(bytes / 1024).toFixed(1)}KB` : '-';

  return (
    <div className="debug-panel fixed top-4 right-4 w-96 bg-slate-800 border-2 border-blue-500 rounded-lg shadow-xl z-[9999] max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="debug-header bg-slate-700 p-3 flex justify-between items-center">
        <h3 className="text-white font-bold">🛠️ Development Debug Console</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabSwitch('animations')}
            className={`px-2 py-1 text-xs rounded ${
              activeTab === 'animations' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            }`}
          >
            Animations
          </button>
          <button
            onClick={() => onTabSwitch('markdown')}
            className={`px-2 py-1 text-xs rounded ${
              activeTab === 'markdown' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => onTabSwitch('performance')}
            className={`px-2 py-1 text-xs rounded ${
              activeTab === 'performance' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            }`}
          >
            Performance
          </button>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto max-h-96">
        {/* Animation Tab */}
        {activeTab === 'animations' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">🎬 Current Animation State</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-300">
                <span className="font-medium">Stage:</span>
                <span className="ml-2 text-green-400">{debugState.currentStage || 'Initial'}</span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Expanded:</span>
                <span className="ml-2 text-blue-400">{debugState.currentExpanded ? 'true' : 'false'}</span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Flipped:</span>
                <span className="ml-2 text-purple-400">{debugState.currentFlipped ? 'true' : 'false'}</span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Size:</span>
                <span className="ml-2 text-yellow-400">{debugState.currentSize || '-'}</span>
              </div>
              <div className="text-gray-300 col-span-2">
                <span className="font-medium">Position:</span>
                <span className="ml-2 text-orange-400">{debugState.currentPosition || '-'}</span>
              </div>
              <div className="text-gray-300 col-span-2">
                <span className="font-medium">Updated:</span>
                <span className="ml-2 text-cyan-400">{debugState.lastUpdate || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Markdown Tab */}
        {activeTab === 'markdown' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">📝 Markdown Processing</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {markdownFiles.length === 0 ? (
                <div className="text-gray-400 text-sm">No markdown files loaded yet...</div>
              ) : (
                markdownFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border text-xs ${
                      file.status === 'error'
                        ? 'border-red-500 bg-red-900/20'
                        : file.status === 'complete'
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-yellow-500 bg-yellow-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-white truncate">
                        {file.path.split('/').pop()}
                      </span>
                      <span
                        className={`px-1 py-0.5 rounded text-xs ${
                          file.status === 'error'
                            ? 'bg-red-500 text-white'
                            : file.status === 'complete'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {file.status}
                      </span>
                    </div>
                    <div className="text-gray-300 space-y-0.5">
                      {file.fileSize > 0 && <div>Size: {formatSize(file.fileSize)}</div>}
                      {file.loadTime > 0 && <div>Load: {formatTime(file.loadTime)}</div>}
                      {file.parseTime > 0 && <div>Parse: {formatTime(file.parseTime)}</div>}
                      {file.renderTime > 0 && <div>Render: {formatTime(file.renderTime)}</div>}
                      {file.totalTime > 0 && <div>Total: {formatTime(file.totalTime)}</div>}
                      {file.error && (
                        <div className="text-red-400 mt-1">Error: {file.error}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">⚡ Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-300">
                <span className="font-medium">Total Load Time:</span>
                <span className="ml-2 text-green-400">
                  {((performance.now() - performanceMetrics.startTime) / 1000).toFixed(2)}s
                </span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Animation FPS:</span>
                <span className="ml-2 text-blue-400">{performanceMetrics.fps} fps</span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Memory Usage:</span>
                <span className="ml-2 text-purple-400">
                  {performanceMetrics.memory > 0 
                    ? `${(performanceMetrics.memory / 1024 / 1024).toFixed(1)} MB`
                    : 'Not available'
                  }
                </span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Cards Rendered:</span>
                <span className="ml-2 text-yellow-400">
                  {performanceMetrics.cardsLoaded}/{performanceMetrics.totalCards}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-700 p-2 text-center">
        <small className="text-gray-400">Press ` or ~ to toggle | ESC to close</small>
      </div>
    </div>
  );
};

export default DebugPanel;
