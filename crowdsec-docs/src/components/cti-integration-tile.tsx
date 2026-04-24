import useBaseUrl from "@docusaurus/useBaseUrl";
// biome-ignore lint/correctness/noUnusedImports: React is needed for JSX
import React, { useRef, useState } from "react";
import { type CtiIntegrationData, ctiIntegrations } from "./data/cti-integrations";

export { ctiIntegrations };

export default function CtiIntegrationTile({ name, slug, href, plugin, desc, color }: CtiIntegrationData) {
	const logoSrc = useBaseUrl(`/img/cti-integrations/logo-${slug}.png`);
	const fallbackSrc = useBaseUrl("/img/cti-integrations/logo-default.png");
	const [tooltip, setTooltip] = useState(false);
	const tooltipRef = useRef<HTMLDivElement>(null);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				borderRadius: "8px",
				overflow: "visible",
				border: "1px solid var(--ifm-color-emphasis-200)",
				transition: "box-shadow 0.15s, border-color 0.15s",
				position: "relative",
			}}
		>
			{/* left gradient strip */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					width: "4px",
					borderRadius: "8px 0 0 8px",
					background: `linear-gradient(to bottom, ${color}, transparent)`,
					pointerEvents: "none",
				}}
			/>
			<a
				href={href}
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "0.85rem",
					padding: "0.75rem 1rem 0.75rem 1.25rem",
					textDecoration: "none",
					color: "inherit",
					flex: 1,
					minWidth: 0,
				}}
				onMouseEnter={(e) => {
					const wrapper = (e.currentTarget as HTMLAnchorElement).parentElement as HTMLDivElement;
					wrapper.style.boxShadow = `0 4px 12px ${color}30`;
					wrapper.style.borderColor = `${color}70`;
					setTooltip(true);
				}}
				onMouseLeave={(e) => {
					const wrapper = (e.currentTarget as HTMLAnchorElement).parentElement as HTMLDivElement;
					wrapper.style.boxShadow = "none";
					wrapper.style.borderColor = "var(--ifm-color-emphasis-200)";
					setTooltip(false);
				}}
			>
				<div
					style={{
						width: "40px",
						height: "40px",
						flexShrink: 0,
						borderRadius: "6px",
						background: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img
						src={logoSrc}
						alt={`${name} logo`}
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).onerror = null;
							(e.currentTarget as HTMLImageElement).src = fallbackSrc;
						}}
						style={{ width: "28px", height: "28px", objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
					/>
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: 0 }}>
					<span
						style={{
							fontWeight: 600,
							fontSize: "0.875rem",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{name}
					</span>
					<span
						style={{
							fontSize: "0.7rem",
							color: "var(--ifm-color-emphasis-500)",
							lineHeight: 1.3,
							fontFamily: "var(--ifm-font-family-monospace)",
						}}
					>
						{plugin}
					</span>
				</div>
			</a>

			{/* Hover tooltip */}
			{tooltip && (
				<div
					ref={tooltipRef}
					style={{
						position: "absolute",
						bottom: "calc(100% + 8px)",
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 50,
						background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
						border: "1px solid var(--ifm-color-emphasis-200)",
						borderRadius: "8px",
						padding: "10px 13px",
						fontSize: "12px",
						lineHeight: 1.55,
						color: "var(--ifm-color-emphasis-700)",
						boxShadow: `0 6px 20px ${color}22, 0 2px 8px rgba(0,0,0,0.12)`,
						width: "220px",
						pointerEvents: "none",
					}}
				>
					<div style={{ fontWeight: 600, fontSize: "12px", marginBottom: "4px", color: "var(--ifm-color-emphasis-900)" }}>
						{name}
					</div>
					{desc}
					{/* Arrow */}
					<div
						style={{
							position: "absolute",
							top: "100%",
							left: "50%",
							transform: "translateX(-50%)",
							width: 0,
							height: 0,
							borderLeft: "6px solid transparent",
							borderRight: "6px solid transparent",
							borderTop: "6px solid var(--ifm-color-emphasis-200)",
						}}
					/>
				</div>
			)}
		</div>
	);
}
