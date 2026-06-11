// Height Debug Overlay - Add to browser console to enable visual debugging
// Usage: Run enableHeightDebug() in console

function enableHeightDebug() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'height-debug-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.9);
    color: #4CAF50;
    padding: 15px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-width: 350px;
    border: 2px solid #4CAF50;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;
  overlay.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px; color: #fff;">📏 Height Debug Active</div>
    <div id="height-debug-content" style="line-height: 1.6;">
      Waiting for card expansion...
    </div>
    <button onclick="document.getElementById('height-debug-overlay').remove()" 
            style="margin-top: 10px; padding: 5px 10px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Disable
    </button>
  `;
  document.body.appendChild(overlay);
  
  // Override console.log to capture measurement logs
  const originalLog = console.log;
  const debugContent = document.getElementById('height-debug-content');
  
  console.log = function(...args) {
    originalLog.apply(console, args);
    
    // Check if it's a measurement log
    const firstArg = args[0];
    if (typeof firstArg === 'string' && (firstArg.includes('📏') || firstArg.includes('🔄') || firstArg.includes('✅'))) {
      const data = args[1];
      if (data && typeof data === 'object') {
        let html = `<div style="margin: 8px 0; padding: 8px; background: rgba(76, 175, 80, 0.1); border-left: 3px solid #4CAF50; border-radius: 4px;">`;
        html += `<div style="color: #fff; margin-bottom: 5px;">${firstArg}</div>`;
        
        for (const [key, value] of Object.entries(data)) {
          let color = '#4CAF50';
          if (key === 'willScroll' && value) color = '#FF9800';
          if (key === 'finalHeight' || key === 'newHeight') color = '#2196F3';
          
          html += `<div style="color: ${color};">${key}: ${typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}</div>`;
        }
        html += '</div>';
        
        debugContent.innerHTML = html + debugContent.innerHTML;
        
        // Keep only last 3 measurements
        const measurements = debugContent.querySelectorAll('div > div');
        if (measurements.length > 3) {
          measurements[measurements.length - 1].remove();
        }
      }
    }
  };
  
  // Observe DOM for expanded cards
  const observer = new MutationObserver(() => {
    const expandedCard = document.querySelector('.group.content-visible, .group.full-expanded');
    if (expandedCard) {
      const cardBack = expandedCard.querySelector('.card-back');
      if (cardBack) {
        const isOverflowing = cardBack.scrollHeight > cardBack.clientHeight;
        const hiddenHeight = cardBack.scrollHeight - cardBack.clientHeight;
        const customHeight = expandedCard.style.getPropertyValue('--card-content-height');
        
        let statusHtml = `
          <div style="background: rgba(33, 150, 243, 0.1); padding: 8px; border-radius: 4px; margin-bottom: 8px;">
            <div style="color: #2196F3; font-weight: bold;">Current Card Status</div>
            <div>--card-content-height: ${customHeight || 'NOT SET'}</div>
            <div>Card height: ${Math.round(expandedCard.getBoundingClientRect().height)}px</div>
            <div>Content scroll: ${cardBack.scrollHeight}px</div>
            <div>Visible: ${cardBack.clientHeight}px</div>
            <div style="color: ${isOverflowing && hiddenHeight > 50 ? '#F44336' : '#4CAF50'};">
              ${isOverflowing && hiddenHeight > 50 ? '⚠️ CONTENT CUT OFF: ' + hiddenHeight + 'px hidden' : '✅ Content fits!'}
            </div>
          </div>
        `;
        
        const currentStatus = debugContent.querySelector('div[style*="Current Card Status"]')?.parentElement;
        if (currentStatus) {
          currentStatus.remove();
        }
        debugContent.insertAdjacentHTML('afterbegin', statusHtml);
      }
    }
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'style'],
    subtree: true
  });
  
  console.log('%c✅ Height Debug Enabled!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('Overlay added to top-right corner. Expand a card to see measurements.');
  
  // Store references for cleanup
  window.heightDebugCleanup = () => {
    console.log = originalLog;
    observer.disconnect();
    overlay.remove();
    console.log('Height debug disabled');
  };
}

// Auto-load if ?debug=height in URL
if (window.location.search.includes('debug=height')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableHeightDebug);
  } else {
    enableHeightDebug();
  }
}

// Export to window
window.enableHeightDebug = enableHeightDebug;

console.log('%c💡 Height Debug Available', 'color: #FFC107; font-weight: bold;');
console.log('Run enableHeightDebug() or add ?debug=height to URL');
