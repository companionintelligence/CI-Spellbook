import React, { useCallback } from 'react';
import Card from './components/Card';
import DebugPanel from './components/DebugPanel';
import { useDebugPanel } from './hooks/useDebugPanel';

const App = () => {
  const {
    debugState,
    updateDebug,
    hideDebugPanel,
    switchDebugTab,
    addMarkdownFile,
    updateMarkdownFile
  } = useDebugPanel();

  // Card configuration
  const cardConfigs = [
    {
      id: 'ai-agents',
      title: 'AI Agents & Autonomous Systems',
      backgroundImage: '/background/background1.jpg',
      borderColor: '#8b5cf6',
      hoverColor: '139, 92, 246',
      baseColor: '45, 27, 78',
      markdownPath: '/markdown/AI Agents & Autonomous Systems.md',
      containerId: 'card-ai-agents'
    },
    {
      id: 'local-first-ai-tools',
      title: 'Local-First AI Tools',
      backgroundImage: '/background/background1.jpg',
      borderColor: '#3784ff',
      hoverColor: '55, 132, 255',
      baseColor: '7, 21, 51',
      markdownPath: '/markdown/Local-First AI Tools.md',
      containerId: 'card-local-first-ai-tools'
    },
    {
      id: 'ai-assisted-code-dev',
      title: 'AI-Assisted Code Development',
      backgroundImage: '/background/background2.png',
      borderColor: '#58ebbf',
      hoverColor: '88, 235, 191',
      baseColor: '36, 72, 89',
      markdownPath: '/markdown/AI-Assisted Code Development.md',
      containerId: 'card-ai-assisted-code-dev'
    },
    {
      id: 'maker-hardware',
      title: 'Maker & Hardware Prototyping',
      backgroundImage: '/background/background3.png',
      borderColor: '#f97316',
      hoverColor: '249, 115, 22',
      baseColor: '78, 45, 22',
      markdownPath: '/markdown/Maker & Hardware Prototyping.md',
      containerId: 'card-maker-hardware'
    },
    {
      id: 'xr-spatial',
      title: 'XR & Spatial Computing',
      backgroundImage: '/background/background4.png',
      borderColor: '#06b6d4',
      hoverColor: '6, 182, 212',
      baseColor: '22, 67, 78',
      markdownPath: '/markdown/XR & Spatial Computing.md',
      containerId: 'card-xr-spatial'
    },
    {
      id: 'cutting-edge-databases',
      title: 'Cutting Edge Databases',
      backgroundImage: '/background/background3.png',
      borderColor: '#4290e3',
      hoverColor: '66, 144, 227',
      baseColor: '52, 52, 78',
      markdownPath: '/markdown/Cutting Edge Databases.md',
      containerId: 'card-cutting-edge-databases'
    },
    {
      id: 'top-public-data-sources',
      title: 'Top Public Data Sources',
      backgroundImage: '/background/background4.png',
      borderColor: '#ff6b6b',
      hoverColor: '255, 107, 107',
      baseColor: '89, 36, 36',
      markdownPath: '/markdown/Top Public Data Sources.md',
      containerId: 'card-top-public-data-sources'
    },
    {
      id: 'ai-art-gen',
      title: 'AI Art Generation Images 3D and Video',
      backgroundImage: '/background/background5.png',
      borderColor: '#ffd93d',
      hoverColor: '255, 217, 61',
      baseColor: '89, 76, 36',
      markdownPath: '/markdown/AI Art Generation Images 3D and Video.md',
      containerId: 'card-ai-art-gen'
    },
    {
      id: 'speech-tts-stt',
      title: 'Speech-to-Text & Text-to-Speech',
      backgroundImage: '/background/background6.png',
      borderColor: '#6bcf7f',
      hoverColor: '107, 207, 127',
      baseColor: '36, 89, 45',
      markdownPath: '/markdown/Speech-to-Text & Text-to-Speech.md',
      containerId: 'card-speech-tts-stt'
    },
    {
      id: 'networking-vpn',
      title: 'Networking VPN & Infrastructure Security',
      backgroundImage: '/background/background7.png',
      borderColor: '#a78bfa',
      hoverColor: '167, 139, 250',
      baseColor: '67, 56, 89',
      markdownPath: '/markdown/Networking VPN & Infrastructure Security.md',
      containerId: 'card-networking-vpn'
    },
    {
      id: 'vm-browser-automation',
      title: 'Virtual Machine and Browser Automation and Scrapers',
      backgroundImage: '/background/background8.png',
      borderColor: '#fb7185',
      hoverColor: '251, 113, 133',
      baseColor: '89, 45, 54',
      markdownPath: '/markdown/Virtual Machine and Browser Automation and Scrapers.md',
      containerId: 'card-vm-browser-automation'
    },
    {
      id: 'ai-video-games',
      title: 'AI in Video Games & Virtual Beings',
      backgroundImage: '/background/background9.png',
      borderColor: '#34d399',
      hoverColor: '52, 211, 153',
      baseColor: '36, 89, 67',
      markdownPath: '/markdown/AI in Video Games & Virtual Beings.md',
      containerId: 'card-ai-video-games'
    },
    {
      id: 'home-automation',
      title: 'Home Automation & Security',
      backgroundImage: '/background/background10.png',
      borderColor: '#fbbf24',
      hoverColor: '251, 191, 36',
      baseColor: '89, 67, 36',
      markdownPath: '/markdown/Home Automation & Security.md',
      containerId: 'card-home-automation'
    }
  ];

  const handleMarkdownLoad = useCallback((fileEntry) => {
    if (fileEntry.status === 'loading') {
      addMarkdownFile(fileEntry);
    } else {
      updateMarkdownFile(fileEntry.path, fileEntry);
    }
  }, [addMarkdownFile, updateMarkdownFile]);

  const handleCardExpand = useCallback(() => {
    // This could be used to close other cards if needed
    // For now, the individual card hooks handle their own state
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <header className="py-1 flex justify-between items-center relative z-[100]">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo/2024_CI__LogoMark_light.png" 
              alt="Companion Intelligence Logo" 
              className="w-auto h-36" 
            />
          </div>
          
          {/* Search Bar */}
          <form className="flex-grow ml-8">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search the Spellbook..." 
                className="w-full h-12 pl-4 pr-12 text-white transition rounded-lg shadow-md focus:outline-none focus:ring-2" 
                style={{
                  background: 'rgba(52, 52, 78, 0.8)',
                  border: '1px solid #3784ff',
                  color: '#d2f6ff'
                }}
              />
              <button 
                type="button" 
                className="absolute transition right-3 hover:text-blue-300 focus:outline-none" 
                style={{ color: '#abd4d8' }}
                aria-label="Clear search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" 
                  />
                </svg>
              </button>
            </div>
          </form>
        </header>
      </div>

      {/* Main Content */}
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <div className="flex flex-wrap justify-center gap-8" id="cards-container">
          {cardConfigs.map((config) => (
            <Card
              key={config.id}
              title={config.title}
              backgroundImage={config.backgroundImage}
              borderColor={config.borderColor}
              hoverColor={config.hoverColor}
              baseColor={config.baseColor}
              markdownPath={config.markdownPath}
              containerId={config.containerId}
              onCardExpand={handleCardExpand}
            />
          ))}
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel
        debugState={debugState}
        onClose={hideDebugPanel}
        onTabSwitch={switchDebugTab}
      />
    </div>
  );
};

export default App;
