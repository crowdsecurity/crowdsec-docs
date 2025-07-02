// Import necessary components and modules
import React from "react"
import clsx from "clsx"
import { useWindowSize } from "@docusaurus/theme-common"
import { useDoc } from "@docusaurus/plugin-content-docs/client"
import DocItemPaginator from "@theme/DocItem/Paginator"
import DocVersionBanner from "@theme/DocVersionBanner"
import DocVersionBadge from "@theme/DocVersionBadge"
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile"
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop"
import DocItemContent from "@theme/DocItem/Content"
import DocBreadcrumbs from "@theme/DocBreadcrumbs"
import styles from "./styles.module.css"

// Function to decide whether to render the TOC on mobile or desktop
const useDocTOC = () => {
    const { frontMatter, toc } = useDoc()
    const windowSize = useWindowSize()
    const hidden = frontMatter.hide_table_of_contents
    const canRender = !hidden && toc.length > 0
    const mobile = canRender ? <DocItemTOCMobile /> : undefined
    const desktop =
        windowSize === "desktop" || windowSize === "ssr" ? (
            <DocItemTOCDesktop />
        ) : undefined

    return {
        hidden,
        mobile,
        desktop,
    }
}

// Modified DocItemLayout component
export default function DocItemLayout({ children }) {
    const docTOC = useDocTOC()

    return (
        <div className="row">
            <div className={clsx("col", !docTOC.hidden && styles.docItemCol)}>
                <DocVersionBanner />
                <div className={styles.docItemContainer}>
                    <article>
                        <DocBreadcrumbs />
                        <DocVersionBadge />
                        {docTOC.mobile}
                        <DocItemContent>{children}</DocItemContent>
                        {/* <DocItemFooter /> */}
                    </article>
                    <DocItemPaginator />
                </div>
            </div>
            {docTOC.desktop && (
                <div className="col col--3">{docTOC.desktop}</div>
            )}
        </div>
    )
}
