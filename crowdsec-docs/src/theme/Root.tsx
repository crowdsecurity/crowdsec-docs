import Head from "@docusaurus/Head";
import { useLocation } from "@docusaurus/router";
import { useStorageSlot } from "@docusaurus/theme-common";
import React from "react";
import CookieConsent from "../../plugins/gtag/theme/cookieconsent";
import { TooltipProvider } from "../ui/tooltip";

// Thin utility pages; plugin-sitemap drops noindex routes, so this also removes them from sitemap.xml.
const NOINDEX_PATH = /^\/(search|blog\/(tags|authors|archive))(\/|$)/;

export default function Root({ children }): React.JSX.Element {
	const [value, _] = useStorageSlot("docusaurus.cookieConsent");
	const { pathname } = useLocation();
	return (
		<TooltipProvider>
			{NOINDEX_PATH.test(pathname) && (
				<Head>
					<meta name="robots" content="noindex" />
				</Head>
			)}
			{children}
			{value === null && <CookieConsent />}
		</TooltipProvider>
	);
}
