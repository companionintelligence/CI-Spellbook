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
    // Capacitor's default is false, which turns the WebView's built-in zoom off, so
    // pinch-zoom does nothing. The site lets people zoom (WCAG 1.4.4, Resize Text), so
    // the shell must not take that away.
    zoomEnabled: true,
    // Capacitor's default is 60. The built CSS is Tailwind CSS 4, which documents Chrome 111
    // as its floor. Below this Capacitor logs an error, but with no server.errorPath (an error
    // page inside webDir) it still loads the app, so this records the floor, it does not
    // enforce it.
    minWebViewVersion: 111,
  },
  plugins: {
    // targetSdk 36 lays the window out edge-to-edge (Android 15+). Capacitor 8's SystemBars
    // plugin insets the WebView from the system bars by default (`insetsHandling`), which is
    // what this page needs: it does not set viewport-fit=cover or pad for env(safe-area-inset-*).
    // Capacitor 8 removed `android.adjustMarginsForEdgeToEdge`, which did this in Capacitor 7.
    SystemBars: {
      // Capacitor DARK = light glyphs, for a dark surface.
      style: 'DARK',
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 600,
      backgroundColor: '#071533',
      showSpinner: false,
    },
    StatusBar: {
      // Android 14 and older only. From Android 15 the system draws edge-to-edge, and
      // @capacitor/status-bar 8 ignores `backgroundColor` and `overlaysWebView` there; the
      // strip behind the bar shows the window background (res/values/styles.xml) instead.
      // Capacitor DARK = light glyphs, for a dark surface.
      style: 'DARK',
      backgroundColor: '#071533',
      overlaysWebView: false,
    },
  },
};

export default config;
