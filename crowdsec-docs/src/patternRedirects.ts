/**
 * Used for run-time redirects. 
 * Addition based on 404 we observe in amplify logs that are not solvable or easily solvable with static redirects. 
 */
export type PatternRedirect = { from: RegExp; to: string };

export const patternRedirects: PatternRedirect[] = [
	{ from: /^\/appsec(\/.*)$/, to: "/docs/next/appsec$1" },
	// Add more patterns here as needed:
];
