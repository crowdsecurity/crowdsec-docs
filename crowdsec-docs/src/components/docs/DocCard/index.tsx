import { cilArrowRight } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import React from "react";
import { mix } from "../../../utils/colorMix";
import { CUI } from "../icons/cuiMap";

function renderIcon(name: string) {
	const icon = CUI[name];
	if (!icon) return null;
	return <CIcon icon={icon as Parameters<typeof CIcon>[0]["icon"]} aria-hidden="true" />;
}

export type DocCardLink = {
	label: string;
	href: string;
	external?: boolean;
};

export type DocCardProps = {
	title: string;
	desc?: string;
	badge?: string;
	iconName?: string;
	icon?: React.ReactNode;
	color?: string;
	href?: string;
	ctaLabel?: string;
	links?: DocCardLink[];
	command?: string;
	premium?: boolean;
	children?: React.ReactNode;
};

function ExternalArrow() {
	return (
		<CIcon
			icon={cilArrowRight}
			style={{ width: 11, height: 11, opacity: 0.5, flexShrink: 0, transform: "rotate(-45deg)" }}
			aria-hidden="true"
		/>
	);
}

function ArrowRight() {
	return <CIcon icon={cilArrowRight} style={{ width: 12, height: 12 }} aria-hidden="true" />;
}

export default function DocCard({
	title,
	desc,
	badge,
	iconName,
	icon,
	color = "var(--cs-orange)",
	href,
	ctaLabel,
	links,
	command,
	premium,
	children,
}: DocCardProps) {
	const resolvedIcon = icon ?? (iconName ? renderIcon(iconName) : null);

	const card = (
		<div
			className={`p-5 rounded-xl bg-cs-surface border border-cs-border flex flex-col gap-3 h-full${href ? " transition-[border-color,box-shadow] duration-150" : ""}`}
		>
			{/* Header: icon + title + premium badge */}
			<div className="flex items-start gap-3">
				{resolvedIcon && (
					<div
						className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
						style={{
							background: mix(color, 14),
							border: `1px solid ${mix(color, 28)}`,
							color,
						}}
					>
						<div className="w-[17px] h-[17px] flex">{resolvedIcon}</div>
					</div>
				)}
				<div className="flex-1 min-w-0">
					{badge && (
						<div
							className="inline-flex self-start px-2 py-[2px] rounded-full font-cs-mono text-[9.5px] tracking-[0.08em] font-semibold mb-1.5"
							style={{
								color,
								border: `1px solid ${mix(color, 30)}`,
								background: mix(color, 10),
							}}
						>
							{badge}
						</div>
					)}
					<div className="flex items-center gap-2 flex-wrap">
						<div className="text-[15px] font-semibold text-cs-ink leading-[1.3]">{title}</div>
						{premium && (
							<span className="font-cs-mono text-[9.5px] tracking-[0.08em] uppercase px-[6px] py-[2px] rounded bg-[color-mix(in_srgb,var(--cs-orange)_14%,transparent)] text-cs-orange font-semibold">
								Premium
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			{desc && <div className="text-[13.5px] text-cs-ink-dim leading-[1.55] flex-1">{desc}</div>}

			{/* Extra content slot */}
			{children && <div className="flex-1">{children}</div>}

			{/* Command block */}
			{command && (
				<div className="py-[9px] px-3 rounded-lg bg-cs-bg border border-cs-border font-cs-mono text-xs flex items-center gap-[10px]">
					<span className="text-cs-ink-mute select-none">$</span>
					<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-cs-ink">{command}</span>
				</div>
			)}

			{/* Link list */}
			{links && links.length > 0 && (
				<div className="flex flex-col gap-[5px] mt-1">
					{links.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="text-[12.5px] font-semibold no-underline inline-flex items-center gap-1"
							style={{ color }}
						>
							{l.label}
							{l.external ? <ExternalArrow /> : <ArrowRight />}
						</a>
					))}
				</div>
			)}

			{/* CTA — explicit label, or auto arrow footer for href-only clickable cards */}
			{href && (ctaLabel || (!links?.length && !command)) && (
				<div className="mt-auto pt-3 border-t border-dashed border-cs-border flex items-center justify-between">
					<span className="text-[12.5px] font-semibold inline-flex items-center gap-[5px]" style={{ color }}>
						{ctaLabel ?? title} <ArrowRight />
					</span>
				</div>
			)}
		</div>
	);

	if (href && !ctaLabel && !links) {
		return (
			<a href={href} className="no-underline block">
				{card}
			</a>
		);
	}

	return card;
}
