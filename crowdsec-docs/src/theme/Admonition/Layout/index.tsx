import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/Admonition/Layout";
import clsx from "clsx";
import React, { type ReactNode } from "react";

/* ── SVG icon set — stroke 1.6, 13×13 render size ─────────────── */
function InfoCircle() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	);
}

function Sparkle() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" />
		</svg>
	);
}

function Triangle() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}

function OctagonX() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	);
}

function Crown() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M2 20h20" />
			<path d="M5 20V8l5 5 4-8 4 8 3-5v12" />
		</svg>
	);
}

const TYPE_ICONS: Record<string, ReactNode> = {
	note: <InfoCircle />,
	tip: <Sparkle />,
	info: <InfoCircle />,
	warning: <Triangle />,
	danger: <OctagonX />,
	premium: <Crown />,
	caution: <Triangle />,
	secondary: <InfoCircle />,
	important: <InfoCircle />,
	success: <Sparkle />,
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
