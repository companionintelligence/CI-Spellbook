// Ambient type augmentations for browser APIs this app touches that aren't
// (yet, or ever will be) in the standard `lib.dom.d.ts`.
//
// This file exists only because turning on Deno's built-in TypeScript
// checking (`deno task check` / `deno check`) via deno.json/tsconfig.json is
// new for this repo — previously nothing here was type-checked at all. It
// makes the checker's signal-to-noise ratio usable; it changes no runtime
// behavior.

export {};

declare global {
  interface Performance {
    /**
     * Non-standard, Chrome/Chromium-only heap usage snapshot. Already
     * feature-detected at the call site (`useDebugPanel.js`) with
     * `if (performance.memory)` before use — this just tells the type
     * checker the property can exist.
     */
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}
