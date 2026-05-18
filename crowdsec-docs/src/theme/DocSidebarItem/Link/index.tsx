import isInternalUrl from "@docusaurus/isInternalUrl";
import Link from "@docusaurus/Link";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/DocSidebarItem/Link";
import clsx from "clsx";
import { ExternalLinkIcon, Signpost } from "lucide-react";
import React from "react";

const premiumBadge: React.CSSProperties = {
	fontFamily: "var(--cs-font-mono)",
	fontSize: 9.5,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	padding: "2px 6px",
	borderRadius: 4,
	background: "color-mix(in srgb, var(--cs-orange) 14%, transparent)",
	color: "var(--cs-orange)",
	fontWeight: 600,
	flexShrink: 0,
	marginLeft: "auto",
};

export default function DocSidebarItemLink({ item, onItemClick, activePath, level, index, ...props }: Readonly<Props>): React.JSX.Element {
	const { href, label, className, autoAddBaseUrl, customProps } = item;
	const isActive = isActiveSidebarItem(item, activePath);
	const isInternalLink = isInternalUrl(href);
	const tag = customProps?.tag;

	return (
		<li
			className={clsx(
				ThemeClassNames.docs.docSidebarItemLink,
				ThemeClassNames.docs.docSidebarItemLinkLevel(level),
				"menu__list-item",
				className
			)}
			key={label}
		>
			<Link
				className={clsx(
					"menu__link",
					!isInternalLink && "items-center",
					{
						"menu__link--active": isActive,
					},
					"flex items-center"
				)}
				autoAddBaseUrl={autoAddBaseUrl}
				aria-current={isActive ? "page" : undefined}
				to={href}
				{...(isInternalLink && {
					onClick: onItemClick ? () => onItemClick(item) : undefined,
				})}
				{...props}
			>
				{label}
				{tag === "premium" && <span style={premiumBadge}>Premium</span>}
				{tag === "otherSection" && <Signpost className="ml-1 h-4 text-foreground/80" />}
				{!isInternalLink && <ExternalLinkIcon className="ml-1 h-4 text-foreground/80" />}
			</Link>
		</li>
	);
}
