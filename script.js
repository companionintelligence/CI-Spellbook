// Original renderMarkdownCard function - replaced by enhanced version below
document.addEventListener('DOMContentLoaded', function () {
  // Select all card groups
  const cardGroups = document.querySelectorAll('.group');
  
  cardGroups.forEach(group => {
    let isExpanded = false;
    let isFlipped = false;
    
    // Enhanced function to update debug panel with comprehensive tracking
    function updateDebug(stage, expanded, flipped, element) {
      const debugPanel = document.getElementById('debug-panel');
      if (debugPanel && !debugPanel.classList.contains('hidden')) {
        const rect = element ? element.getBoundingClientRect() : null;
        const styles = element ? window.getComputedStyle(element) : null;
        const timestamp = new Date().toLocaleTimeString();
        
        // Update animation debug values with flash effect
        const updateValue = (id, value) => {
          const elem = document.getElementById(id);
          if (elem) {
            elem.textContent = value;
            elem.classList.add('updated');
            setTimeout(() => elem.classList.remove('updated'), 300);
          }
        };
        
        updateValue('debug-stage', stage);
        updateValue('debug-expanded', expanded);
        updateValue('debug-value-flipped', flipped);
        updateValue('debug-size', rect ? `${Math.round(rect.width)}×${Math.round(rect.height)}` : '-');
        updateValue('debug-position', rect ? `${Math.round(rect.left)},${Math.round(rect.top)}` : '-');
        updateValue('debug-parent', element ? (element.parentElement ? element.parentElement.tagName : 'none') : '-');
        updateValue('debug-classes', element ? element.className.split(' ').slice(-3).join(' ') : '-');
        updateValue('debug-time', timestamp);
        
        // Flash the debug panel to indicate updates
        debugPanel.style.borderColor = '#00ff88';
        setTimeout(() => debugPanel.style.borderColor = '#3784ff', 150);
      }
    }

    // Function to expand card with 5-stage animation
    function expandCard() {
      // Close all other cards first
      cardGroups.forEach(g => {
        if (g !== group) {
          closeCard(g);
        }
      });
      
      // Store original dimensions for animation
      const rect = group.getBoundingClientRect();
      group.style.setProperty('--card-original-height', rect.height + 'px');
      group.style.setProperty('--card-original-width', rect.width + 'px');
      
      // Stage 1: Expand width (0.8s)
      group.classList.add('expanding-width');
      isExpanded = true;
      updateDebug('1 - Width Expansion', isExpanded, isFlipped, group);
      // addBackdropListener(); // Disabled - only close with X button
      
      // Stage 2: Expand height (0.6s)
      setTimeout(() => {
        if (isExpanded) {
          group.classList.remove('expanding-width');
          group.classList.add('expanding-height');
          updateDebug('2 - Height Expansion', isExpanded, isFlipped, group);
        }
      }, 800);
      
      // Stage 3: Flip card (0.8s)
      setTimeout(() => {
        if (isExpanded) {
          // Keep expanding-height class and add flipped
          group.classList.add('flipped');
          isFlipped = true;
          updateDebug('3 - Card Flip', isExpanded, isFlipped, group);
        }
      }, 1400);
      
      // Stage 4: Expand to larger size with smooth animation (0.8s)
      setTimeout(() => {
        if (isExpanded && isFlipped) {
          updateDebug('4 - Full Screen (Starting)', isExpanded, isFlipped, group);
          
          // Remove intermediate classes
          group.classList.remove('expanding-width', 'expanding-height');
          
          // Add the full-expanded class for final size
          group.classList.add('full-expanded');
          
          updateDebug('4 - Full Screen (Animating)', isExpanded, isFlipped, group);
          
          // Update debug when animation completes
          setTimeout(() => {
            updateDebug('4 - Full Screen (Complete)', isExpanded, isFlipped, group);
          }, 800);
        }
      }, 2200);
      
      // Stage 5: Fade in content with staggered animations (0.8s)
      setTimeout(() => {
        if (isExpanded && isFlipped) {
          group.classList.add('content-visible');
          updateDebug('5 - Content Visible', isExpanded, isFlipped, group);
        }
      }, 3000);
    }
    
    // Function to close card with mirrored 5-stage animation
    function closeCard(cardElement = group) {
      const isTargetCard = cardElement === group;
      
      if (isTargetCard) {
        updateDebug('Close 1 - Content Fade', false, true, cardElement);
        
        // Stage 1: Fade out content (0.4s)
        cardElement.classList.add('closing-content');
        cardElement.classList.remove('content-visible');
        
        // Stage 2: Shrink from full width (0.6s)
        setTimeout(() => {
          updateDebug('Close 2 - Width Shrink', false, true, cardElement);
          cardElement.classList.remove('full-expanded', 'closing-content');
          cardElement.classList.add('closing-shrink');
        }, 400);
        
        // Stage 3: Unflip card (0.8s)
        setTimeout(() => {
          updateDebug('Close 3 - Unflip', false, false, cardElement);
          cardElement.classList.remove('flipped', 'closing-shrink');
          cardElement.classList.add('closing-unflip');
          if (isTargetCard) isFlipped = false;
        }, 1000);
        
        // Stage 4: Collapse to original size (0.8s)
        setTimeout(() => {
          updateDebug('Close 4 - Height Collapse', false, false, cardElement);
          cardElement.classList.remove('expanding-height', 'closing-unflip');
          cardElement.classList.add('closing-collapse');
        }, 1800);
        
        // Stage 5: Return to original position (0.6s)
        setTimeout(() => {
          updateDebug('Close 5 - Final Return', false, false, cardElement);
          cardElement.classList.remove('closing-return');
          
          // Clear all stored CSS properties including inline styles
          cardElement.style.removeProperty('--card-original-height');
          cardElement.style.removeProperty('--card-original-width');
          
          if (isTargetCard) {
            isExpanded = false;
            removeBackdropListener();
            updateDebug('Closed - Initial State', false, false, cardElement);
          }
        }, 3200);
      } else {
        // Quick close for other cards
        cardElement.classList.remove('expanding-width', 'expanding-height', 'flipped', 'full-expanded', 'content-visible');
        
        cardElement.style.removeProperty('--card-original-height');
        cardElement.style.removeProperty('--card-original-width');
      }
    }
    
    // Single click/touch handler - ONLY EXPANDS, never closes (only X button closes)
    function handleCardInteraction(e) {
      console.log('Card interaction:', e.type, 'isExpanded:', isExpanded);
      
      // Prevent action if clicking a link
      if (e.target.closest('a')) return;
      
      // Prevent action if selecting text
      if (window.getSelection().toString()) return;
      
      // Prevent action if clicking close button
      if (e.target.closest('.fullscreen-close-btn')) return;
      
      // Only expand if not already expanded - clicking on expanded card does nothing
      if (!isExpanded) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Expanding card...');
        expandCard();
      } else {
        console.log('Card already expanded - ignoring click');
      }
    }
    
    // Add backdrop click handler - DISABLED (only close with X button)
    /*
    function handleBackdropClick(e) {
      // Check if the click is on the backdrop (pseudo-element area) or outside the card content
      if (isExpanded && (group.classList.contains('expanding-width') || group.classList.contains('expanding-height'))) {
        const cardRect = group.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // If click is outside the card area, close the card
        if (clickX < cardRect.left || clickX > cardRect.right || 
            clickY < cardRect.top || clickY > cardRect.bottom) {
          e.preventDefault();
          e.stopPropagation();
          closeCard();
        }
      }
    }
    */
    
    // Add backdrop event listener to document when card is expanded - DISABLED
    /*
    function addBackdropListener() {
      if (isExpanded) {
        document.addEventListener('click', handleBackdropClick, true);
        document.addEventListener('touchend', handleBackdropClick, true);
      }
    }
    */
    
    function removeBackdropListener() {
      // document.removeEventListener('click', handleBackdropClick, true);
      // document.removeEventListener('touchend', handleBackdropClick, true);
    }
    
    // Add event listeners
    group.addEventListener('click', handleCardInteraction);
    group.addEventListener('touchend', function(e) {
      e.preventDefault();
      handleCardInteraction(e);
    });
    
    // Close button support
    const closeBtn = group.querySelector('.fullscreen-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked - closing card');
        closeCard();
      });
      
      closeBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button touched - closing card');
        closeCard();
      });
    }
  });

  // Initialize debug panel functionality
  initializeDebugPanel();

  // Render markdown for each card
  renderMarkdownCard('markdown/Local-First AI Tools.md', 'card-local-first-ai-tools');
  renderMarkdownCard('markdown/AI-Assisted Code Development.md', 'card-ai-assisted-code-dev');
  renderMarkdownCard('markdown/Cutting Edge Databases.md', 'card-cutting-edge-databases');
  renderMarkdownCard('markdown/Top Public Data Sources.md', 'card-top-public-data-sources');
  renderMarkdownCard('markdown/AI Art Generation Images 3D and Video.md', 'card-ai-art-gen');
  renderMarkdownCard('markdown/Speech-to-Text & Text-to-Speech.md', 'card-speech-tts-stt');
  renderMarkdownCard('markdown/Networking VPN & Infrastructure Security.md', 'card-networking-vpn');
  renderMarkdownCard('markdown/Virtual Machine and Browser Automation and Scrapers.md', 'card-vm-browser-automation');
  renderMarkdownCard('markdown/AI in Video Games & Virtual Beings.md', 'card-ai-video-games');
  renderMarkdownCard('markdown/Home Automation & Security.md', 'card-home-automation');
});

