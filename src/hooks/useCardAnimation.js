import { useState, useEffect, useRef, useCallback } from 'react';

export const useCardAnimation = (updateDebug) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animationStage, setAnimationStage] = useState('initial');
  const [contentHeight, setContentHeight] = useState(null);
  const [needsRemeasure, setNeedsRemeasure] = useState(false);
  
  const cardRef = useRef(null);
  const expandTimeouts = useRef([]);
  const closeTimeouts = useRef([]);

  const clearAllTimeouts = useCallback((timeoutArray) => {
    timeoutArray.current.forEach(timeout => clearTimeout(timeout));
    timeoutArray.current = [];
  }, []);

  const measureContentHeight = useCallback((force = false) => {
    if (!cardRef.current) {
      console.log('⚠️  No cardRef available');
      return null;
    }

    const backContent = cardRef.current.querySelector('.card-back');
    if (!backContent) {
      console.log('⚠️  No .card-back found');
      return null;
    }

    // Get the markdown body - this contains the actual content
    const markdownBody = backContent.querySelector('.markdown-body');
    if (!markdownBody || markdownBody.innerHTML.trim() === '') {
      console.log('⚠️  No markdown content loaded yet');
      return window.innerHeight * 0.8; // Fallback while loading
    }

    // Clone the markdown body and measure it at full expanded width
    const tempDiv = document.createElement('div');
    tempDiv.className = 'markdown-body';
    tempDiv.innerHTML = markdownBody.innerHTML;
    tempDiv.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: calc(90vw - 96px);
      max-width: 1300px;
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      visibility: hidden;
      overflow: visible !important;
      display: block !important;
      padding: 0 !important;
      font-size: 0.875rem;
      line-height: 1.6;
    `;
    document.body.appendChild(tempDiv);
    
    const contentHeight = tempDiv.scrollHeight;
    
    // Add generous padding for: card padding (64px), close button area (60px), extra breathing room (40px)
    const totalPadding = 164;
    const finalHeight = contentHeight + totalPadding;
    
    console.log('📏 Content measurement:', {
      rawContentHeight: contentHeight,
      padding: totalPadding,
      finalHeight: finalHeight,
      windowHeight: window.innerHeight
    });
    
    document.body.removeChild(tempDiv);
    return finalHeight;
  }, []);

  // Function to remeasure and update height (called after content loads)
  const remeasureHeight = useCallback(() => {
    if (!isExpanded || !cardRef.current) return;
    
    console.log('🔄 Remeasuring content height...');
    const height = measureContentHeight(true);
    
    if (height && cardRef.current) {
      cardRef.current.style.setProperty('--card-content-height', height + 'px');
      setContentHeight(height);
      console.log('✅ Updated --card-content-height to:', height + 'px');
    }
  }, [isExpanded, measureContentHeight]);

  const expandCard = useCallback(() => {
    if (isExpanded) return;

    clearAllTimeouts(expandTimeouts);
    clearAllTimeouts(closeTimeouts);

    // Measure content height (initial estimate)
    const height = measureContentHeight();
    setContentHeight(height);
    setNeedsRemeasure(true);

    // Store original dimensions
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardRef.current.style.setProperty('--card-original-height', rect.height + 'px');
      cardRef.current.style.setProperty('--card-original-width', rect.width + 'px');
      cardRef.current.style.setProperty('--card-original-top', rect.top + 'px');
      cardRef.current.style.setProperty('--card-original-left', rect.left + 'px');
      if (height) {
        cardRef.current.style.setProperty('--card-content-height', height + 'px');
        // Also set on container for padding-top calculation
        const container = document.getElementById('cards-container');
        if (container) {
          container.style.setProperty('--card-content-height', height + 'px');
        }
      }
    }

    setIsExpanded(true);
    setAnimationStage('expanding-width');
    updateDebug?.('1 - Width Expansion', true, false, cardRef.current);

    // Stage 2: Expand height
    expandTimeouts.current.push(setTimeout(() => {
      setAnimationStage('expanding-height');
      updateDebug?.('2 - Height Expansion', true, false, cardRef.current);
    }, 800));

    // Stage 3: Flip card
    expandTimeouts.current.push(setTimeout(() => {
      setIsFlipped(true);
      setAnimationStage('flipped');
      updateDebug?.('3 - Card Flip', true, true, cardRef.current);
      
      // Remeasure after flip (content should be visible now)
      setTimeout(() => {
        const newHeight = measureContentHeight(true);
        if (newHeight && cardRef.current) {
          cardRef.current.style.setProperty('--card-content-height', newHeight + 'px');
          setContentHeight(newHeight);
          // Also set on container for padding-top calculation
          const container = document.getElementById('cards-container');
          if (container) {
            container.style.setProperty('--card-content-height', newHeight + 'px');
          }
          console.log('🔄 Post-flip height adjustment:', newHeight + 'px');
        }
      }, 100);
    }, 1400));

    // Stage 4: Full expansion
    expandTimeouts.current.push(setTimeout(() => {
      setAnimationStage('full-expanded');
      updateDebug?.('4 - Full Screen', true, true, cardRef.current);
    }, 2200));

    // Stage 5: Content visible
    expandTimeouts.current.push(setTimeout(() => {
      setAnimationStage('content-visible');
      updateDebug?.('5 - Content Visible', true, true, cardRef.current);
    }, 3000));
  }, [isExpanded, measureContentHeight, updateDebug, clearAllTimeouts]);

  const closeCard = useCallback((animated = true) => {
    if (!isExpanded && !isFlipped && animationStage === 'initial') return;

    clearAllTimeouts(expandTimeouts);
    clearAllTimeouts(closeTimeouts);

    if (!animated) {
      // Quick close
      setIsExpanded(false);
      setIsFlipped(false);
      setAnimationStage('initial');
      setContentHeight(null);
      
      if (cardRef.current) {
        cardRef.current.style.removeProperty('--card-original-height');
        cardRef.current.style.removeProperty('--card-original-width');
        cardRef.current.style.removeProperty('--card-original-top');
        cardRef.current.style.removeProperty('--card-original-left');
        cardRef.current.style.removeProperty('--card-content-height');
      }
      
      updateDebug?.('Quick Closed', false, false, cardRef.current);
      return;
    }

    // Animated close
    setAnimationStage('closing-content');
    updateDebug?.('Close 1 - Content Fade', false, true, cardRef.current);

    // Stage 2: Shrink width
    closeTimeouts.current.push(setTimeout(() => {
      setAnimationStage('closing-shrink');
      updateDebug?.('Close 2 - Width Shrink', false, true, cardRef.current);
    }, 400));

    // Stage 3: Unflip
    closeTimeouts.current.push(setTimeout(() => {
      setIsFlipped(false);
      setAnimationStage('closing-unflip');
      updateDebug?.('Close 3 - Unflip', false, false, cardRef.current);
    }, 1000));

    // Stage 4: Collapse height
    closeTimeouts.current.push(setTimeout(() => {
      setAnimationStage('closing-collapse');
      updateDebug?.('Close 4 - Height Collapse', false, false, cardRef.current);
    }, 1800));

    // Stage 5: Return to position
    closeTimeouts.current.push(setTimeout(() => {
      setAnimationStage('closing-return');
      updateDebug?.('Close 5 - Final Return', false, false, cardRef.current);
    }, 2600));

    // Stage 6: Cleanup
    closeTimeouts.current.push(setTimeout(() => {
      setIsExpanded(false);
      setIsFlipped(false);
      setAnimationStage('initial');
      setContentHeight(null);
      
      if (cardRef.current) {
        cardRef.current.style.removeProperty('--card-original-height');
        cardRef.current.style.removeProperty('--card-original-width');
        cardRef.current.style.removeProperty('--card-original-top');
        cardRef.current.style.removeProperty('--card-original-left');
        cardRef.current.style.removeProperty('--card-content-height');
      }
      
      updateDebug?.('Closed - Initial State', false, false, cardRef.current);
    }, 3200));
  }, [isExpanded, isFlipped, animationStage, updateDebug, clearAllTimeouts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts(expandTimeouts);
      clearAllTimeouts(closeTimeouts);
    };
  }, [clearAllTimeouts]);

  return {
    cardRef,
    isExpanded,
    isFlipped,
    animationStage,
    contentHeight,
    expandCard,
    closeCard,
    remeasureHeight
  };
};
