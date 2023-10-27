// Import necessary components and modules
import React from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import styles from "./styles.module.css";

// Define custom classNames
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";
const SIGNUP_LINK = `https://app.crowdsec.net/signup${process.env.NODE_ENV === 'production' ? '?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd&mtm_content=Console' : ''}`

// Modified TOC component
export default function TOC({ className, ...props }) {
  return (
    <div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      <a href={SIGNUP_LINK} target="_blank">
        <img src="/img/console_ad_dark.svg" alt="CrowdSec Console" width="100%" />
      </a>
    </div>
  );
}