// ===========================================
// COMPREHENSIVE DEBUG PANEL IMPLEMENTATION
// ===========================================

// Debug panel state and metrics
let debugState = {
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
};

// Initialize debug panel functionality
function initializeDebugPanel() {
  const debugPanel = document.getElementById('debug-panel');
  const closeBtn = document.getElementById('debug-close');
  const tabBtns = document.querySelectorAll('.debug-tab-btn');
  
  // Keyboard toggle functionality
  document.addEventListener('keydown', function(e) {
    // Toggle with backtick (`) or tilde (~) keys
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      toggleDebugPanel();
    }
    // Close with ESC key
    else if (e.key === 'Escape' && debugState.isVisible) {
      e.preventDefault();
      hideDebugPanel();
    }
  });

  // Close button functionality
  if (closeBtn) {
    closeBtn.addEventListener('click', hideDebugPanel);
  }

  // Tab switching functionality
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchDebugTab(tabName);
    });
  });

  // Start performance monitoring
  startPerformanceMonitoring();
}

// Toggle debug panel visibility
function toggleDebugPanel() {
  if (debugState.isVisible) {
    hideDebugPanel();
  } else {
    showDebugPanel();
  }
}

// Show debug panel
function showDebugPanel() {
  const debugPanel = document.getElementById('debug-panel');
  if (debugPanel) {
    debugPanel.classList.remove('hidden');
    debugState.isVisible = true;
    updatePerformanceMetrics();
    console.log('Debug panel opened');
  }
}

