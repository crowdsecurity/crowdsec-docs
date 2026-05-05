import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import { ExternalLink } from "lucide-react";
import React, { useEffect } from "react";

// ── Intent card (same pattern as index.tsx) ───────────────────────────────────

type IntentCardProps = {
	icon: React.ReactNode;
	title: string;
	desc: string;
	pill: string;
	accent: string;
	href: string;
	badge?: string;
};

const IntentCard = ({ icon, title, desc, pill, accent, href, badge }: IntentCardProps) => (
	<a
		href={href}
		className="hover:no-underline group flex"
		style={{ textDecoration: "none", color: "inherit" }}
		onMouseEnter={(e) => {
			const el = e.currentTarget as HTMLAnchorElement;
			el.style.borderColor = accent;
			el.style.boxShadow = `0 8px 24px ${accent}22, 0 0 0 1px ${accent}`;
			el.style.transform = "translateY(-2px)";
			el.style.borderRadius = "14px";
		}}
		onMouseLeave={(e) => {
			const el = e.currentTarget as HTMLAnchorElement;
			el.style.borderColor = "";
			el.style.boxShadow = "";
			el.style.transform = "";
		}}
	>
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				padding: "24px",
				background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
				border: "1px solid var(--ifm-color-emphasis-200)",
				borderRadius: "12px",
				boxShadow: "var(--ifm-global-shadow-sm)",
				transition: "border-color .2s, box-shadow .2s, transform .2s",
			}}
		>
			{badge && (
				<div
					style={{
						alignSelf: "flex-start",
						marginBottom: "12px",
						padding: "2px 8px",
						borderRadius: "100px",
						fontFamily: "var(--ifm-font-family-monospace)",
						fontSize: "9.5px",
						letterSpacing: "0.8px",
						textTransform: "uppercase" as const,
						fontWeight: 600,
						color: accent,
						border: `1px solid ${accent}44`,
						background: `${accent}11`,
					}}
				>
					{badge}
				</div>
			)}
			<div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
				<div
					style={{
						width: "48px",
						height: "48px",
						flexShrink: 0,
						borderRadius: "12px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: `${accent}1a`,
						overflow: "hidden",
					}}
				>
					{icon}
				</div>
				<div style={{ fontWeight: 700, fontSize: "15px", lineHeight: 1.25 }}>{title}</div>
			</div>
			<div style={{ fontSize: "13px", color: "var(--ifm-color-emphasis-600)", lineHeight: 1.55, marginBottom: "14px", flexGrow: 1 }}>
				{desc}
			</div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<span
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "5px",
						padding: "3px 10px",
						borderRadius: "100px",
						fontFamily: "var(--ifm-font-family-monospace)",
						fontSize: "10.5px",
						letterSpacing: "0.5px",
						fontWeight: 500,
						color: accent,
						border: `1px solid ${accent}44`,
						background: `${accent}11`,
					}}
				>
					→ {pill}
				</span>
				<span style={{ color: accent, fontSize: "16px", transition: "transform .2s" }}></span>
			</div>
		</div>
	</a>
);

// ── Differentiator card ───────────────────────────────────────────────────────

type DiffCardProps = {
	icon: string;
	title: string;
	desc: string;
};

const DiffCard = ({ icon, title, desc }: DiffCardProps) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			padding: "20px 22px",
			background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
			border: "1px solid var(--ifm-color-emphasis-200)",
			borderRadius: "12px",
		}}
	>
		<div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
		<div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px", lineHeight: 1.3 }}>{title}</div>
		<div style={{ fontSize: "12.5px", color: "var(--ifm-color-emphasis-600)", lineHeight: 1.6 }}>{desc}</div>
	</div>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const BLUE = "#60a5fa";

const intents: IntentCardProps[] = [
	{
		icon: <span style={{ fontSize: "26px", lineHeight: 1 }}>🖥️</span>,
		accent: BLUE,
		badge: "🔍 No setup needed",
		title: "Web IP Look up",
		desc: "Open the Console and search any IP instantly — reputation score, behaviors, attack history, and CVE links.",
		pill: "Console - Web UI",
		href: "/u/console/ip_reputation/intro",
	},
	{
		icon: <span style={{ fontSize: "26px", lineHeight: 1 }}>🔌</span>,
		accent: "#a78bfa",
		badge: "⚙️ Developer / SECOPS",
		title: "Enrich your SIEM/SOAR/TIP/+",
		desc: "Automate lookups in your scripts, pipelines, or custom tooling. No credit card needed.",
		pill: "CTI API",
		href: "/u/cti_api/intro",
	},
	{
		icon: <span style={{ fontSize: "26px", lineHeight: 1 }}>🚨</span>,
		accent: "#34d399",
		badge: "🎯 Threat Hunters",
		title: "Track live CVE exploitation",
		desc: "See which IPs are actively exploiting known vulnerabilities — cross-reference CVEs with real-time attacker activity.",
		pill: "Live Exploit Tracker",
		href: "/u/console/ip_reputation/intro#live-exploit-tracker",
	},
];

