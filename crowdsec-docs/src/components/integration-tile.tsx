import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

interface IntegrationTileProps {
	name: string;
	slug: string;
	href: string;
	desc?: string;
	color: string;
	children?: React.ReactNode;
}

export const firewallIntegrations = [
	{
		name: "Checkpoint",
		slug: "checkpoint",
		href: "/u/integrations/checkpoint",
		desc: "Custom Intelligence (IoC) Feeds",
		color: "#cc0000",
	},
	{ name: "Cisco", slug: "cisco", href: "/u/integrations/cisco", desc: "Security Intelligence feeds", color: "#1ba0d8" },
	{ name: "F5", slug: "f5", href: "/u/integrations/f5", desc: "External IP blocklist / Feed lists", color: "#e4002b" },
	{ name: "Fortinet", slug: "fortinet", href: "/u/integrations/fortinet", desc: "IP address Threat Feeds", color: "#ee3124" },
	{ name: "Juniper", slug: "juniper", href: "/u/integrations/juniper", desc: "Security Dynamic Address feeds", color: "#84b135" },
	{ name: "Mikrotik", slug: "mikrotik", href: "/u/integrations/mikrotik", desc: "IP blocklist ingestion", color: "#9f1d20" },
	{ name: "OPNsense", slug: "opnsense", href: "/u/integrations/opnsense", desc: "URL Table (IPs) aliases", color: "#d94f00" },
	{ name: "Palo Alto", slug: "paloalto", href: "/u/integrations/paloalto", desc: "External Dynamic Lists (EDL)", color: "#fa582d" },
	{ name: "pfSense", slug: "pfsense", href: "/u/integrations/pfsense", desc: "URL Table (IPs) aliases", color: "#212d6e" },
	{ name: "Sophos", slug: "sophos", href: "/u/integrations/sophos", desc: "Third-Party Threat Feeds", color: "#1f6bff" },
];

export default function IntegrationTile({ name, slug, href, desc, color, children }: IntegrationTileProps) {
	const logoSrc = useBaseUrl(`/img/blaas/logo-${slug}.png`);
	const fallbackSrc = useBaseUrl("/img/blaas/logo-default.png");

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				borderRadius: "8px",
				overflow: "hidden",
				border: "1px solid var(--ifm-color-emphasis-200)",
				transition: "box-shadow 0.15s, border-color 0.15s",
			}}
		>
			<div
				style={{
					width: "4px",
					flexShrink: 0,
					background: `linear-gradient(to bottom, ${color}, transparent)`,
				}}
			/>
			<a
				href={href}
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "0.85rem",
					padding: "0.75rem 1rem",
					textDecoration: "none",
					color: "inherit",
					flex: 1,
					minWidth: 0,
				}}
				onMouseEnter={(e) => {
					const wrapper = (e.currentTarget as HTMLAnchorElement).parentElement as HTMLDivElement;
					wrapper.style.boxShadow = `0 4px 12px ${color}30`;
					wrapper.style.borderColor = `${color}70`;
				}}
				onMouseLeave={(e) => {
					const wrapper = (e.currentTarget as HTMLAnchorElement).parentElement as HTMLDivElement;
					wrapper.style.boxShadow = "none";
					wrapper.style.borderColor = "var(--ifm-color-emphasis-200)";
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
						style={{ width: "32px", height: "32px", objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
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
					<span style={{ fontSize: "0.72rem", color: "var(--ifm-color-emphasis-600)", lineHeight: 1.35 }}>
						{children || desc}
					</span>
				</div>
			</a>
		</div>
	);
}
