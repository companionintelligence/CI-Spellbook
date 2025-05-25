import { useState, useEffect, useRef, useCallback } from 'react';

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

  const frameCountRef = useRef(0);

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

  // Performance monitoring
  useEffect(() => {
    const updateFPS = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      if (now >= debugState.performanceMetrics.lastTime + 1000) {
        const fps = Math.round(
          (frameCountRef.current * 1000) / 
          (now - debugState.performanceMetrics.lastTime)
        );
        
        setDebugState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            fps,
            lastTime: now
          }
        }));
        
        frameCountRef.current = 0;
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    const animationId = requestAnimationFrame(updateFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, [debugState.performanceMetrics.lastTime]);

  // Memory monitoring
  useEffect(() => {
    const updateMemory = () => {
      if (performance.memory) {
        setDebugState(prev => ({
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
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        toggleDebugPanel();
      } else if (e.key === 'Escape' && debugState.isVisible) {
        e.preventDefault();
        hideDebugPanel();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [debugState.isVisible, toggleDebugPanel, hideDebugPanel]);

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
