import isInternalUrl from "@docusaurus/isInternalUrl";
import Link from "@docusaurus/Link";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import SidebarTagBadge from "@site/src/components/docs/SidebarTagBadge";
import type { Props } from "@theme/DocSidebarItem/Link";
import clsx from "clsx";
import { ExternalLinkIcon, Signpost } from "lucide-react";
import React from "react";

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
				<SidebarTagBadge tag={typeof tag === "string" ? tag : undefined} />
				{tag === "otherSection" && <Signpost className="ml-1 h-4 text-foreground/80" />}
				{!isInternalLink && <ExternalLinkIcon className="ml-1 h-4 text-foreground/80" />}
			</Link>
		</li>
	);
}
