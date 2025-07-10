import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import type { Props } from "@theme/Footer/LinkItem";
import clsx from "clsx";
import React from "react";

export default function FooterLinkItem({ item }: Readonly<Props>): React.JSX.Element {
	const { to, href, label, prependBaseUrlToHref, className, ...props } = item;
	const toUrl = useBaseUrl(to);
	const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

	return (
		<Link
			className={clsx("text-sm/6 text-foreground/80 hover:text-primary", className)}
			{...(href
				? {
						href: prependBaseUrlToHref ? normalizedHref : href,
					}
				: {
						to: toUrl,
					})}
			{...props}
		>
			{label}
		</Link>
	);
}
