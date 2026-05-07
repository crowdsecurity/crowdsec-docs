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
			style={{
				border: `1px solid ${open ? mix(color, 25) : "var(--cs-border)"}`,
				borderRadius: 12,
				background: open ? `linear-gradient(180deg, ${mix(color, 8)}, var(--cs-surface) 60%)` : "var(--cs-surface)",
				transition: "all 180ms",
				overflow: "hidden",
				marginBottom: 8,
			}}
		>
			{/* Header row — always visible */}
			<div style={{ display: "flex", alignItems: "center", padding: "18px 20px", gap: 18 }}>
				{/* Color rail */}
				<div
					style={{
						width: 3,
						height: 38,
						background: color,
						borderRadius: 2,
						boxShadow: `0 0 12px ${mix(color, 40)}`,
						flexShrink: 0,
					}}
				/>

				{/* Icon */}
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
				)}

				{/* Labels */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							fontFamily: "var(--cs-font-mono)",
							fontSize: 10.5,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color,
							marginBottom: 4,
						}}
					>
						{eyebrow}
					</div>
					<div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--cs-ink)", letterSpacing: "-0.005em" }}>{title}</div>
					{open && sub && <div style={{ fontSize: 13, color: "var(--cs-ink-dim)", marginTop: 6, lineHeight: 1.5 }}>{sub}</div>}
				</div>

				{/* CTA in header when CLOSED */}
				{!open && (
					<a
						href={ctaHref}
						onClick={(e) => e.stopPropagation()}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							background: color,
							color: "var(--cs-btn-text)",
							fontWeight: 600,
							fontSize: 13,
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							textDecoration: "none",
							boxShadow: `0 4px 16px ${mix(color, 30)}`,
							flexShrink: 0,
							whiteSpace: "nowrap",
						}}
					>
						{ctaLabel} <ArrowIcon />
					</a>
				)}

				{/* Chevron toggle */}
				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					style={{
						width: 30,
						height: 30,
						borderRadius: 7,
						background: "var(--cs-surface-2)",
						border: "1px solid var(--cs-border-hi)",
						color: "var(--cs-ink-dim)",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transform: open ? "rotate(180deg)" : "none",
						transition: "transform 180ms",
						flexShrink: 0,
					}}
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
			</div>

			{/* Expanded body — horizontal steps grid + CTA */}
			{open && (
				<div
					style={{
						padding: "4px 20px 22px",
						borderTop: "1px solid var(--cs-border)",
					}}
				>
					{/* Horizontal step grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
							gap: 10,
							margin: "16px 0 20px",
						}}
					>
						{steps.map((step, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: steps have no stable id
								key={i}
								style={{
									padding: "12px 14px",
									borderRadius: 9,
									background: "var(--cs-surface-2)",
									border: `1px solid var(--cs-border)`,
									position: "relative",
								}}
							>
								{/* Step number + optional hint badge in same row */}
								<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
									<div
										style={{
											width: 24,
											height: 24,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontFamily: "var(--cs-font-mono)",
											fontSize: 10,
											fontWeight: 700,
											flexShrink: 0,
											background: mix(color, 11),
											color,
											border: `1px solid ${mix(color, 22)}`,
										}}
									>
										{String(i + 1).padStart(2, "0")}
									</div>
									{step.hint && (
										<span
											style={{
												fontFamily: "var(--cs-font-mono)",
												fontSize: 9,
												letterSpacing: "0.08em",
												textTransform: "uppercase",
												padding: "2px 5px",
												borderRadius: 3,
												fontWeight: 600,
												...HINT_STYLE[step.hint],
											}}
										>
											{step.hint}
										</span>
									)}
								</div>
								<div style={{ fontSize: 13, fontWeight: 600, color: "var(--cs-ink)", marginBottom: 4, lineHeight: 1.3 }}>
									{step.title}
								</div>
								<div style={{ fontSize: 12, color: "var(--cs-ink-dim)", lineHeight: 1.5 }}>{step.desc}</div>
							</div>
						))}
					</div>

					{/* CTA in content when OPEN */}
					<a
						href={ctaHref}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							padding: "8px 18px",
							borderRadius: 7,
							background: color,
							color: "var(--cs-btn-text)",
							fontSize: 13,
							fontWeight: 600,
							textDecoration: "none",
							boxShadow: `0 4px 16px ${mix(color, 30)}`,
							whiteSpace: "nowrap",
						}}
					>
						{ctaLabel} <ArrowIcon />
					</a>
				</div>
			)}
		</div>
	);
}
