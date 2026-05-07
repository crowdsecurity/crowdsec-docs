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
			style={{
				padding: 20,
				borderRadius: 12,
				background: "var(--cs-surface)",
				border: "1px solid var(--cs-border)",
				display: "flex",
				flexDirection: "column",
				gap: 12,
				height: "100%",
				boxSizing: "border-box",
				textDecoration: "none",
				color: "inherit",
				transition: href ? "border-color 0.15s, box-shadow 0.15s" : undefined,
			}}
		>
			{/* Header: icon + title + premium badge */}
			<div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
				{resolvedIcon && (
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
						<div style={{ width: 17, height: 17, display: "flex" }}>{resolvedIcon}</div>
					</div>
				)}
				<div style={{ flex: 1, minWidth: 0 }}>
					{badge && (
						<div
							style={{
								display: "inline-flex",
								alignSelf: "flex-start",
								padding: "2px 8px",
								borderRadius: 100,
								fontFamily: "var(--cs-font-mono)",
								fontSize: 9.5,
								letterSpacing: "0.08em",
								fontWeight: 600,
								color,
								border: `1px solid ${mix(color, 30)}`,
								background: mix(color, 10),
								marginBottom: 6,
							}}
						>
							{badge}
						</div>
					)}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							flexWrap: "wrap",
						}}
					>
						<div style={{ fontSize: 15, fontWeight: 600, color: "var(--cs-ink)", lineHeight: 1.3 }}>{title}</div>
						{premium && (
							<span
								style={{
									fontFamily: "var(--cs-font-mono)",
									fontSize: 9.5,
									letterSpacing: "0.08em",
									textTransform: "uppercase",
									padding: "2px 6px",
									borderRadius: 4,
									background: mix("var(--cs-orange)", 14),
									color: "var(--cs-orange)",
									fontWeight: 600,
								}}
							>
								Premium
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			{desc && <div style={{ fontSize: 13.5, color: "var(--cs-ink-dim)", lineHeight: 1.55, flex: 1 }}>{desc}</div>}

			{/* Extra content slot */}
			{children && <div style={{ flex: 1 }}>{children}</div>}

			{/* Command block */}
			{command && (
				<div
					style={{
						padding: "9px 12px",
						borderRadius: 8,
						background: "var(--cs-bg)",
						border: "1px solid var(--cs-border)",
						fontFamily: "var(--cs-font-mono)",
						fontSize: 12,
						color,
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<span style={{ color: "var(--cs-ink-mute)", userSelect: "none" }}>$</span>
					<span
						style={{
							flex: 1,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							color: "var(--cs-ink)",
						}}
					>
						{command}
					</span>
				</div>
			)}

			{/* Link list */}
			{links && links.length > 0 && (
				<div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
					{links.map((l) => (
						<a
							key={l.href}
							href={l.href}
							style={{
								fontSize: 12.5,
								fontWeight: 600,
								color,
								textDecoration: "none",
								display: "inline-flex",
								alignItems: "center",
								gap: 4,
							}}
						>
							{l.label}
							{l.external ? <ExternalArrow /> : <ArrowRight />}
						</a>
					))}
				</div>
			)}

			{/* CTA — explicit label, or auto arrow footer for href-only clickable cards */}
			{href && (ctaLabel || (!links?.length && !command)) && (
				<div
					style={{
						marginTop: "auto",
						paddingTop: 12,
						borderTop: "1px dashed var(--cs-border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<span
						style={{
							fontSize: 12.5,
							fontWeight: 600,
							color,
							display: "inline-flex",
							alignItems: "center",
							gap: 5,
						}}
					>
						{ctaLabel ?? title} <ArrowRight />
					</span>
				</div>
			)}
		</div>
	);

	if (href && !ctaLabel && !links) {
		return (
			<a href={href} style={{ textDecoration: "none", display: "block" }}>
				{card}
			</a>
		);
	}

	return card;
}
