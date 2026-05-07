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
			style={{
				display: "flex",
				alignItems: "center",
				gap: 18,
				flexWrap: "wrap",
				padding: "14px 18px",
				background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
				border: "1px solid var(--cs-border)",
				borderRadius: 12,
				margin: "28px 0 0",
			}}
		>
			<div
				style={{
					fontFamily: "var(--cs-font-mono)",
					fontSize: 11,
					letterSpacing: "0.18em",
					textTransform: "uppercase",
					color: "var(--cs-ink-mute)",
					fontWeight: 500,
					whiteSpace: "nowrap",
				}}
			>
				{label}
			</div>

			<div style={{ flex: 1 }} />

			<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
				{links.map((l) => (
					<a
						key={l.href}
						href={l.href}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							padding: "7px 12px",
							borderRadius: 8,
							border: "1px solid var(--cs-border-hi)",
							background: "var(--cs-surface)",
							color: "var(--cs-ink)",
							fontSize: 13,
							fontWeight: 500,
							textDecoration: "none",
							transition: "border-color 0.15s, background 0.15s",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.borderColor = l.color || "var(--cs-orange)";
							(e.currentTarget as HTMLAnchorElement).style.background = "var(--cs-surface-2)";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.borderColor = "";
							(e.currentTarget as HTMLAnchorElement).style.background = "";
						}}
					>
						{l.icon && <span style={{ color: l.color || "var(--cs-orange)", display: "flex", flexShrink: 0 }}>{l.icon}</span>}
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
