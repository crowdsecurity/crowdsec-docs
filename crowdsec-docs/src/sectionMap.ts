/**
 * Maps each Docusaurus sidebar name (the key in sidebars.ts / sidebarsUnversioned.ts)
 * to a human-readable label and the path to that section's intro page.
 *
 * The label appears as the first breadcrumb item after the home icon.
 * The introPath is where clicking that breadcrumb item navigates to.
 *
 * Optional `parent` adds an intermediate crumb before the section label,
 * e.g. for sub-sections of Security Engine.
 */
export type SectionInfo = {
	label: string;
	introPath: string;
	parent?: {
		label: string;
		introPath: string;
	};
};

export const SECTION_MAP: Record<string, SectionInfo> = {
	// ── Versioned (sidebars.ts) ───────────────────────────────────
	tutorialSidebar: {
		label: "Security Engine",
		introPath: "/docs/intro",
	},
	appSecSideBar: {
		label: "Web Application Firewall",
		introPath: "/docs/next/appsec/intro",
		parent: { label: "Security Engine", introPath: "/docs/intro" },
	},
	cscliSidebar: {
		label: "Cscli",
		introPath: "/docs/cscli/cscli",
		parent: { label: "Security Engine", introPath: "/docs/intro" },
	},
	sdkSideBar: {
		label: "SDK",
		introPath: "/docs/getting_started/sdk_intro",
		parent: { label: "Security Engine", introPath: "/docs/intro" },
	},

	// ── Unversioned (sidebarsUnversioned.ts) ─────────────────────
	consoleSidebar: {
		label: "Console",
		introPath: "/u/console/intro",
	},
	ctiApiSidebar: {
		label: "CTI",
		introPath: "/u/cti_api/intro",
	},
	remediationSideBar: {
		label: "Remediation Components",
		introPath: "/u/bouncers/intro",
	},
	blocklistsSideBar: {
		label: "Blocklists",
		introPath: "/u/blocklists/getting_started",
	},
	trackerApiSidebar: {
		label: "Tracker API",
		introPath: "/u/tracker_api/intro",
	},
	troubleshootingSideBar: {
		label: "Troubleshooting",
		introPath: "/u/troubleshooting/intro",
	},
	guidesSideBar: {
		label: "Guides",
		introPath: "/u/user_guides/intro",
	},
	gettingStarted: {
		label: "Getting Started",
		introPath: "/u/getting_started/intro",
		parent: { label: "Security Engine", introPath: "/docs/intro" },
	},
};
