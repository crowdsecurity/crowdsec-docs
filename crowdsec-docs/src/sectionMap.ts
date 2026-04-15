/**
 * Maps each Docusaurus sidebar name (the key in sidebars.ts / sidebarsUnversioned.ts)
 * to a human-readable label and the path to that section's intro page.
 *
 * The label appears as the first breadcrumb item after the home icon.
 * The introPath is where clicking that breadcrumb item navigates to.
 *
 * Optional `parent` adds an intermediate crumb before the section label,
 * e.g. for sub-sections of Security Engine.
 *
 * Do not edit this map directly — add/update entries in the `sidebarMeta`
 * exports in sidebars.ts and sidebarsUnversioned.ts instead.
 */
import { sidebarBreadcrumbMeta as versionedMeta } from "../sidebars";
import { sidebarBreadcrumbMeta as unversionedMeta } from "../sidebarsUnversioned";

export type SectionInfo = {
	label: string;
	introPath: string;
	parent?: {
		label: string;
		introPath: string;
	};
};

export const SECTION_MAP: Record<string, SectionInfo> = {
	...versionedMeta,
	...unversionedMeta,
};
