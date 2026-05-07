import React from "react";

/* Shared icon set — same as ChallengeGrid. Pass iconName="search" */
const ICONS: Record<string, React.ReactNode> = {
	search: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" />
			<path d="M20 20l-3.5-3.5" />
		</svg>
	),
	key: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="8" cy="14" r="4" />
			<path d="M11 11l8-8M16 6l3 3M14 8l3 3" />
		</svg>
	),
	terminal: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="3" y="4" width="18" height="16" rx="2" />
			<path d="M7 10l3 2-3 2M13 14h4" />
		</svg>
	),
	globe: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
		</svg>
	),
	shield: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
		</svg>
	),
	feed: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="6" cy="18" r="2" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<path d="M4 11a9 9 0 0 1 9 9" />
		</svg>
	),
	compass: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M15 9l-2 5-5 2 2-5 5-2z" />
		</svg>
	),
	book: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M4 5a3 3 0 0 1 3-3h11v18H7a3 3 0 0 0-3 3V5z" />
			<path d="M4 5v18" />
		</svg>
	),
	plug: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8z" />
			<path d="M12 18v4" />
		</svg>
	),
	alert: (
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
	),
	gauge: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 14a9 9 0 0 1 18 0" />
			<path d="M12 14l4-4" />
			<circle cx="12" cy="14" r="1.5" />
		</svg>
	),
	lock: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="4" y="11" width="16" height="10" rx="2" />
			<path d="M8 11V7a4 4 0 0 1 8 0v4" />
		</svg>
	),
	box: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 7l9-4 9 4-9 4-9-4z" />
			<path d="M3 7v10l9 4 9-4V7" />
			<path d="M12 11v10" />
		</svg>
	),
	pulse: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 12h4l2-6 4 12 2-6h6" />
		</svg>
	),
	users: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
};

export type DocCardLink = {
	label: string;
	href: string;
	external?: boolean;
};

export type DocCardProps = {
	/* Content */
	title: string;
	desc?: string;
	badge?: string;

	/* Icon — pass either iconName (string key) or a ReactNode */
	iconName?: string;
	icon?: React.ReactNode;

	/* Color — must be a CSS var or valid CSS color. Defaults to --cs-orange */
	color?: string;

	/* CTA */
	href?: string;
	ctaLabel?: string;
	links?: DocCardLink[];

	/* Optional shell command */
	command?: string;

	/* Misc */
	premium?: boolean;
	children?: React.ReactNode;
};

const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

function ExternalArrow() {
	return (
		<svg
			width="11"
			height="11"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			style={{ opacity: 0.5, flexShrink: 0 }}
		>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<polyline points="15 3 21 3 21 9" />
			<line x1="10" y1="14" x2="21" y2="3" />
		</svg>
	);
}

function ArrowRight() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}

export default function DocCard({
	title,
	desc,
	badge,
	iconName,
	icon,
	color = "var(--cs-orange)",
	href,
	ctaLabel,
	links,
	command,
	premium,
	children,
}: DocCardProps) {
	const resolvedIcon = icon ?? (iconName ? ICONS[iconName] : null);

	const card = (
		<div
			style={{
				padding: 20,
				borderRadius: 12,
				background: "var(--cs-surface)",
				border: `1px solid var(--cs-border)`,
				display: "flex",
				flexDirection: "column",
				gap: 12,
				height: "100%",
				boxSizing: "border-box",
				textDecoration: "none",
				color: "inherit",
				transition: href ? "border-color 0.15s, box-shadow 0.15s" : undefined,
			}}
		>
			{/* Header: icon + title + premium badge */}
			<div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
				{resolvedIcon && (
					<div
						style={{
							width: 36,
							height: 36,
							borderRadius: 9,
							background: mix(color, 14),
							border: `1px solid ${mix(color, 28)}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color,
							flexShrink: 0,
						}}
					>
						<div style={{ width: 17, height: 17, display: "flex" }}>{resolvedIcon}</div>
					</div>
				)}
				<div style={{ flex: 1, minWidth: 0 }}>
					{badge && (
						<div
							style={{
								display: "inline-flex",
								alignSelf: "flex-start",
								padding: "2px 8px",
								borderRadius: 100,
								fontFamily: "var(--cs-font-mono)",
								fontSize: 9.5,
								letterSpacing: "0.08em",
								fontWeight: 600,
								color,
								border: `1px solid ${mix(color, 30)}`,
								background: mix(color, 10),
								marginBottom: 6,
							}}
						>
							{badge}
						</div>
					)}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							flexWrap: "wrap",
						}}
					>
						<div style={{ fontSize: 15, fontWeight: 600, color: "var(--cs-ink)", lineHeight: 1.3 }}>{title}</div>
						{premium && (
							<span
								style={{
									fontFamily: "var(--cs-font-mono)",
									fontSize: 9.5,
									letterSpacing: "0.08em",
									textTransform: "uppercase",
									padding: "2px 6px",
									borderRadius: 4,
									background: mix("var(--cs-orange)", 14),
									color: "var(--cs-orange)",
									fontWeight: 600,
								}}
							>
								Premium
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			{desc && <div style={{ fontSize: 13.5, color: "var(--cs-ink-dim)", lineHeight: 1.55, flex: 1 }}>{desc}</div>}

			{/* Extra content slot */}
			{children && <div style={{ flex: 1 }}>{children}</div>}

			{/* Command block */}
			{command && (
				<div
					style={{
						padding: "9px 12px",
						borderRadius: 8,
						background: "var(--cs-bg)",
						border: "1px solid var(--cs-border)",
						fontFamily: "var(--cs-font-mono)",
						fontSize: 12,
						color: color,
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<span style={{ color: "var(--cs-ink-mute)", userSelect: "none" }}>$</span>
					<span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--cs-ink)" }}>
						{command}
					</span>
				</div>
			)}

			{/* Link list */}
			{links && links.length > 0 && (
				<div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
					{links.map((l) => (
						<a
							key={l.href}
							href={l.href}
							style={{
								fontSize: 12.5,
								fontWeight: 600,
								color,
								textDecoration: "none",
								display: "inline-flex",
								alignItems: "center",
								gap: 4,
							}}
						>
							{l.label}
							{l.external ? <ExternalArrow /> : <ArrowRight />}
						</a>
					))}
				</div>
			)}

			{/* CTA — explicit label, or auto arrow footer for href-only clickable cards */}
			{href && (ctaLabel || (!links?.length && !command)) && (
				<div
					style={{
						marginTop: "auto",
						paddingTop: 12,
						borderTop: "1px dashed var(--cs-border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<span
						style={{
							fontSize: 12.5,
							fontWeight: 600,
							color,
							display: "inline-flex",
							alignItems: "center",
							gap: 5,
						}}
					>
						{ctaLabel ?? title} <ArrowRight />
					</span>
				</div>
			)}
		</div>
	);

	if (href && !ctaLabel && !links) {
		return (
			<a href={href} style={{ textDecoration: "none", display: "block" }}>
				{card}
			</a>
		);
	}

	return card;
}
