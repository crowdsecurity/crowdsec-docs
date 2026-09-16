import React from "react";
import { mix } from "../../../utils/colorMix";

export type SidebarTag = "premium" | "new";

const TAG_LABELS: Record<SidebarTag, { label: string; color: string }> = {
	premium: { label: "Premium", color: "var(--cs-orange)" },
	new: { label: "New", color: "var(--cs-teal)" },
};

/** Sidebar badge driven by a `customProps.tag` on a sidebar item.
 * Shared by DocSidebarItem/Link and DocSidebarItem/Category so both render identically.
 * Unknown tags (e.g. "otherSection", which renders an icon instead) return nothing. */
export default function SidebarTagBadge({ tag }: { tag?: unknown }): React.JSX.Element | null {
	if (typeof tag !== "string") return null;
	const def = TAG_LABELS[tag as SidebarTag];
	if (!def) return null;
	return (
		<span
			style={{
				fontFamily: "var(--cs-font-mono)",
				fontSize: 9.5,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				padding: "2px 6px",
				borderRadius: 4,
				background: mix(def.color, 14),
				color: def.color,
				fontWeight: 600,
				flexShrink: 0,
				marginLeft: "auto",
			}}
		>
			{def.label}
		</span>
	);
}
