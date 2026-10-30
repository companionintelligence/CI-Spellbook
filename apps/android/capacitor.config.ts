import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config for the Android shell. The app ships the Spellbook Vite build
 * (webDir -> ../../dist) from the APK's assets: the shelves are static markdown
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
    androidScheme: 'https',
    ...(process.env.CAP_SERVER_URL ? { url: process.env.CAP_SERVER_URL, cleartext: true } : {}),
  },
  android: {
    // targetSdk 36 lays the window out edge-to-edge. The page does not opt in to that
    // (no env(safe-area-inset-*) padding), so have Capacitor inset the WebView from the
    // system bars. Not 'force': only act when the OS enforces edge-to-edge (Android 15+).
    adjustMarginsForEdgeToEdge: 'auto',
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
      overlaysWebView: false,
    },
  },
};

export default config;