// Hide debug panel
function hideDebugPanel() {
  const debugPanel = document.getElementById('debug-panel');
  if (debugPanel) {
    debugPanel.classList.add('hidden');
    debugState.isVisible = false;
    console.log('Debug panel closed');
  }
}

// Switch between debug tabs
function switchDebugTab(tabName) {
  const tabBtns = document.querySelectorAll('.debug-tab-btn');
  const tabs = document.querySelectorAll('.debug-tab');

  // Update button states
  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab visibility
  tabs.forEach(tab => {
    if (tab.id === `debug-tab-${tabName}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  debugState.activeTab = tabName;
  
  // Refresh content based on active tab
  if (tabName === 'markdown') {
    updateMarkdownDebugDisplay();
  } else if (tabName === 'performance') {
    updatePerformanceMetrics();
  }
}

// Enhanced renderMarkdownCard with debug tracking
async function renderMarkdownCard(mdPath, containerId) {
  const startTime = performance.now();
  const fileEntry = {
    path: mdPath,
    containerId: containerId,
    status: 'loading',
    startTime: startTime,
    loadTime: 0,
    fileSize: 0,
    parseTime: 0,
    renderTime: 0,
    error: null
  };

  // Add to tracking
  debugState.markdownFiles.push(fileEntry);
  updateMarkdownDebugDisplay();

  try {
    // Fetch file with timing
    const fetchStart = performance.now();
    const res = await fetch(mdPath);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const md = await res.text();
    const fetchEnd = performance.now();
    
    fileEntry.loadTime = fetchEnd - fetchStart;
    fileEntry.fileSize = new Blob([md]).size;
    fileEntry.status = 'parsing';
    updateMarkdownDebugDisplay();

    // Parse markdown with timing
    const parseStart = performance.now();
    const html = marked.parse(md, {
      highlight: function(code, lang) {
        return hljs.highlightAuto(code, [lang]).value;
      }
    });
    const parseEnd = performance.now();
    
    fileEntry.parseTime = parseEnd - parseStart;
    fileEntry.status = 'rendering';
    updateMarkdownDebugDisplay();

    // Render with timing
    const renderStart = performance.now();
    document.getElementById(containerId).innerHTML = `<div class="markdown-body">${html}</div>`;
    
    // Highlight code blocks
    document.querySelectorAll(`#${containerId} pre code`).forEach((block) => {
      hljs.highlightElement(block);
    });
    const renderEnd = performance.now();

    fileEntry.renderTime = renderEnd - renderStart;
    fileEntry.status = 'complete';
    
    // Update card count for performance metrics
    debugState.performanceMetrics.cardsLoaded++;
    
    console.log(`Markdown rendered: ${mdPath} in ${(renderEnd - startTime).toFixed(2)}ms`);
    
  } catch (error) {
    fileEntry.status = 'error';
    fileEntry.error = error.message;
    console.error(`Error rendering markdown ${mdPath}:`, error);
  }

  const totalTime = performance.now() - startTime;
  fileEntry.totalTime = totalTime;
  updateMarkdownDebugDisplay();
}

