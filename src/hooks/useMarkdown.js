import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Ensure highlight.js CSS is loaded, e.g., in App.jsx, main.jsx, or index-react.html (CDN link is fine for now)

const useMarkdown = (markdownPath) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (markdownPath) {
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
          setMarkdownContent(html);
        })
        .catch(err => {
          console.error(`Error processing markdown ${markdownPath}:`, err);
          setMarkdownContent(`<p>Error loading content for ${markdownPath}. ${err.message}</p>`);
        });
    }
  }, [markdownPath]);

  return { markdownContent, contentRef };
};

export default useMarkdown;
