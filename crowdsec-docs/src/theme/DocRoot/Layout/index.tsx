 /**
 * CrowdSec Made Swizzled override of @docusaurus/theme-classic's DocRoot/Layout component.
 *
 * The original only renders the sidebar + main content area.
 * This override injects a custom SecondaryNavbar above that content, which adds:
 *   - A breadcrumb trail (Home > Section > [current page path])
 *   - A version dropdown (when multiple doc versions exist)
 *
 * Docusaurus picks this file automatically because it lives at
 * src/theme/DocRoot/Layout/index.tsx, shadowing the original in node_modules.
 */

import {
	useActiveDocContext,
	useActivePlugin,
	useDocsSidebar,
	useDocsPreferredVersion,
	useVersions,
	useSidebarBreadcrumbs,
} from "@docusaurus/plugin-content-docs/client";
import { useHistorySelector } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import BackToTopButton from "@theme/BackToTopButton";
import DocRootLayoutMain from "@theme/DocRoot/Layout/Main";
import DocRootLayoutSidebar from "@theme/DocRoot/Layout/Sidebar";
import type { Props } from "@theme/DocRoot/Layout";
import type { PropSidebarBreadcrumbsItem } from "@docusaurus/plugin-content-docs";
import { SECTION_MAP } from "@site/src/sectionMap";
import clsx from "clsx";
import { ChevronRight, House } from "lucide-react";
import React, { type ReactNode, useState } from "react";

import styles from "./styles.module.css";

function VersionDropdown({ pluginId }: { pluginId: string }): ReactNode {
	const versions = useVersions(pluginId);
	const activeDocContext = useActiveDocContext(pluginId);
	const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);
	const search = useHistorySelector((h) => h.location.search);
	const hash = useHistorySelector((h) => h.location.hash);

	const activeVersion = activeDocContext.activeVersion;
	if (!activeVersion || versions.length <= 1) return null;

	return (
		<div className={styles.versionDropdown}>
			<select
				value={activeVersion.name}
				onChange={(e) => {
					const selected = versions.find((v) => v.name === e.target.value);
					if (!selected) return;
					savePreferredVersionName(selected.name);
					const alternateDoc = activeDocContext.alternateDocVersions[selected.name];
					const target = alternateDoc?.path ?? selected.path;
					window.location.href = `${target}${search}${hash}`;
				}}
				aria-label="Select documentation version"
			>
				{versions.map((v) => (
					<option key={v.name} value={v.name}>
						{v.label}
					</option>
				))}
			</select>
		</div>
	);
}

function SecondaryNavbar(): ReactNode {
	const sidebar = useDocsSidebar();
	const activePlugin = useActivePlugin();
	const breadcrumbs = useSidebarBreadcrumbs();

	const pluginId = activePlugin?.pluginId ?? "default";
	const sidebarName = sidebar?.name ?? "";
	const section = SECTION_MAP[sidebarName];

	return (
		<div className={styles.secondaryNavbar}>
			<div className={styles.secondaryNavbarInner}>
				<nav className={styles.breadcrumb} aria-label="Breadcrumb">
					{/* Home icon */}
					<Link to="/" className={styles.breadcrumbHome} aria-label="Home">
						<House size={14} aria-hidden />
					</Link>

					{/* Optional parent section (e.g. "Security Engine" for AppSec) */}
					{section?.parent && (
						<>
							<ChevronRight size={13} className={styles.breadcrumbSeparator} aria-hidden />
							<Link to={section.parent.introPath} className={styles.breadcrumbItem}>
								{section.parent.label}
							</Link>
						</>
					)}

					{/* Section label (e.g. "Remediation Components") */}
					{section && (
						<>
							<ChevronRight size={13} className={styles.breadcrumbSeparator} aria-hidden />
							<Link to={section.introPath} className={styles.breadcrumbItem}>
								{section.label}
							</Link>
						</>
					)}

					{/* Sidebar breadcrumb trail */}
					{breadcrumbs?.map((item: PropSidebarBreadcrumbsItem, idx: number) => {
							const isLast = idx === breadcrumbs.length - 1;
							const href =
								item.type === "category" && (item as { linkUnlisted?: boolean }).linkUnlisted
									? undefined
									: item.href;

							return (
								<React.Fragment key={idx}>
									<ChevronRight size={13} className={styles.breadcrumbSeparator} aria-hidden />
									{!isLast && href ? (
										<Link to={href} className={styles.breadcrumbItem}>
											{item.label}
										</Link>
									) : (
										<span className={clsx(styles.breadcrumbItem, isLast && styles.breadcrumbItemActive)}>
											{item.label}
										</span>
									)}
								</React.Fragment>
							);
						})}
				</nav>

				<VersionDropdown pluginId={pluginId} />
			</div>
		</div>
	);
}

export default function DocRootLayout({ children }: Props): ReactNode {
	const sidebar = useDocsSidebar();
	const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

	return (
		<div className={styles.docsWrapper}>
			<BackToTopButton />
			<SecondaryNavbar />
			<div className={styles.docRoot}>
				{sidebar && (
					<DocRootLayoutSidebar
						sidebar={sidebar.items}
						hiddenSidebarContainer={hiddenSidebarContainer}
						setHiddenSidebarContainer={setHiddenSidebarContainer}
					/>
				)}
				<DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
					{children}
				</DocRootLayoutMain>
			</div>
		</div>
	);
}
