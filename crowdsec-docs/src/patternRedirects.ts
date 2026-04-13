/**
 * Shared wildcard redirect rules used in two places:
 *  1. docusaurus.config.ts → createRedirects: generates static redirect HTML files at build time
 *     for paths that resolve to a real page (Docusaurus's reverse API).
 *  2. src/theme/NotFound/Content/index.tsx → useEffect: catches anything that slipped through
 *     at runtime and redirects the user before they see the 404 page.
 *
 * Add rules here using the natural direction: "users coming from X should land on Y".
 * - `from`: regexp matching the old/incoming URL path
 * - `to`: replacement string for the destination path, supports capture groups ($1, $2, …)
 *
 * Example: { from: /^\/appsec(\/.*)$/, to: "/docs/next/appsec$1" }
 *   → /appsec/quickstart/foo redirects to /docs/next/appsec/quickstart/foo
 */
export type PatternRedirect = { from: RegExp; to: string };

export const patternRedirects: PatternRedirect[] = [
	{ from: /^\/appsec(\/.*)$/, to: "/docs/next/appsec$1" },
	// Add more patterns here as needed:
	// { from: /^\/cscli(\/.*)$/, to: "/docs/next/cscli$1" },
];
