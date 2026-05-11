import { cilCheckCircle, cilDiamond, cilInfo, cilLightbulb, cilWarning, cilXCircle } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/Admonition/Layout";
import clsx from "clsx";
import React, { type ReactNode } from "react";

const ICON_STYLE = { width: 15, height: 15 };

const TYPE_ICONS: Record<string, ReactNode> = {
	note: <CIcon icon={cilInfo} style={ICON_STYLE} aria-hidden="true" />,
	tip: <CIcon icon={cilLightbulb} style={ICON_STYLE} aria-hidden="true" />,
	info: <CIcon icon={cilInfo} style={ICON_STYLE} aria-hidden="true" />,
	warning: <CIcon icon={cilWarning} style={ICON_STYLE} aria-hidden="true" />,
	danger: <CIcon icon={cilXCircle} style={ICON_STYLE} aria-hidden="true" />,
	premium: <CIcon icon={cilDiamond} style={ICON_STYLE} aria-hidden="true" />,
	caution: <CIcon icon={cilWarning} style={ICON_STYLE} aria-hidden="true" />,
	secondary: <CIcon icon={cilInfo} style={ICON_STYLE} aria-hidden="true" />,
	important: <CIcon icon={cilInfo} style={ICON_STYLE} aria-hidden="true" />,
	success: <CIcon icon={cilCheckCircle} style={ICON_STYLE} aria-hidden="true" />,
};

const TYPE_DEFAULTS: Record<string, string> = {
	note: "NOTE",
	tip: "TIP",
	info: "INFO",
	warning: "WARNING",
	danger: "DANGER",
	premium: "PREMIUM",
	caution: "CAUTION",
};

export default function AdmonitionLayout({ type, icon: _icon, title, children, className }: Readonly<Props>): React.JSX.Element {
	const svgIcon = TYPE_ICONS[type] ?? TYPE_ICONS.note;
	const displayTitle = title ?? TYPE_DEFAULTS[type] ?? type.toUpperCase();

	return (
		<div className={clsx(ThemeClassNames.common.admonition, ThemeClassNames.common.admonitionType(type), "cs-admon", type, className)}>
			<div className="cs-admon__icon" aria-hidden="true">
				{svgIcon}
			</div>
			<div className="cs-admon__body">
				<div className="cs-admon__title">{displayTitle}</div>
				{children && <div className="cs-admon__content">{children}</div>}
			</div>
		</div>
	);
}
