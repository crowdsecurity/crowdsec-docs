// Import necessary components and modules

import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useWindowSize } from "@docusaurus/theme-common";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import DocItemContent from "@theme/DocItem/Content";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocVersionBanner from "@theme/DocVersionBanner";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React from "react";

// Function to decide whether to render the TOC on mobile or desktop
const useDocTableOfContent = () => {
	const { frontMatter, toc } = useDoc();
	const windowSize = useWindowSize();
	const hidden = frontMatter.hide_table_of_contents;
	const canRender = !hidden && toc.length > 0;
	const mobile = canRender ? <DocItemTOCMobile /> : undefined;
	const desktop = windowSize === "desktop" || windowSize === "ssr" ? <DocItemTOCDesktop /> : undefined;

	return {
		hidden,
		mobile,
		desktop,
	};
};

// Modified DocItemLayout component
const DocItemLayout = ({ children }: PropsWithChildren): React.JSX.Element => {
	const docTableOfContent = useDocTableOfContent();

	return (
		<div className="row">
			<div className={clsx("col", !docTableOfContent.hidden && "max-w-3/4 md:max-w-full")}>
				<DocVersionBanner />
				<div>
					<article>
						<DocBreadcrumbs />
						<DocVersionBadge />
						{docTableOfContent.mobile}
						<DocItemContent>{children}</DocItemContent>
						{/* <DocItemFooter /> */}
					</article>
					<DocItemPaginator />
				</div>
			</div>
			{docTableOfContent.desktop && <div className="col col--3">{docTableOfContent.desktop}</div>}
		</div>
	);
};

export default DocItemLayout;
