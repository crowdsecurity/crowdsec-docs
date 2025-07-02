import React from "react"
import { useStorageSlot } from "@docusaurus/theme-common"
import CookieConsent from "../../plugins/gtag/theme/cookieconsent"

export default function Root({ children }) {
    const [value, _] = useStorageSlot("docusaurus.cookieConsent")
    return (
        <>
            {children}
            {value === null && <CookieConsent />}
        </>
    )
}
