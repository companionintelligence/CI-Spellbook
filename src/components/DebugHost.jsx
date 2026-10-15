import React from 'react';
import DebugPanel from './DebugPanel';
import { useDebugPanel } from '../hooks/useDebugPanel';

// Development-only host for the debug overlay. App loads this lazily behind
// `import.meta.env.DEV`, so none of it — the panel, its frame-rate and memory
// monitors, its global key handler — is in the production bundle.
const DebugHost = () => {
  const { debugState, hideDebugPanel, switchDebugTab } = useDebugPanel();

  return (
    <DebugPanel
      debugState={debugState}
      onClose={hideDebugPanel}
      onTabSwitch={switchDebugTab}
    />
  );
};

export default DebugHost;
