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

// React 18's types predate two things Card.jsx uses, both standard and both
// supported at runtime by React 18 and every browser this ships to:
//
//   - the `inert` attribute, which takes a closed shelf's back face out of the tab
//     order and the accessibility tree. React 18 passes the empty string through
//     to the DOM as `inert=""`; omitted (undefined) it is absent.
//   - CSS custom properties in a `style` object (`--shelf-hover`).
declare module 'react' {
  interface HTMLAttributes<T> {
    inert?: '' | undefined;
  }

  interface CSSProperties {
    [variable: `--${string}`]: string | number | undefined;
  }
}
