import useBaseUrl from "@docusaurus/useBaseUrl"
import ThemedImage from "@theme/ThemedImage"
import React from "react"

const SIGNUP_LINK = `https://app.crowdsec.net/signup${
	process.env.NODE_ENV === "production" ? "?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd&mtm_content=Console" : ""
}`
const ConsoleAd = (): React.JSX.Element => {
	return (
		<a href={SIGNUP_LINK} target="_blank">
			<ThemedImage
				alt="CrowdSec Console"
				sources={{
					light: useBaseUrl("/img/console_ad_light_alt.svg"),
					dark: useBaseUrl("/img/console_ad_dark.svg"),
				}}
				width="100%"
			/>
		</a>
	)
}

export default ConsoleAd
