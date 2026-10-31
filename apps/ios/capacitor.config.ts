import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config for the iOS shell. The app ships the Spellbook Vite build
 * (webDir -> ../../dist) from the app bundle: the shelves are static markdown
 * under dist/markdown/, fetched same-origin by the web app, so the catalog works
 * offline and the shell needs no server. Build the web app first (`npm run build`
 * at the repo root, or `npm run build` here, which does both).
 *
 * Set CAP_SERVER_URL (for example http://<LAN IP>:5500, the Vite dev server) before
 * `cap sync` to point the shell at a live dev server instead of the bundled build.
 * Never set it for a build you ship: it is baked into the generated
 * capacitor.config.json.
 */
const config: CapacitorConfig = {
  appId: 'com.companionintelligence.spellbook',
  appName: 'Companion Spellbook',
  webDir: '../../dist',
  // Spellbook is a dark-only surface (index.html: <meta name="theme-color" content="#071533">).
  // The webview background shows through overscroll and while the page paints.
  backgroundColor: '#071533',
  server: {
    ...(process.env.CAP_SERVER_URL ? { url: process.env.CAP_SERVER_URL, cleartext: true } : {}),
  },
  ios: {
    // The web page does not opt in to the full-screen layout (no viewport-fit=cover, no
    // env(safe-area-inset-*) padding), so let UIKit inset the scroll view by the safe area
    // instead of drawing the header under the notch or the home indicator.
    contentInset: 'always',
    // Capacitor's default is false, and with it the web view's scroll view refuses to zoom,
    // so pinch-zoom does nothing. The site lets people zoom (WCAG 1.4.4, Resize Text), so
    // the shell must not take that away.
    zoomEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 600,
      backgroundColor: '#071533',
      showSpinner: false,
    },
    StatusBar: {
      // Capacitor DARK = light glyphs, for a dark surface.
      style: 'DARK',
      backgroundColor: '#071533',
    },
  },
};

export default config;
