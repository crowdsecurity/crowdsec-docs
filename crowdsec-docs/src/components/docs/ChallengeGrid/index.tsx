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
		<div className="grid grid-cols-2 gap-[14px] my-5">
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
						className="relative p-[18px] rounded-xl bg-cs-surface border border-cs-border overflow-hidden"
					>
						<div className="flex items-center gap-3 mb-[10px]">
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
							<div className="font-cs-mono text-[11px] text-cs-ink-mute tracking-[0.10em]">
								{String(i + 1).padStart(2, "0")}
							</div>
						</div>
						<div className="text-[15px] font-semibold text-cs-ink mb-[6px] tracking-[-0.005em]">{c.title}</div>
						<div className="text-[13.5px] text-cs-ink-dim leading-[1.55]">{c.body}</div>
					</div>
				);
			})}
		</div>
	);
}
