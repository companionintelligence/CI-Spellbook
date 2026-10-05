// The one place the site's outbound product links and its public copy are
// written down. App.jsx renders them; index.html carries a static copy for
// crawlers and no-JS readers; scripts/assert-site.mjs fails the build when the
// two disagree.

/** The main site, and the two calls to action every Companion site carries. */
export const HOME_URL = 'https://ci.computer';
export const BUY_URL = 'https://ci.computer/core';
export const DOWNLOAD_URL = 'https://ci.computer/download';

/** This app's own page in the docs. */
export const DOCS_URL = 'https://docs.ci.computer/docs/apps-available/first-party-apps/spellbook';

/** Where this site is served from. */
export const SITE_URL = 'https://magic.ci.computer/';

export const BUY_LABEL = 'Buy Companion Core';
export const DOWNLOAD_LABEL = 'Download Companion';

export const PRODUCT_NAME = 'Spellbook';
export const HEADLINE = 'Spellbook: a catalog of local-AI and self-hosting tools';

/** One sentence, in the words the Companion Hub app listing already uses. */
export const LEDE =
  'Shelves organized by the job you are doing, from model managers and MCP connectors to home servers, networking and edge hardware. Open a shelf, or search them all.';

/**
 * Spellbook's listing in the Companion Hub App Store, the same address
 * ci.computer/download links to. The footer sentence is `HUB_NOTE_LEAD`, then
 * the label as a link, then a full stop.
 */
export const HUB_STORE_URL = 'https://hub.ci.computer/store/ci-spellbook';
export const HUB_STORE_LABEL = 'Companion Hub App Store';
export const HUB_NOTE_LEAD = 'Spellbook is also available in the ';

export const LICENSE_URL = 'https://polyformproject.org/licenses/noncommercial/1.0.0';
