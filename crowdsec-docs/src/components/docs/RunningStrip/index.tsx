import { cilArrowRight } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import React from "react";

type Link = { icon?: React.ReactNode; label: string; href: string; color?: string; external?: boolean };

type Props = {
	label?: string;
	links: Link[];
};

export default function RunningStrip({ label = "Already running CrowdSec?", links }: Props) {
	return (
		<div
			className="flex items-center gap-[18px] flex-wrap py-[14px] px-[18px] border border-cs-border rounded-xl mt-7"
			style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))" }}
		>
			<div className="font-cs-mono text-[11px] tracking-[0.18em] uppercase text-cs-ink-mute font-medium whitespace-nowrap">
				{label}
			</div>

			<div className="flex-1" />

			<div className="flex flex-wrap gap-2">
				{links.map((l) => (
					<a
						key={l.href}
						href={l.href}
						className="inline-flex items-center gap-2 py-[7px] px-3 rounded-lg border border-cs-border-hi bg-cs-surface text-cs-ink text-[13px] font-medium no-underline transition-[border-color,background] duration-150"
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.borderColor = l.color || "var(--cs-orange)";
							(e.currentTarget as HTMLAnchorElement).style.background = "var(--cs-surface-2)";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.borderColor = "";
							(e.currentTarget as HTMLAnchorElement).style.background = "";
						}}
					>
						{l.icon && (
							<span className="flex shrink-0" style={{ color: l.color || "var(--cs-orange)" }}>
								{l.icon}
							</span>
						)}
						{l.label}
						{l.external && (
							<CIcon
								icon={cilArrowRight}
								style={{ width: 11, height: 11, opacity: 0.5, flexShrink: 0, transform: "rotate(-45deg)" }}
								aria-hidden="true"
							/>
						)}
					</a>
				))}
			</div>
		</div>
	);
}