const differentiators: DiffCardProps[] = [
	{
		icon: "🌍",
		title: "Community-sourced threat data",
		desc: "Every CrowdSec instance contributes signals. The more sensors in the network, the more accurate the data — no honeypots, real-world detections only.",
	},
	{
		icon: "🔬",
		title: "Behavioral fingerprinting",
		desc: "Beyond a simple bad/good reputation. Each IP is tagged with the exact attack behaviors it was observed performing — brute force, scanning, exploit attempts, and more.",
	},
	{
		icon: "🛡️",
		title: "CVE & live exploit tracking",
		desc: "See which IPs are actively exploiting known vulnerabilities. Cross-reference CVEs with real-time attacker activity from the global sensor network.",
	},
	{
		icon: "🆓",
		title: "Generous free tier",
		desc: "Up to 15 lookups per day at no cost, no credit card. Paid tiers unlock bulk queries, higher rate limits, and advanced filters.",
	},
	{
		icon: "🏷️",
		title: "Structured taxonomy",
		desc: "Consistent labels across behaviors, classifications, and reputation scores — making it easy to integrate into automated workflows without custom parsing.",
	},
	{
		icon: "⚡",
		title: "Real-time data",
		desc: "The CTI database is updated continuously as new attack signals flow in from the global sensor network. No stale data.",
	},
];

// ── Page body (no Layout — safe to embed in MDX) ─────────────────────────────

export const CTIContent = () => (
	<main className="flex-1">
		{/* Hero */}
		<section className="py-10 md:py-16 px-4 text-center" style={{ position: "relative", overflow: "hidden" }}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					pointerEvents: "none",
					background: `radial-gradient(ellipse 55% 40% at 50% 0%, ${BLUE}12 0%, transparent 70%)`,
				}}
			/>
			<div style={{ position: "relative", zIndex: 1 }}>
				<h1
					className="text-3xl md:text-5xl font-bold mb-3"
					style={{ letterSpacing: "-1px", lineHeight: 1.1, whiteSpace: "nowrap" }}
				>
					IP Reputation & Threat Intelligence
				</h1>
				<p
					className="text-base md:text-lg mb-6"
					style={{ color: "var(--ifm-color-emphasis-600)", maxWidth: "520px", margin: "0 auto 24px" }}
				>
					IP reputation and threat data from a global sensor network. Look up IPs, enrich investigations, and automate security
					workflows.
				</p>

				{/* Quick access bar */}
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
					<span
						style={{
							fontFamily: "var(--ifm-font-family-monospace)",
							fontSize: "9.5px",
							letterSpacing: "1.2px",
							textTransform: "uppercase" as const,
							color: "var(--ifm-color-emphasis-600)",
						}}
					>
						Quick access
					</span>
					<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
						{[
							{
								label: "Look up an IP",
								href: "https://app.crowdsec.net/cti",
								external: true,
								primary: true,
							},
							{ label: "Get Started", href: "/u/cti_api/intro", external: false, primary: false },
							{ label: "API Quickstart", href: "/u/console/ip_reputation/api_keys", external: false, primary: false },
						].map(({ label, href, external, primary }) => (
							<Link
								key={label}
								href={href}
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "6px",
									padding: "8px 18px",
									borderRadius: "8px",
									fontSize: "13px",
									fontWeight: primary ? 600 : 500,
									textDecoration: "none",
									background: primary ? BLUE : "rgb(var(--card)/var(--tw-bg-opacity,1))",
									color: primary ? "#000" : "var(--ifm-color-emphasis-700)",
									border: primary ? "none" : "1px solid var(--ifm-color-emphasis-200)",
									transition: "opacity .15s",
								}}
							>
								{label}
								{external && <ExternalLink size={12} style={{ opacity: 0.7, flexShrink: 0 }} />}
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>

		{/* How do you want to use it? */}
		<section className="py-6 px-4">
			<div className="container mx-auto" style={{ maxWidth: "940px" }}>
				<div
					style={{
						fontFamily: "var(--ifm-font-family-monospace)",
						fontSize: "10.5px",
						letterSpacing: "1.5px",
						textTransform: "uppercase" as const,
						color: "var(--ifm-color-emphasis-600)",
						marginBottom: "12px",
					}}
				>
					How do you want to use it?
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
					{intents.map((intent) => (
						<IntentCard key={intent.pill} {...intent} />
					))}
				</div>
			</div>
		</section>

		{/* What makes CrowdSec CTI different */}
		<section className="py-8 px-4">
			<div className="container mx-auto" style={{ maxWidth: "940px" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						color: "var(--ifm-color-emphasis-600)",
						fontSize: "11px",
						fontFamily: "var(--ifm-font-family-monospace)",
						letterSpacing: "1px",
						textTransform: "uppercase" as const,
						marginBottom: "20px",
					}}
				>
					<div style={{ flex: 1, height: "1px", background: "var(--ifm-color-emphasis-200)" }} />
					What makes CrowdSec CTI different
					<div style={{ flex: 1, height: "1px", background: "var(--ifm-color-emphasis-200)" }} />
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
					{differentiators.map((d) => (
						<DiffCard key={d.title} {...d} />
					))}
				</div>
			</div>
		</section>
	</main>
);

// ── Standalone page (with Layout + homepage class) ────────────────────────────

const CTIPage = () => {
	useEffect(() => {
		document.body.classList.add("homepage");
		document.documentElement.classList.add("homepage");
		return () => {
			document.body.classList.remove("homepage");
			document.documentElement.classList.remove("homepage");
		};
	}, []);

	return (
		<Layout title="CrowdSec CTI" description="Query CrowdSec's threat intelligence database">
			<CTIContent />
		</Layout>
	);
};

export default CTIPage;
