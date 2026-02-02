// Diagnostic script to check card heights in console
// Run this in browser console when a card is expanded

function diagnoseCardHeight() {
  const expandedCard = document.querySelector('.group.full-expanded, .group.content-visible');
  
  if (!expandedCard) {
    console.log('❌ No expanded card found. Click a card first.');
    return;
  }
  
  const cardBack = expandedCard.querySelector('.card-back');
  const markdownBody = cardBack?.querySelector('.markdown-body');
  const innerContainer = cardBack?.querySelector('[id]');
  
  console.clear();
  console.log('%c🔍 CARD HEIGHT DIAGNOSTIC', 'font-size: 20px; font-weight: bold; color: #4CAF50;');
  console.log('');
  
  // Card container
  console.log('%c📦 Card Container (.group.full-expanded)', 'font-weight: bold; color: #2196F3;');
  const cardBox = expandedCard.getBoundingClientRect();
  const cardStyles = getComputedStyle(expandedCard);
  console.log('  Dimensions:', {
    width: Math.round(cardBox.width) + 'px',
    height: Math.round(cardBox.height) + 'px',
  });
  console.log('  Computed Styles:', {
    height: cardStyles.height,
    maxHeight: cardStyles.maxHeight,
    overflow: cardStyles.overflow,
  });
  console.log('  CSS Variables:', {
    '--card-content-height': expandedCard.style.getPropertyValue('--card-content-height') || '❌ NOT SET',
    '--card-original-height': expandedCard.style.getPropertyValue('--card-original-height') || 'not set',
  });
  console.log('');
  
  // Card back (scrollable)
  if (cardBack) {
    console.log('%c📜 Card Back (.card-back) - Scrollable Area', 'font-weight: bold; color: #FF9800;');
    const backStyles = getComputedStyle(cardBack);
    console.log('  Dimensions:', {
      clientHeight: cardBack.clientHeight + 'px (visible)',
      scrollHeight: cardBack.scrollHeight + 'px (total)',
      offsetHeight: cardBack.offsetHeight + 'px',
    });
    console.log('  Computed Styles:', {
      height: backStyles.height,
      maxHeight: backStyles.maxHeight,
      overflowY: backStyles.overflowY,
      padding: backStyles.padding,
    });
    
    const isOverflowing = cardBack.scrollHeight > cardBack.clientHeight;
    const hiddenHeight = cardBack.scrollHeight - cardBack.clientHeight;
    
    if (isOverflowing) {
      console.log('  %c⚠️  OVERFLOW DETECTED!', 'color: #F44336; font-weight: bold;');
      console.log('  Hidden content:', hiddenHeight + 'px');
      console.log('  Percentage cut off:', Math.round((hiddenHeight / cardBack.scrollHeight) * 100) + '%');
      console.log('  Current scroll position:', cardBack.scrollTop + 'px');
      console.log('  Max scroll:', (cardBack.scrollHeight - cardBack.clientHeight) + 'px');
    } else {
      console.log('  %c✅ No overflow - all content visible!', 'color: #4CAF50; font-weight: bold;');
    }
    console.log('');
  }
  
  // Inner container
  if (innerContainer) {
    console.log('%c📝 Inner Container ([id])', 'font-weight: bold; color: #9C27B0;');
    const innerBox = innerContainer.getBoundingClientRect();
    console.log('  Dimensions:', {
      height: Math.round(innerBox.height) + 'px',
      scrollHeight: innerContainer.scrollHeight + 'px',
    });
    console.log('');
  }
  
  // Markdown body
  if (markdownBody) {
    console.log('%c📰 Markdown Body (.markdown-body)', 'font-weight: bold; color: #00BCD4;');
    const mdBox = markdownBody.getBoundingClientRect();
    console.log('  Dimensions:', {
      height: Math.round(mdBox.height) + 'px',
      scrollHeight: markdownBody.scrollHeight + 'px',
    });
    console.log('');
  }
  
  // Summary
  console.log('%c📊 SUMMARY', 'font-weight: bold; font-size: 16px; color: #4CAF50;');
  const contentHeight = expandedCard.style.getPropertyValue('--card-content-height');
  console.log('Expected height:', contentHeight || '❌ NOT SET');
  console.log('Actual card height:', Math.round(cardBox.height) + 'px');
  console.log('Scrollable area client height:', cardBack?.clientHeight + 'px');
  console.log('Total content height:', cardBack?.scrollHeight + 'px');
  
  if (cardBack) {
    const isOverflowing = cardBack.scrollHeight > cardBack.clientHeight;
    if (isOverflowing) {
      console.log('%c❌ ISSUE: Content is cut off!', 'color: #F44336; font-weight: bold; font-size: 14px;');
      console.log('   Need to increase --card-content-height or ensure card height matches it');
    } else {
      console.log('%c✅ SUCCESS: All content fits!', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    }
  }
  
  // Test scrolling
  console.log('');
  console.log('%c💡 TIP: Run scrollToBottom() to test scrolling', 'color: #FFC107;');
}

function scrollToBottom() {
  const cardBack = document.querySelector('.group.full-expanded .card-back, .group.content-visible .card-back');
  if (cardBack) {
    cardBack.scrollTop = cardBack.scrollHeight;
    console.log('✅ Scrolled to bottom. Current position:', cardBack.scrollTop + 'px');
    setTimeout(diagnoseCardHeight, 100);
  } else {
    console.log('❌ No expanded card found');
  }
}

function scrollToTop() {
  const cardBack = document.querySelector('.group.full-expanded .card-back, .group.content-visible .card-back');
  if (cardBack) {
    cardBack.scrollTop = 0;
    console.log('✅ Scrolled to top');
    setTimeout(diagnoseCardHeight, 100);
  } else {
    console.log('❌ No expanded card found');
  }
}

// Auto-run when card is expanded
console.log('%c📋 Card Height Diagnostic Script Loaded', 'font-size: 16px; font-weight: bold; color: #4CAF50;');
console.log('');
console.log('Available commands:');
console.log('  diagnoseCardHeight() - Full diagnostic of expanded card');
console.log('  scrollToBottom()     - Scroll card to bottom and diagnose');
console.log('  scrollToTop()        - Scroll card to top and diagnose');
console.log('');
console.log('Expand a card, then run: diagnoseCardHeight()');

// Export to window
window.diagnoseCardHeight = diagnoseCardHeight;
window.scrollToBottom = scrollToBottom;
window.scrollToTop = scrollToTop;
