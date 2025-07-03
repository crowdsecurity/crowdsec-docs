// Import necessary components and modules

import ConsoleAd from "@site/src/components/console-ad"
import TOCItems from "@theme/TOCItems"
import clsx from "clsx"
import type React from "react"
import styles from "./styles.module.css"

// Define custom classNames
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight"
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active"

// Modified TOC component
const TOC = ({ className, ...props }): React.JSX.Element => {
	return (
		<div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
			<TOCItems {...props} toc={props.toc ?? []} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
			<ConsoleAd />
		</div>
	)
}

export default TOC
