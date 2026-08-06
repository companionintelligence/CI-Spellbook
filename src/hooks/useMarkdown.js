import { useState, useEffect, useRef } from 'react';
import marked from '../lib/markdown';
import { labelTableCells } from '../lib/cardContent';
import { captureException } from '../lib/telemetry.js';

// highlight.js CSS is bundled via src/main.jsx (import 'highlight.js/styles/github.min.css')

const useMarkdown = (markdownPath, containerId, onMarkdownLoad) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (markdownPath) {
      setLoading(true);
      setError(null);
      
      fetch(markdownPath)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch ${markdownPath}: ${res.status} ${res.statusText}`);
          }
          return res.text();
        })
        .then(text => {
          const html = labelTableCells(marked.parse(text));
          setContent(html);
          setLoading(false);
          
          // Notify parent that content is loaded (after a small delay for rendering)
          setTimeout(() => {
            onMarkdownLoad?.(containerId);
          }, 100);
        })
        .catch(err => {
          console.error(`Error processing markdown ${markdownPath}:`, err);
          // The app's main failure mode, and one the browser's global error
          // handlers never see because it is caught here. A no-op unless
          // reporting is switched on; the path is scrubbed before it is sent.
          captureException(err, { markdownPath });
          const errorMsg = `Error loading content: ${err.message}`;
          setContent('');
          setError(errorMsg);
          setLoading(false);
        });
    }
  }, [markdownPath, containerId, onMarkdownLoad]);

  return { content, loading, error, contentRef };
};

export default useMarkdown;
