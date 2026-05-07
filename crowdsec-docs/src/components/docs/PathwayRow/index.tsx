import React, { useState } from "react";
import { mix } from "../../../utils/colorMix";

export type Step = {
	title: string;
	desc: string;
	hint?: "RECOMMENDED" | "OPTIONAL";
};

type Props = {
	color: string;
	title: string;
	eyebrow: string;
	sub?: string;
	steps: Step[];
	ctaLabel: string;
	ctaHref: string;
	defaultOpen?: boolean;
	icon?: React.ReactNode;
};

function ArrowIcon() {
	return (
		<svg
			width="13"
			height="13"
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

const HINT_STYLE: Record<string, React.CSSProperties> = {
	RECOMMENDED: {
		background: "color-mix(in srgb, var(--cs-teal) 15%, transparent)",
		color: "var(--cs-teal)",
		border: "1px solid color-mix(in srgb, var(--cs-teal) 30%, transparent)",
	},
	OPTIONAL: {
		background: "color-mix(in srgb, var(--cs-ink-mute) 12%, transparent)",
		color: "var(--cs-ink-mute)",
		border: "1px solid color-mix(in srgb, var(--cs-ink-mute) 20%, transparent)",
	},
};

export default function PathwayRow({ color, title, eyebrow, sub, steps, ctaLabel, ctaHref, defaultOpen = false, icon }: Props) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className="rounded-xl overflow-hidden mb-2 transition-all duration-[180ms]"
			style={{
				border: `1px solid ${open ? mix(color, 25) : "var(--cs-border)"}`,
				background: open ? `linear-gradient(180deg, ${mix(color, 8)}, var(--cs-surface) 60%)` : "var(--cs-surface)",
			}}
		>
			{" "}
			<div className="flex items-center py-[18px] px-5 gap-[18px]">
				{" "}
				<div
					className="w-[3px] h-[38px] rounded-sm shrink-0"
					style={{ background: color, boxShadow: `0 0 12px ${mix(color, 40)}` }}
				/>{" "}
				{icon && (
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
						{icon}
					</div>
				)}{" "}
				<div className="flex-1 min-w-0">
					<div className="font-cs-mono text-[10.5px] tracking-[0.12em] uppercase mb-1" style={{ color }}>
						{eyebrow}
					</div>
					<div className="text-[15.5px] font-semibold text-cs-ink tracking-[-0.005em]">{title}</div>
					{open && sub && <div className="text-[13px] text-cs-ink-dim mt-1.5 leading-[1.5]">{sub}</div>}
				</div>
				{/* CTA in header when CLOSED */}
				{!open && (
					<a
						href={ctaHref}
						onClick={(e) => e.stopPropagation()}
						className="py-2 px-[14px] rounded-lg font-semibold text-[13px] inline-flex items-center gap-1.5 no-underline shrink-0 whitespace-nowrap"
						style={{
							background: color,
							color: "var(--cs-btn-text)",
							boxShadow: `0 4px 16px ${mix(color, 30)}`,
						}}
					>
						{ctaLabel} <ArrowIcon />
					</a>
				)}{" "}
				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					className="w-[30px] h-[30px] rounded-[7px] bg-cs-surface-2 border border-cs-border-hi text-cs-ink-dim cursor-pointer flex items-center justify-center shrink-0 transition-transform duration-[180ms]"
					style={{ transform: open ? "rotate(180deg)" : "none" }}
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.6}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</button>
			</div>{" "}
			{open && (
				<div className="px-5 pb-[22px] pt-1 border-t border-cs-border">
					{" "}
					<div className="grid gap-[10px] my-4 mb-5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
						{steps.map((step, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: steps have no stable id
								key={i}
								className="p-[12px_14px] rounded-[9px] bg-cs-surface-2 border border-cs-border relative"
							>
								{" "}
								<div className="flex items-center gap-[6px] mb-2">
									<div
										className="w-6 h-6 rounded-full flex items-center justify-center font-cs-mono text-[10px] font-bold shrink-0"
										style={{
											background: mix(color, 11),
											color,
											border: `1px solid ${mix(color, 22)}`,
										}}
									>
										{String(i + 1).padStart(2, "0")}
									</div>
									{step.hint && (
										<span
											className="font-cs-mono text-[9px] tracking-[0.08em] uppercase p-[2px_5px] rounded-[3px] font-semibold"
											style={HINT_STYLE[step.hint]}
										>
											{step.hint}
										</span>
									)}
								</div>
								<div className="text-[13px] font-semibold text-cs-ink mb-1 leading-[1.3]">{step.title}</div>
								<div className="text-xs text-cs-ink-dim leading-[1.5]">{step.desc}</div>
							</div>
						))}
					</div>
					{/* CTA in content when OPEN */}
					<a
						href={ctaHref}
						className="inline-flex items-center gap-1.5 py-2 px-[18px] rounded-[7px] text-[13px] font-semibold no-underline whitespace-nowrap"
						style={{
							background: color,
							color: "var(--cs-btn-text)",
							boxShadow: `0 4px 16px ${mix(color, 30)}`,
						}}
					>
						{ctaLabel} <ArrowIcon />
					</a>
				</div>
			)}
		</div>
	);
}
