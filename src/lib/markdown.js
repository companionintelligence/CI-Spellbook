// Shared, pre-configured marked instance.
//
// - Uses the marked-highlight extension (the `highlight:` parse option was
//   deprecated in marked v5 and spammed a console warning per parse).
// - Imports highlight.js "common" build (~40 languages) instead of the full
//   bundle, which keeps several hundred KB out of the main chunk.
// - Disables the deprecated mangle/headerIds defaults to silence their
//   deprecation warnings.
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
  }),
  {
    mangle: false,
    headerIds: false
  }
);

export default marked;
