import React from 'react';
import classNames from 'classnames';
import useMarkdown from '../hooks/useMarkdown'; // Changed from { useMarkdown }
import { useCardAnimation } from '../hooks/useCardAnimation';

const Card = ({ 
  title, 
  backgroundImage, 
  borderColor, 
  hoverColor, 
  baseColor, 
  markdownPath, 
  containerId,
  updateDebug,
  onMarkdownLoad,
  onCardExpand 
}) => {
  const {
    cardRef,
    isExpanded,
    isFlipped,
    animationStage,
    expandCard,
    closeCard
  } = useCardAnimation(updateDebug);

  const { content, loading, error } = useMarkdown(markdownPath, containerId, onMarkdownLoad);

  const handleCardClick = (e) => {
    // Prevent expansion if clicking on links or if text is selected
    if (e.target.closest('a')) return;
    if (window.getSelection().toString()) return;
    if (e.target.closest('.fullscreen-close-btn')) return;
    
    if (!isExpanded) {
      e.preventDefault();
      e.stopPropagation();
      onCardExpand?.(); // Close other cards
      expandCard();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeCard(true);
  };

  const cardClasses = classNames(
    'group w-full h-[42rem] [perspective:1000px]',
    {
      'card-animating': isExpanded,
      'expanding-width': animationStage === 'expanding-width',
      'expanding-height': animationStage === 'expanding-height',
      'flipped': isFlipped,
      'full-expanded': animationStage === 'full-expanded',
      'content-visible': animationStage === 'content-visible',
      'closing-content': animationStage === 'closing-content',
      'closing-shrink': animationStage === 'closing-shrink',
      'closing-unflip': animationStage === 'closing-unflip',
      'closing-collapse': animationStage === 'closing-collapse',
      'closing-return': animationStage === 'closing-return'
    }
  );

  return (
    <div ref={cardRef} className={cardClasses}>
      {/* Close button */}
      <button
        type="button"
        className={classNames(
          'fullscreen-close-btn absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full p-2 shadow-lg transition',
          {
            'hidden': !isExpanded
          }
        )}
        onClick={handleCloseClick}
        aria-label="Close card"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>

      <div 
        className="card-inner relative h-full w-full rounded-xl border-2 shadow-xl transition-all duration-700 [transform-style:preserve-3d]"
        style={{ borderColor }}
        onClick={handleCardClick}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 rounded-xl p-6 text-center flex flex-col justify-center items-center shadow-lg [backface-visibility:hidden] transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-500 cursor-pointer"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll'
          }}
        >
          <div 
            className="absolute inset-0 rounded-xl transition-all duration-500"
            style={{ background: `rgba(${baseColor}, 0.8)` }}
          />
          <div 
            className="absolute inset-0 rounded-xl transition-all duration-500 opacity-0 hover:opacity-100"
            style={{ background: `rgba(${hoverColor}, 0.8)` }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 h-full w-full rounded-xl px-6 py-4 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto transition-all duration-500"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll'
          }}
        >
          <div 
            className="absolute inset-0 rounded-xl"
            style={{ background: `rgba(${baseColor}, 0.9)` }}
          />
          <div className="relative z-10 text-xs md:text-sm" id={containerId}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3">Loading content...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-400">
                <span>Error loading content: {error}</span>
              </div>
            ) : (
              <div 
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
