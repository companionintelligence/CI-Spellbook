import { useEffect, useState } from 'react';
import { loadShelf } from '../lib/shelves.js';
import { captureException } from '../lib/telemetry.js';

/**
 * A shelf's parsed markdown, shared with every other caller for the same path
 * (see lib/shelves.js), so asking for it from a card and from the search index
 * costs one request.
 */
const useShelf = (markdownPath) => {
  const [state, setState] = useState({ shelf: null, loading: true, error: null });

  useEffect(() => {
    if (!markdownPath) return undefined;

    let cancelled = false;
    setState({ shelf: null, loading: true, error: null });

    loadShelf(markdownPath).then(
      (shelf) => {
        if (!cancelled) setState({ shelf, loading: false, error: null });
      },
      (err) => {
        console.error(`Error processing markdown ${markdownPath}:`, err);
        // The app's main failure mode, and one the browser's global error
        // handlers never see because it is caught here. A no-op unless
        // reporting is switched on; the path is scrubbed before it is sent.
        captureException(err, { markdownPath });
        if (!cancelled) {
          setState({ shelf: null, loading: false, error: `Error loading content: ${err.message}` });
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [markdownPath]);

  return state;
};

export default useShelf;
