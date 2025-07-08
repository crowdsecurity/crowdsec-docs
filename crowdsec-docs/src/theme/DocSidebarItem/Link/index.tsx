import isInternalUrl from "@docusaurus/isInternalUrl";
import Link from "@docusaurus/Link";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { Badge } from "@site/src/ui/badge";
import type { Props } from "@theme/DocSidebarItem/Link";
import IconExternalLink from "@theme/Icon/ExternalLink";
import clsx from "clsx";
import React from "react";

export default function DocSidebarItemLink({ item, onItemClick, activePath, level, index, ...props }: Readonly<Props>): React.JSX.Element {
	const { href, label, className, autoAddBaseUrl, customProps } = item;
	const isActive = isActiveSidebarItem(item, activePath);
	const isInternalLink = isInternalUrl(href);
	const tag = customProps?.tag;

	console.log(label, tag);

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
					tag ? "flex items-center justify-between" : "flex items-center"
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
				{tag === "premium" && (
					<Badge className="m-1" variant="premium">
						Premium
					</Badge>
				)}
				{!isInternalLink && <IconExternalLink />}
			</Link>
		</li>
	);
}
