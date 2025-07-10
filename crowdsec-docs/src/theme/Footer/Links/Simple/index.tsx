import LinkItem from "@theme/Footer/LinkItem";
import type { Props } from "@theme/Footer/Links/Simple";
import clsx from "clsx";
import React from "react";

function Separator() {
	return <span className="footer__link-separator">·</span>;
}

function SimpleLinkItem({ item }: { item: Props["links"][number] }) {
	return item.html ? (
		<span
			className={clsx("footer__link-item", item.className)}
			// Developer provided the HTML, so assume it's safe.
			// biome-ignore lint/security/noDangerouslySetInnerHtml: we trust the content
			dangerouslySetInnerHTML={{ __html: item.html }}
		/>
	) : (
		<LinkItem item={item} />
	);
}

export default function FooterLinksSimple({ links }: Readonly<Props>): React.JSX.Element {
	return (
		<div className="footer__links text--center">
			<div className="footer__links">
				{links.map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: We use the index as a key here because the links are static and do not change.
					<React.Fragment key={i}>
						<SimpleLinkItem item={item} />
						{links.length !== i + 1 && <Separator />}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
