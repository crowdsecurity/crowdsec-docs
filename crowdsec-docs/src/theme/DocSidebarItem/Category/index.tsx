import Link from "@docusaurus/Link";
import { findFirstSidebarItemLink, isActiveSidebarItem, useDocSidebarItemsExpandedState } from "@docusaurus/plugin-content-docs/client";
import { translate } from "@docusaurus/Translate";
import { Collapsible, ThemeClassNames, useCollapsible, usePrevious, useThemeConfig } from "@docusaurus/theme-common";
import { isSamePath } from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { Badge } from "@site/src/ui/badge";
import { Tooltip } from "@site/src/ui/tooltip";
import type { Props } from "@theme/DocSidebarItem/Category";
import DocSidebarItems from "@theme/DocSidebarItems";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import React, { type ComponentProps, useEffect, useMemo } from "react";

// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({
	isActive,
	collapsed,
	updateCollapsed,
}: {
	isActive: boolean;
	collapsed: boolean;
	updateCollapsed: (b: boolean) => void;
}) {
	const wasActive = usePrevious(isActive);
	useEffect(() => {
		const justBecameActive = isActive && !wasActive;
		if (justBecameActive && collapsed) {
			updateCollapsed(false);
		}
	}, [isActive, wasActive, collapsed, updateCollapsed]);
}

/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback. This allows to be able to navigate inside
 * the category even when JS fails to load, is delayed or simply disabled
 * React hydration becomes an optional progressive enhancement
 * see https://github.com/facebookincubator/infima/issues/36#issuecomment-772543188
 * see https://github.com/facebook/docusaurus/issues/3030
 */
function useCategoryHrefWithSSRFallback(item: Props["item"]): string | undefined {
	const isBrowser = useIsBrowser();
	return useMemo(() => {
		if (item.href && !item.linkUnlisted) {
			return item.href;
		}
		// In these cases, it's not necessary to render a fallback
		// We skip the "findFirstCategoryLink" computation
		if (isBrowser || !item.collapsible) {
			return undefined;
		}
		return findFirstSidebarItemLink(item);
	}, [item, isBrowser]);
}

function CollapseButton({
	collapsed,
	categoryLabel,
	onClick,
}: Readonly<{
	collapsed: boolean;
	categoryLabel: string;
	onClick: ComponentProps<"button">["onClick"];
}>) {
	return (
		<button
			aria-label={
				collapsed
					? translate(
							{
								id: "theme.DocSidebarItem.expandCategoryAriaLabel",
								message: "Expand sidebar category '{label}'",
								description: "The ARIA label to expand the sidebar category",
							},
							{ label: categoryLabel }
						)
					: translate(
							{
								id: "theme.DocSidebarItem.collapseCategoryAriaLabel",
								message: "Collapse sidebar category '{label}'",
								description: "The ARIA label to collapse the sidebar category",
							},
							{ label: categoryLabel }
						)
			}
			aria-expanded={!collapsed}
			type="button"
			className="clean-btn"
			onClick={onClick}
		>
			<ChevronRight className={clsx("mx-2 duration-300 text-foreground/80", !collapsed && "rotate-90")} />
		</button>
	);
}

export default function DocSidebarItemCategory({
	item,
	onItemClick,
	activePath,
	level,
	index,
	...props
}: Readonly<Props>): React.JSX.Element {
	const { items, label, collapsible, className, href, customProps } = item;
	const {
		docs: {
			sidebar: { autoCollapseCategories },
		},
	} = useThemeConfig();
	const tag = customProps?.tag;
	const isPremium = tag === "premium";
	const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);

	const isActive = isActiveSidebarItem(item, activePath);
	const isCurrentPage = isSamePath(href, activePath);

	const { collapsed, setCollapsed } = useCollapsible({
		// Active categories are always initialized as expanded. The default
		// (`item.collapsed`) is only used for non-active categories.
		initialState: () => {
			if (!collapsible) {
				return false;
			}
			return isActive ? false : item.collapsed;
		},
	});

	const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
	// Use this instead of `setCollapsed`, because it is also reactive
	const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
		setExpandedItem(toCollapsed ? null : index);
		setCollapsed(toCollapsed);
	};
	useAutoExpandActiveCategory({ isActive, collapsed, updateCollapsed });
	useEffect(() => {
		if (collapsible && expandedItem != null && expandedItem !== index && autoCollapseCategories) {
			setCollapsed(true);
		}
	}, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

	return (
		<li
			className={clsx(
				ThemeClassNames.docs.docSidebarItemCategory,
				ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
				"menu__list-item",
				{
					"menu__list-item--collapsed": collapsed,
				},
				className
			)}
		>
			<div
				className={clsx("menu__list-item-collapsible", {
					"menu__list-item-collapsible--active": isCurrentPage,
				})}
			>
				<Link
					className={clsx("menu__link", {
						"menu__link--sublist": collapsible,
						"menu__link--active": isActive,
					})}
					onClick={
						collapsible
							? (e) => {
									onItemClick?.(item);
									if (href) {
										// When already on the category's page, we collapse it
										// We don't use "isActive" because it would collapse the
										// category even when we browse a children element
										// See https://github.com/facebook/docusaurus/issues/11213
										if (isCurrentPage) {
											e.preventDefault();
											updateCollapsed();
										} else {
											// When navigating to a new category, we always expand
											// see https://github.com/facebook/docusaurus/issues/10854#issuecomment-2609616182
											updateCollapsed(false);
										}
									} else {
										e.preventDefault();
										updateCollapsed();
									}
								}
							: () => {
									onItemClick?.(item);
								}
					}
					aria-current={isCurrentPage ? "page" : undefined}
					role={collapsible && !href ? "button" : undefined}
					aria-expanded={collapsible && !href ? !collapsed : undefined}
					href={collapsible ? (hrefWithSSRFallback ?? "#") : hrefWithSSRFallback}
					{...props}
				>
					{label}
					{!collapsible && isPremium && (
						<Tooltip>
							<Badge className="m-1" variant="premium">
								Premium
							</Badge>
						</Tooltip>
					)}
				</Link>

				{collapsible && (
					<CollapseButton
						collapsed={collapsed}
						categoryLabel={label}
						onClick={(e) => {
							e.preventDefault();
							updateCollapsed();
						}}
					/>
				)}
			</div>

			<Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
				<DocSidebarItems
					items={items}
					tabIndex={collapsed ? -1 : 0}
					onItemClick={onItemClick}
					activePath={activePath}
					level={level + 1}
				/>
			</Collapsible>
		</li>
	);
}
