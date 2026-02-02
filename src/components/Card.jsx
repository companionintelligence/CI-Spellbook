import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import useMarkdown from '../hooks/useMarkdown';

const Card = ({ 
  title, 
  backgroundImage, 
  borderColor, 
  hoverColor, 
  baseColor, 
  markdownPath, 
  containerId,
  onCardExpand,
  searchMode = false,
  searchSnippetHtml = null,
  searchMeta = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  
  const { content, loading, error } = useMarkdown(markdownPath, containerId);

  const isSearchResult = Boolean(searchMode);
  const isOpen = isSearchResult ? false : isExpanded;

  // Scroll to card when expanded
  useEffect(() => {
    if (isOpen && cardRef.current) {
      // Small delay to let animation start
      setTimeout(() => {
        cardRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsExpanded(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleCardClick = (e) => {
    if (isSearchResult) return;

    // Don't expand if clicking links or close button
    if (e.target.closest('a')) return;
    if (e.target.closest('.close-btn')) return;
    if (window.getSelection().toString()) return;
    
    if (!isExpanded) {
      e.preventDefault();
      e.stopPropagation();
      onCardExpand?.(); // Close other cards
      setIsExpanded(true);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(false);
  };

  // Exposed close method for parent to call
  React.useImperativeHandle(
    React.useRef(null),
    () => ({
      close: () => setIsExpanded(false)
    }),
    []
  );

  return (
    <div 
      ref={cardRef}
      className={classNames('group', { 'expanded': isOpen, 'search-result': isSearchResult })}
    >
      {/* Close button - only visible when expanded */}
      {isOpen && (
        <button
          type="button"
          className="close-btn fullscreen-close-btn"
          onClick={handleClose}
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
      )}

      <div 
        className="card-inner rounded-xl border-2 shadow-xl"
        style={{ borderColor }}
        onClick={handleCardClick}
      >
        {/* Front Face */}
        <div 
          className="card-front p-6 text-center flex flex-col justify-center items-center cursor-pointer"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 rounded-xl transition-all duration-300"
            style={{ background: `rgba(${baseColor}, 0.8)` }}
          />
          {/* Hover overlay */}
          <div 
            className="absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: `rgba(${hoverColor}, 0.8)` }}
          />
          {/* Title */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="card-back text-white flex flex-col"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay for readability */}
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: `rgba(${baseColor}, 0.92)` }}
          />
          
          {/* Content */}
          <div className="relative z-10 w-full h-full px-6 py-8" id={containerId}>
            {isSearchResult ? (
              <div className="search-snippet">
                <div className="search-snippet-header">
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  {searchMeta?.query ? (
                    <div className="search-snippet-subtitle">
                      <span className="opacity-90">Matches for</span>{' '}
                      <span className="font-semibold">“{searchMeta.query}”</span>
                      {typeof searchMeta.matchCount === 'number' ? (
                        <span className="opacity-75"> · {searchMeta.matchCount} hits</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div
                  className="search-snippet-body"
                  dangerouslySetInnerHTML={{ __html: searchSnippetHtml || '' }}
                />
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-sm">Loading content...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-400">
                <span className="text-sm">Error loading content: {error}</span>
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
