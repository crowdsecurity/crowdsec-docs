import { ThemeClassNames } from "@docusaurus/theme-common";
import LinkItem from "@theme/Footer/LinkItem";
import type { Props } from "@theme/Footer/Links/MultiColumn";
import clsx from "clsx";
import React from "react";

type ColumnType = Props["columns"][number];
type ColumnItemType = ColumnType["items"][number];

const ColumnLinkItem = ({ item }: { item: ColumnItemType }): React.JSX.Element => {
	return item.html ? (
		<li
			className={clsx("footer__item", item.className)}
			// Developer provided the HTML, so assume it's safe.
			// biome-ignore lint/security/noDangerouslySetInnerHtml: we trust the content
			dangerouslySetInnerHTML={{ __html: item.html }}
		/>
	) : (
		<li key={item.href ?? item.to} className="footer__item">
			<LinkItem item={item} />
		</li>
	);
};

const Column = ({ column }: Readonly<{ column: ColumnType }>): React.JSX.Element => {
	return (
		<div className={clsx(ThemeClassNames.layout.footer.column, "col footer__col", column.className)}>
			<div className="footer__title">{column.title}</div>
			<ul className="footer__items clean-list">
				{column.items.map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey:  We use the index as a key here because the columns are static and do not change.
					<ColumnLinkItem key={i} item={item} />
				))}
			</ul>
		</div>
	);
};

export default function FooterLinksMultiColumn({ columns }: Readonly<Props>): React.JSX.Element {
	return (
		<div className="row footer__links">
			{columns.map((column, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey:  We use the index as a key here because the columns are static and do not change.
				<Column key={i} column={column} />
			))}
		</div>
	);
}
