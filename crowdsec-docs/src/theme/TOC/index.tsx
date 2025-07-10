import ConsoleAd from "@site/src/components/console-ad";
import TOCItems from "@theme/TOCItems";
import clsx from "clsx";
import React from "react";

// Define custom classNames
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";

// Modified Table of Contents component
const TableOfContent = ({ className, ...props }): React.JSX.Element => (
	<div
		className={clsx("thin-scrollbar overflow-y-auto sticky hidden md:block px-1 md:px-0", className)}
		style={{
			top: "calc(var(--ifm-navbar-height) + 1rem)", // Adjust top position to account for the navbar height
			maxHeight: "calc(100vh - (var(--ifm-navbar-height) + 2rem))", // Adjust height to fit within the viewport
		}}
	>
		<TOCItems {...props} toc={props.toc ?? []} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
		<ConsoleAd />
	</div>
);

export default TableOfContent;
