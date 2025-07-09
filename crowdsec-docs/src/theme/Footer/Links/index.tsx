import { isMultiColumnFooterLinks } from "@docusaurus/theme-common";
import type { Props } from "@theme/Footer/Links";
import FooterLinksMultiColumn from "@theme/Footer/Links/MultiColumn";
import FooterLinksSimple from "@theme/Footer/Links/Simple";
import React from "react";

export default function FooterLinks({ links }: Props): React.JSX.Element {
	return isMultiColumnFooterLinks(links) ? <FooterLinksMultiColumn columns={links} /> : <FooterLinksSimple links={links} />;
}
