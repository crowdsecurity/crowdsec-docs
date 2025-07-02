// Import necessary components and modules
import React from "react"
import clsx from "clsx"
import TOCItems from "@theme/TOCItems"
import styles from "./styles.module.css"
import ConsoleAd from "@site/src/components/console-ad"

// Define custom classNames
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight"
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active"

// Modified TOC component
const TOC = ({ className, ...props }): React.JSX.Element => {
    return (
        <div
            className={clsx(
                styles.tableOfContents,
                "thin-scrollbar",
                className
            )}
        >
            <TOCItems
                {...props}
                toc={props.toc ?? []}
                linkClassName={LINK_CLASS_NAME}
                linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
            />
            <ConsoleAd />
        </div>
    )
}

export default TOC
