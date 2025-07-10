import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/Admonition/Layout";
import clsx from "clsx";
import React, { type ReactNode } from "react";

import styles from "./styles.module.css";

function AdmonitionContainer({ type, className, children }: Pick<Props, "type" | "className"> & { children: ReactNode }) {
	return (
		<div className={clsx(ThemeClassNames.common.admonition, ThemeClassNames.common.admonitionType(type), styles.admonition, className)}>
			{children}
		</div>
	);
}

function AdmonitionHeading({ icon }: Readonly<Pick<Props, "icon" | "title">>) {
	return (
		<div className={clsx(styles.admonitionHeading, "!mb-0")}>
			<span className={styles.admonitionIcon}>{icon}</span>
		</div>
	);
}

function AdmonitionContent({ children }: Pick<Props, "children">) {
	return children ? <div className={clsx(styles.admonitionContent)}>{children}</div> : null;
}

export default function AdmonitionLayout(props: Readonly<Props>): React.JSX.Element {
	const { type, icon, title, children, className } = props;
	return (
		<AdmonitionContainer type={type} className={clsx(className, " flex flex-row items-start alert--icon gap-2")}>
			{title || icon ? <AdmonitionHeading title={title} icon={icon} /> : null}
			<AdmonitionContent>{children}</AdmonitionContent>
		</AdmonitionContainer>
	);
}
