import React from "react";

export type QuickStripLink = {
	label: string;
	href: string;
	icon?: React.ReactNode;
	external?: boolean;
	color?: string;
};

export type QuickStripProps = {
	/** Simple monospace eyebrow label on the left (e.g. "Quick access") */
	label?: string;
	/** Bold title — for the "Need help?" / rich-left variant */
	title?: string;
	/** Subtitle below the title */
	subtitle?: string;
	links: QuickStripLink[];
};

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

export default function QuickStrip({ label, title, subtitle, links }: QuickStripProps) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 18,
				flexWrap: "wrap",
				padding: "14px 18px",
				background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
				border: "1px solid var(--cs-border)",
				borderRadius: 12,
				margin: "16px 0",
			}}
		>
			{/* Left: simple label OR rich title+subtitle */}
			{(label || title) && (
				<div style={{ flexShrink: 0 }}>
					{label && (
						<div
							style={{
								fontFamily: "var(--cs-font-mono)",
								fontSize: 11,
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: "var(--cs-ink-mute)",
								fontWeight: 500,
							}}
						>
							{label}
						</div>
					)}
					{title && (
						<div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--cs-ink)", marginBottom: subtitle ? 2 : 0 }}>
							{title}
						</div>
					)}
					{subtitle && <div style={{ fontSize: 12, color: "var(--cs-ink-dim)" }}>{subtitle}</div>}
				</div>
			)}

			<div style={{ flex: 1 }} />

			{/* Right: pill links */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
				{links.map((l) => (
					<a
						key={l.href}
						href={l.href}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 7,
							padding: "6px 12px",
							borderRadius: 8,
							border: "1px solid var(--cs-border-hi)",
							background: "var(--cs-surface)",
							color: "var(--cs-ink)",
							fontSize: 13,
							fontWeight: 500,
							textDecoration: "none",
							transition: "border-color 0.12s, color 0.12s, background 0.12s",
						}}
						onMouseEnter={(e) => {
							const el = e.currentTarget as HTMLAnchorElement;
							el.style.borderColor = l.color ?? "var(--cs-border-hi)";
							if (l.color) el.style.color = l.color;
							el.style.background = "var(--cs-surface-2)";
						}}
						onMouseLeave={(e) => {
							const el = e.currentTarget as HTMLAnchorElement;
							el.style.borderColor = "";
							el.style.color = "var(--cs-ink)";
							el.style.background = "";
						}}
					>
						{l.icon && <span style={{ color: l.color || "var(--cs-orange)", display: "flex", flexShrink: 0 }}>{l.icon}</span>}
						{l.label}
						{l.external && <ExternalArrow />}
					</a>
				))}
			</div>
		</div>
	);
}
