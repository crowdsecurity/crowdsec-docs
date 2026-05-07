import React from "react";

type Props = {
	icon?: React.ReactNode;
	title: string;
	command?: string;
	ctaLabel: string;
	ctaHref: string;
};

function DefaultIcon() {
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
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<polyline points="8 21 12 17 16 21" />
		</svg>
	);
}

export default function AccessCard({ icon, title, command, ctaLabel, ctaHref }: Props) {
	return (
		<div className="flex flex-col gap-3 py-5 px-[22px] bg-cs-surface border border-cs-border-hi rounded-xl my-4">
			<div className="flex items-center gap-3">
				<div className="w-[38px] h-[38px] rounded-[9px] bg-cs-orange-soft border border-[color-mix(in_srgb,var(--cs-orange)_25%,transparent)] flex items-center justify-center text-cs-orange shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
					{icon ?? <DefaultIcon />}
				</div>
				<div className="text-[14.5px] font-semibold text-cs-ink">{title}</div>
			</div>
			{command && (
				<div className="flex items-center gap-2 py-[9px] px-[14px] bg-cs-bg border border-cs-border rounded-[7px] font-cs-mono text-[12.5px] text-cs-teal">
					<span style={{ color: "var(--cs-ink-mute)" }}>$</span>
					<span>{command}</span>
				</div>
			)}
			<a
				href={ctaHref}
				className="inline-flex items-center gap-1.5 py-2 px-[18px] rounded-[7px] bg-cs-orange text-[#0a1120] text-[13px] font-semibold no-underline transition-opacity duration-150 self-start hover:opacity-[0.85] hover:no-underline hover:text-[#0a1120]"
			>
				{ctaLabel} →
			</a>
		</div>
	);
}
