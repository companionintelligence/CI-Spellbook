import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Ensure highlight.js CSS is loaded, e.g., in App.jsx, main.jsx, or index-react.html (CDN link is fine for now)

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
          const html = marked.parse(text, {
            highlight: function (code, lang) {
              const language = hljs.getLanguage(lang) ? lang : 'plaintext';
              return hljs.highlight(code, { language, ignoreIllegals: true }).value;
            }
          });
          setContent(html);
          setLoading(false);
          
          // Notify parent that content is loaded (after a small delay for rendering)
          setTimeout(() => {
            onMarkdownLoad?.(containerId);
          }, 100);
        })
        .catch(err => {
          console.error(`Error processing markdown ${markdownPath}:`, err);
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
