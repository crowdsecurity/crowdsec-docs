import { useStorageSlot } from "@docusaurus/theme-common";
import React from "react";
import CookieConsent from "../../plugins/gtag/theme/cookieconsent";
import { TooltipProvider } from "../ui/tooltip";

export default function Root({ children }): React.JSX.Element {
	const [value, _] = useStorageSlot("docusaurus.cookieConsent");
	return (
		<TooltipProvider>
			{children}
			{value === null && <CookieConsent />}
		</TooltipProvider>
	);
}
