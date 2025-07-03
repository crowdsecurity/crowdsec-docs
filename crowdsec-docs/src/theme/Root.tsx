import { useStorageSlot } from "@docusaurus/theme-common"
import type React from "react"
import CookieConsent from "../../plugins/gtag/theme/cookieconsent"

export default function Root({ children }): React.JSX.Element {
	const [value, _] = useStorageSlot("docusaurus.cookieConsent")
	return (
		<>
			{children}
			{value === null && <CookieConsent />}
		</>
	)
}
