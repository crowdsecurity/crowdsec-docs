import { CIcon } from "@coreui/icons-react";
import React from "react";
import { CUI } from "../icons/cuiMap";

export type Challenge = {
	iconName?: string;
	icon?: React.ReactNode;
	color: string;
	title: string;
	body: string;
};

type Props = {
	challenges: Challenge[];
};

export default function ChallengeGrid({ challenges }: Props) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(2, 1fr)",
				gap: 14,
				margin: "20px 0",
			}}
		>
			{challenges.map((c, i) => {
				const iconEl =
					c.icon ??
					(c.iconName && CUI[c.iconName] ? (
						<CIcon icon={CUI[c.iconName] as Parameters<typeof CIcon>[0]["icon"]} aria-hidden="true" />
					) : null);
				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: challenges have no stable id
						key={i}
						style={{
							position: "relative",
							padding: 18,
							borderRadius: 12,
							background: "var(--cs-surface)",
							border: "1px solid var(--cs-border)",
							overflow: "hidden",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
							{iconEl && (
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: 9,
										background: `${c.color}14`,
										border: `1px solid ${c.color}33`,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: c.color,
										flexShrink: 0,
									}}
								>
									<div style={{ width: 17, height: 17, display: "flex" }}>{iconEl}</div>
								</div>
							)}
							<div
								style={{
									fontFamily: "var(--cs-font-mono)",
									fontSize: 11,
									color: "var(--cs-ink-mute)",
									letterSpacing: "0.10em",
								}}
							>
								{String(i + 1).padStart(2, "0")}
							</div>
						</div>
						<div
							style={{
								fontSize: 15,
								fontWeight: 600,
								color: "var(--cs-ink)",
								marginBottom: 6,
								letterSpacing: "-0.005em",
							}}
						>
							{c.title}
						</div>
						<div style={{ fontSize: 13.5, color: "var(--cs-ink-dim)", lineHeight: 1.55 }}>{c.body}</div>
					</div>
				);
			})}
		</div>
	);
}
