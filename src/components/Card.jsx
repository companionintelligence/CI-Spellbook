import React, { useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import useShelf from '../hooks/useShelf';
import { prepareCardBody } from '../lib/cardContent';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Card = ({
  title,
  backgroundImage,
  borderColor,
  hoverColor,
  baseColor,
  markdownPath,
  containerId,
  searchMode = false,
  searchSnippetHtml = null,
  searchMeta = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // The body of a shelf is ~100 table rows. Nothing needs it until the shelf is
  // opened, so it is not in the DOM before then — which also keeps ~50 links per
  // shelf out of the tab order and the accessibility tree while the card is
  // closed.
  const [hasOpened, setHasOpened] = useState(false);
  const cardRef = useRef(null);
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  // Focus moves into the card on open and back to its button on close, but only
  // on a real close — not on first render, when nothing has been opened yet.
  const wasOpenRef = useRef(false);

  const { shelf, loading, error } = useShelf(markdownPath);

  const isSearchResult = Boolean(searchMode);
  const isOpen = isSearchResult ? false : isExpanded;

  // The closed face used to be a coloured rectangle with a title in it, on a
  // catalog whose entire pitch is breadth. The shelf is already loaded for
  // every card on mount, so count what is actually in there.
  const summary = shelf?.summary ?? null;

  const bodyHtml = useMemo(
    () => (hasOpened && shelf ? prepareCardBody(shelf.html) : ''),
    [hasOpened, shelf]
  );

  const openCard = () => {
    if (isSearchResult) return;
    setHasOpened(true);
    setIsExpanded(true);
  };

  const closeCard = () => setIsExpanded(false);

  // Scroll the card into view once it has opened.
  useEffect(() => {
    if (!isOpen || !cardRef.current) return undefined;
    // Small delay to let the flip start.
    const timer = setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Keyboard focus follows the card: into it on open, back to the button that
  // opened it on close.
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus({ preventScroll: true });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      openButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeCard();
  };

  // Everything a face needs to paint itself: a flat colour until the picture
  // arrives, and the shelf's own hue for the hover/focus ring.
  const faceStyle = { backgroundColor: `rgb(${baseColor})` };

  return (
    <div
      ref={cardRef}
      // The no-results directory scrolls to a shelf by id; the card wrapper is
      // the element that needs the anchor (containerId is on the back face,
      // which is rotated out of the flow when the card is closed).
      id={containerId ? `shelf-${containerId}` : undefined}
      className={classNames('group', { expanded: isOpen, 'search-result': isSearchResult })}
      style={{ '--shelf-hover': hoverColor }}
    >
      {/* Close button - only visible when expanded */}
      {isOpen && (
        <button
          type="button"
          ref={closeButtonRef}
          className="close-btn fullscreen-close-btn"
          onClick={handleClose}
          aria-label={`Close ${title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="card-inner rounded-xl border-2 shadow-xl" style={{ borderColor }}>
        {/* Front Face.
            The face is clickable anywhere (mouse and touch), but the control a
            keyboard or a screen reader reaches is the button inside the title:
            a div with an onClick is not focusable and has no role. */}
        <div
          className="card-front p-6 text-center flex flex-col justify-center items-center cursor-pointer"
          style={faceStyle}
          onClick={openCard}
        >
          {/* Shelf art. Loaded as the card nears the viewport (native lazy
              loading) instead of all thirteen at once on first paint. */}
          <img
            className="card-art"
            src={backgroundImage}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{ background: `rgba(${baseColor}, 0.8)` }}
          />
          {/* Hover / focus ring. Hover used to fade a bright overlay of the
              shelf's colour in under the white text, which took the title, the
              count and the chips down to 1.6-3.7:1 on 13 of 16 shelves. The
              dark overlay above is what the text is measured against, so it
              stays as it is and hover is signalled by a ring and glow instead. */}
          <div className="card-ring absolute inset-0 rounded-xl" aria-hidden="true" />
          {/* Title + what is on the shelf */}
          <div className="relative z-10 card-front-body">
            <h2 className="text-2xl font-bold text-white">
              <button
                type="button"
                ref={openButtonRef}
                className="card-open-btn"
                aria-expanded={isOpen}
                aria-controls={containerId}
                aria-describedby={containerId ? `${containerId}-summary` : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  openCard();
                }}
              >
                {title}
              </button>
            </h2>
            <div id={containerId ? `${containerId}-summary` : undefined} className="card-front-meta">
              {summary ? (
                <>
                  <p className="card-front-count">
                    {summary.tools} tools
                    {summary.sections > 0 ? ` · ${summary.sections} sections` : ''}
                  </p>
                  {summary.examples.length ? (
                    <ul className="card-front-examples">
                      {summary.examples.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : null}
            </div>
            <p className="card-front-cue" aria-hidden="true">
              Open shelf
            </p>
          </div>
        </div>

        {/* Back Face. While the shelf is closed it is out of the tab order and
            the accessibility tree (inert, plus visibility:hidden in CSS):
            backface-visibility only hides it from the eye. */}
        <div
          className="card-back text-white flex flex-col"
          style={faceStyle}
          inert={isOpen || isSearchResult ? undefined : ''}
        >
          <img
            className="card-art"
            src={backgroundImage}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
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
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  {searchMeta?.query ? (
                    <div className="search-snippet-subtitle">
                      <span className="opacity-90">Matches for</span>{' '}
                      <span className="font-semibold">“{searchMeta.query}”</span>
                      {typeof searchMeta.matchCount === 'number' ? (
                        <span className="opacity-75">
                          {' '}· {searchMeta.matchCount}{' '}
                          {searchMeta.matchCount === 1 ? 'hit' : 'hits'}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div
                  className="search-snippet-body"
                  dangerouslySetInnerHTML={{ __html: searchSnippetHtml || '' }}
                />
              </div>
            ) : !hasOpened ? null : loading ? (
              <div className="flex items-center justify-center h-64" role="status">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-sm">Loading content...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-400" role="alert">
                <span className="text-sm">{error}</span>
              </div>
            ) : (
              <div className="markdown-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
