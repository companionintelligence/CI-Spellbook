import { useState, useEffect, useCallback } from 'react';

/** True when a key press belongs to a text field, not to the page. */
export const isEditableTarget = (target) => {
  if (!target || typeof target.closest !== 'function') return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
};

export const useDebugPanel = () => {
  const [debugState, setDebugState] = useState({
    isVisible: false,
    activeTab: 'animations',
    markdownFiles: [],
    performanceMetrics: {
      startTime: performance.now(),
      fps: 0,
      frameCount: 0,
      lastTime: performance.now(),
      memory: 0,
      cardsLoaded: 0,
      totalCards: 10
    }
  });

  const updateDebug = useCallback((stage, expanded, flipped, element) => {
    if (!debugState.isVisible) return;
    
    const rect = element ? element.getBoundingClientRect() : null;
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`Debug: ${stage} - Expanded: ${expanded}, Flipped: ${flipped}`);
    
    // Update debug info in state if needed
    setDebugState(prev => ({
      ...prev,
      currentStage: stage,
      currentExpanded: expanded,
      currentFlipped: flipped,
      currentSize: rect ? `${Math.round(rect.width)}×${Math.round(rect.height)}` : '-',
      currentPosition: rect ? `${Math.round(rect.left)},${Math.round(rect.top)}` : '-',
      lastUpdate: timestamp
    }));
  }, [debugState.isVisible]);

  const toggleDebugPanel = useCallback(() => {
    setDebugState(prev => ({
      ...prev,
      isVisible: !prev.isVisible
    }));
  }, []);

  const hideDebugPanel = useCallback(() => {
    setDebugState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const switchDebugTab = useCallback((tabName) => {
    setDebugState(prev => ({
      ...prev,
      activeTab: tabName
    }));
  }, []);

  const addMarkdownFile = useCallback((fileEntry) => {
    setDebugState(prev => ({
      ...prev,
      markdownFiles: [...prev.markdownFiles, fileEntry],
      performanceMetrics: {
        ...prev.performanceMetrics,
        cardsLoaded: prev.performanceMetrics.cardsLoaded + 1
      }
    }));
  }, []);

  const updateMarkdownFile = useCallback((path, updates) => {
    setDebugState(prev => ({
      ...prev,
      markdownFiles: prev.markdownFiles.map(file => 
        file.path === path ? { ...file, ...updates } : file
      )
    }));
  }, []);

  const isVisible = debugState.isVisible;

  // Performance monitoring. ONE requestAnimationFrame loop, alive only while
  // the panel is on screen.
  //
  // This used to depend on `performanceMetrics.lastTime` — the very value the
  // loop wrote once a second — and the cleanup cancelled only the first frame
  // id. Each re-run therefore started a fresh loop while every earlier loop kept
  // rescheduling itself, and each stale loop then called setState on every
  // frame: ~2k callbacks in the first 5 s, 1.8M in the 25-30 s window, a whole
  // App re-render per frame, with the panel closed. Frame bookkeeping now lives
  // in the effect's closure; nothing the loop writes is something it reads.
  useEffect(() => {
    if (!isVisible) return undefined;

    let frameId = 0;
    let frames = 0;
    let last = performance.now();

    const tick = (now) => {
      frames += 1;
      const elapsed = now - last;

      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed);
        frames = 0;
        last = now;
        setDebugState((prev) => ({
          ...prev,
          performanceMetrics: { ...prev.performanceMetrics, fps, lastTime: now }
        }));
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // `frameId` is reassigned every frame, so this cancels the loop's latest
    // pending frame, not the first one.
    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  // Memory monitoring — same rule: only while someone is looking.
  useEffect(() => {
    if (!isVisible) return undefined;

    const updateMemory = () => {
      if (performance.memory) {
        setDebugState((prev) => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            memory: performance.memory.usedJSHeapSize
          }
        }));
      }
    };

    const interval = setInterval(updateMemory, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Keyboard shortcuts.
  //
  // Ctrl/Cmd + ` toggles the panel. The bare ` / ~ it used to listen for fired
  // while typing in the search field — and called preventDefault, so a query
  // like "~/.config" could not be entered and opened an overlay instead.
  useEffect(() => {
    const handleKeydown = (e) => {
      if (isEditableTarget(e.target)) return;

      if ((e.key === '`' || e.key === '~') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleDebugPanel();
      } else if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        hideDebugPanel();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isVisible, toggleDebugPanel, hideDebugPanel]);

  return {
    debugState,
    updateDebug,
    toggleDebugPanel,
    hideDebugPanel,
    switchDebugTab,
    addMarkdownFile,
    updateMarkdownFile
  };
};