// Update markdown debug display
function updateMarkdownDebugDisplay() {
  const markdownList = document.getElementById('debug-markdown-list');
  if (!markdownList) return;

  const html = debugState.markdownFiles.map(file => {
    const statusClass = file.status === 'error' ? 'error' : 
                       file.status === 'complete' ? 'success' : 'loading';
    
    return `
      <div class="debug-markdown-item ${statusClass}">
        <div class="debug-markdown-header">
          <strong>${file.path.split('/').pop()}</strong>
          <span class="debug-status ${statusClass}">${file.status}</span>
        </div>
        <div class="debug-markdown-stats">
          ${file.fileSize > 0 ? `Size: ${(file.fileSize / 1024).toFixed(1)}KB | ` : ''}
          ${file.loadTime > 0 ? `Load: ${file.loadTime.toFixed(1)}ms | ` : ''}
          ${file.parseTime > 0 ? `Parse: ${file.parseTime.toFixed(1)}ms | ` : ''}
          ${file.renderTime > 0 ? `Render: ${file.renderTime.toFixed(1)}ms` : ''}
          ${file.totalTime > 0 ? ` | Total: ${file.totalTime.toFixed(1)}ms` : ''}
          ${file.error ? `<br><span class="error">Error: ${file.error}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  markdownList.innerHTML = html || '<div class="debug-empty">No markdown files loaded yet...</div>';
}

// Performance monitoring
function startPerformanceMonitoring() {
  // FPS monitoring
  function updateFPS() {
    const now = performance.now();
    debugState.performanceMetrics.frameCount++;
    
    if (now >= debugState.performanceMetrics.lastTime + 1000) {
      debugState.performanceMetrics.fps = Math.round(
        (debugState.performanceMetrics.frameCount * 1000) / 
        (now - debugState.performanceMetrics.lastTime)
      );
      debugState.performanceMetrics.frameCount = 0;
      debugState.performanceMetrics.lastTime = now;
      
      if (debugState.isVisible && debugState.activeTab === 'performance') {
        updatePerformanceMetrics();
      }
    }
    
    requestAnimationFrame(updateFPS);
  }
  requestAnimationFrame(updateFPS);

  // Memory monitoring (if available)
  if (performance.memory) {
    setInterval(() => {
      debugState.performanceMetrics.memory = performance.memory.usedJSHeapSize;
    }, 1000);
  }
}

// Update performance metrics display
function updatePerformanceMetrics() {
  const totalLoadTime = performance.now() - debugState.performanceMetrics.startTime;
  
  const updateValue = (id, value) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.textContent = value;
      elem.classList.add('updated');
      setTimeout(() => elem.classList.remove('updated'), 300);
    }
  };

  updateValue('debug-perf-total', `${(totalLoadTime / 1000).toFixed(2)}s`);
  updateValue('debug-perf-fps', `${debugState.performanceMetrics.fps} fps`);
  
  if (debugState.performanceMetrics.memory > 0) {
    const memoryMB = (debugState.performanceMetrics.memory / 1024 / 1024).toFixed(1);
    updateValue('debug-perf-memory', `${memoryMB} MB`);
  } else {
    updateValue('debug-perf-memory', 'Not available');
  }
  
  updateValue('debug-perf-cards', 
    `${debugState.performanceMetrics.cardsLoaded}/${debugState.performanceMetrics.totalCards}`);
}
