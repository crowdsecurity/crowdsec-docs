import React from "react";

const SIGNUP_LINK = `https://app.crowdsec.net/signup${process.env.NODE_ENV === 'production' ? '?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd&mtm_content=Console' : ''}`
export default function ConsoleAd() {
    return (
        <a href={SIGNUP_LINK} target="_blank">
            <img src="/img/console_ad_dark.svg" alt="CrowdSec Console" width="100%" />
        </a>
    );
  }