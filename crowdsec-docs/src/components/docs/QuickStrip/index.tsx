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
			className="opacity-50 shrink-0"
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
			className="flex items-center gap-[18px] flex-wrap py-[14px] px-[18px] border border-cs-border rounded-xl my-4"
			style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))" }}
		>
			{/* Left: simple label OR rich title+subtitle */}
			{(label || title) && (
				<div className="shrink-0">
					{label && (
						<div className="font-cs-mono text-[11px] tracking-[0.18em] uppercase text-cs-ink-mute font-medium">{label}</div>
					)}
					{title && <div className={`font-bold text-[13.5px] text-cs-ink${subtitle ? " mb-0.5" : ""}`}>{title}</div>}
					{subtitle && <div className="text-xs text-cs-ink-dim">{subtitle}</div>}
				</div>
			)}

			<div className="flex-1" />

			{/* Right: pill links */}
			<div className="flex flex-wrap gap-2">
				{links.map((l) => (
					<a
						key={l.href}
						href={l.href}
						className="inline-flex items-center gap-[7px] py-[6px] px-3 rounded-lg border border-cs-border-hi bg-cs-surface text-cs-ink text-[13px] font-medium no-underline transition-[border-color,color,background] duration-[120ms]"
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
						{l.icon && (
							<span className="flex shrink-0" style={{ color: l.color || "var(--cs-orange)" }}>
								{l.icon}
							</span>
						)}
						{l.label}
						{l.external && <ExternalArrow />}
					</a>
				))}
			</div>
		</div>
	);
}
