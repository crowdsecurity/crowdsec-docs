import React, { useState } from "react";
import { mix } from "../../../utils/colorMix";

type Props = {
	eyebrow?: string;
	color: string;
	icon: React.ReactNode;
	title: string;
	desc: string;
	tag: string;
	tags?: string[];
	audience?: string;
	href: string;
};

export default function PathCard({ eyebrow, color, icon, title, desc, tag, tags = [], audience, href }: Props) {
	const [hover, setHover] = useState(false);

	return (
		<a
			href={href}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="relative p-6 rounded-[14px] overflow-hidden cursor-pointer flex flex-col no-underline min-w-0 transition-[border-color,background,box-shadow] duration-200"
			style={{
				color: "inherit",
				background: hover ? "var(--cs-surface-2)" : "var(--cs-surface)",
				border: `1px solid ${hover ? mix(color, 40) : "var(--cs-border)"}`,
				boxShadow: hover
					? `0 16px 40px rgba(0,0,0,0.40), inset 0 0 0 1px ${mix(color, 15)}`
					: "inset 0 1px 0 rgba(255,255,255,0.02)",
			}}
		>
			{/* Corner glow */}
			<div
				className="absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full blur-[60px] pointer-events-none transition-opacity duration-200"
				style={{ background: color, opacity: hover ? 0.18 : 0.09 }}
			/>

			{/* Header row: icon + eyebrow */}
			<div className="flex items-center justify-between mb-[18px]">
				<div
					style={{
						width: 40,
						height: 40,
						borderRadius: 10,
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
				{eyebrow && (
					<div className="font-cs-mono text-[11px] tracking-[0.18em] uppercase font-medium" style={{ color }}>
						{eyebrow}
					</div>
				)}
			</div>

			<h3 className="text-[18.5px] font-semibold leading-[1.25] m-0 mb-[10px] text-cs-ink tracking-[-0.01em]">{title}</h3>

			<p className="text-[13.5px] text-cs-ink-dim leading-[1.55] m-0 flex-1">{desc}</p>

			{/* Tags */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-[5px] mt-[18px]">
					{tags.map((t, i) => (
						<span
							key={t}
							style={{
								display: "inline-block",
								fontFamily: "var(--cs-font-mono)",
								fontSize: 10.5,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: i === 0 ? color : "var(--cs-ink-dim)",
								border: `1px solid ${i === 0 ? mix(color, 28) : mix("var(--cs-ink-dim)", 20)}`,
								background: i === 0 ? mix(color, 8) : mix("var(--cs-ink-dim)", 6),
								padding: "3px 8px",
								borderRadius: 4,
								fontWeight: 500,
							}}
						>
							{t}
						</span>
					))}
				</div>
			)}

			{/* Footer */}
			<div className="mt-5 pt-4 border-t border-dashed border-cs-border flex items-center justify-between">
				{audience && (
					<div className="font-cs-mono text-[10.5px] text-cs-ink-mute tracking-[0.06em] leading-[1.4] min-w-0 overflow-hidden">
						{audience}
					</div>
				)}
				<div
					className="inline-flex items-center gap-1.5 font-semibold text-[13px] ml-auto whitespace-nowrap shrink-0 transition-[gap] duration-[160ms]"
					style={{ color }}
				>
					{tag}
					<svg
						width="14"
						height="14"
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
				</div>
			</div>
		</a>
	);
}
