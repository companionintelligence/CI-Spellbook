// The one judgement call dev-tools/check-links.mjs makes that is worth testing on its
// own: when a permanent redirect means "update the catalog" and when it does not.
//
// A permanent redirect from a page to a DIFFERENT page (a post that moved from
// /research/ to /engineering/, a project that changed domain) means the catalog should
// point at the new address, and the checker says so.
//
// A redirect from an address to a deeper page of the SAME site is different. A docs home
// that sends you to its own "introduction" (docs.pipecat.ai/ to /overview/introduction),
// or a course page that sends you to its first lesson, is the owner choosing a landing
// page. The shorter address is the stable one: it keeps working when they choose
// another, and pinning the catalog to the landing page would pin it to their current
// choice (a lesson id, a dated spec version, a Cloud quickstart where the row describes
// the library). So that is not "moved", and `--strict` does not fail on it.
//
// Hosts are compared without a leading "www.", so a site that adds or drops it is still
// the same site; a different domain (notion.so to notion.com) is a different site.

const parse = (url) => {
  const { host, pathname } = new URL(url);
  return { host: host.replace(/^www\./, '').toLowerCase(), path: pathname.replace(/\/+$/, '') };
};

/**
 * @param {string} original  the address the catalog uses
 * @param {string} final     where the redirects ended up
 * @returns {boolean} true when `final` is the same site's own deeper landing page
 */
export function isLandingAlias(original, final) {
  const a = parse(original);
  const b = parse(final);
  return a.host === b.host && (b.path === a.path || b.path.startsWith(`${a.path}/`));
}
