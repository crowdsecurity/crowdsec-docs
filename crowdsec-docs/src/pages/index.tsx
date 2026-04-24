import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import SearchBar from "@theme/SearchBar";
import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

// ── Intent card ──────────────────────────────────────────────────────────────

type IntentCardProps = {
	icon: React.ReactNode;
	title: string;
	desc: string;
	pill: string;
	accent: string;
	href: string;
};

const IntentCard = ({ icon, title, desc, pill, accent, href }: IntentCardProps) => (
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
				<span style={{ color: accent, fontSize: "16px", transition: "transform .2s" }}>→</span>
			</div>
		</div>
	</a>
);

// ── Schema / path block ───────────────────────────────────────────────────────

type Step = {
	num: number;
	icon: string;
	title: string;
	desc: string;
	hint?: string;
	perks?: string[];
};

type SchemaBlockProps = {
	id: string;
	color: string;
	eyebrowIcon: string;
	eyebrow: string;
	title: string;
	ctaLabel: string;
	ctaHref: string;
	steps: Step[];
	open: boolean;
	onToggle: () => void;
};

const SchemaBlock = ({ id, color, eyebrowIcon, eyebrow, title, ctaLabel, ctaHref, steps, open, onToggle }: SchemaBlockProps) => (
	<div
		id={id}
		style={{
			background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
			border: "1px solid var(--ifm-color-emphasis-200)",
			borderRadius: "16px",
			marginBottom: "12px",
			position: "relative",
			overflow: "hidden",
		}}
	>
		{/* left accent strip */}
		<div
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				bottom: 0,
				width: "3px",
				borderRadius: "3px 0 0 3px",
				background: `linear-gradient(to bottom, ${color}, transparent)`,
			}}
		/>
		{/* subtle radial glow */}
		<div
			style={{
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				background: `radial-gradient(ellipse 50% 40% at 0% 0%, ${color}0d 0%, transparent 60%)`,
			}}
		/>

		{/* header — always visible, clickable to toggle */}
		<button
			type="button"
			onClick={onToggle}
			style={{
				width: "100%",
				background: "none",
				border: "none",
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "16px",
				padding: "24px 28px",
				position: "relative",
				zIndex: 1,
				textAlign: "left",
				color: "inherit",
			}}
		>
			<div>
				<div
					style={{
						fontFamily: "var(--ifm-font-family-monospace)",
						fontSize: "10px",
						letterSpacing: "1.2px",
						textTransform: "uppercase",
						marginBottom: "6px",
						display: "flex",
						alignItems: "center",
						gap: "7px",
						color: color,
					}}
				>
					<span>{eyebrowIcon}</span> {eyebrow}
				</div>
				<div style={{ fontWeight: 700, fontSize: "18px", lineHeight: 1.2 }}>{title}</div>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
				<Link
					href={ctaHref}
					onClick={(e) => e.stopPropagation()}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						padding: "8px 16px",
						borderRadius: "8px",
						fontSize: "13px",
						fontWeight: 600,
						background: color,
						color: "#000",
						textDecoration: "none",
						border: "none",
					}}
				>
					{ctaLabel}
				</Link>
				<span
					style={{
						fontSize: "18px",
						color: "var(--ifm-color-emphasis-500)",
						transform: open ? "rotate(180deg)" : "rotate(0deg)",
						transition: "transform .2s",
						display: "inline-block",
					}}
				>
					▾
				</span>
			</div>
		</button>

		{/* collapsible step flow */}
		{open && (
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					flexWrap: "wrap",
					gap: "0",
					padding: "0 28px 28px",
					position: "relative",
					zIndex: 1,
				}}
			>
				{steps.map((step, i) => (
					<div
						key={step.num}
						style={{
							flex: "1",
							minWidth: "150px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							textAlign: "center",
							padding: "0 12px",
							position: "relative",
						}}
					>
						{i > 0 && (
							<div
								style={{
									position: "absolute",
									left: "-10px",
									top: "22px",
									color: "var(--ifm-color-emphasis-400)",
									fontSize: "16px",
								}}
							>
								→
							</div>
						)}
						{step.hint && (
							<div
								style={{
									fontFamily: "var(--ifm-font-family-monospace)",
									fontSize: "9px",
									letterSpacing: "0.8px",
									textTransform: "uppercase",
									color: "var(--ifm-color-emphasis-400)",
									marginBottom: "4px",
								}}
							>
								{step.hint}
							</div>
						)}
						<div
							style={{
								width: "44px",
								height: "44px",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: 800,
								fontSize: "17px",
								marginBottom: "10px",
								flexShrink: 0,
								border: `2px ${step.hint ? "dashed" : "solid"} ${color}55`,
								color: color,
								background: `${color}14`,
								opacity: step.hint ? 0.75 : 1,
							}}
						>
							{step.num}
						</div>
						<div style={{ fontSize: "20px", marginBottom: "8px" }}>{step.icon}</div>
						<div style={{ fontWeight: 700, fontSize: "13.5px", marginBottom: "6px", lineHeight: 1.3 }}>{step.title}</div>
						<div style={{ fontSize: "12px", color: "var(--ifm-color-emphasis-600)", lineHeight: 1.55 }}>{step.desc}</div>
						{step.perks && (
							<ul
								style={{
									listStyle: "none",
									margin: "8px 0 0",
									padding: 0,
									display: "flex",
									flexDirection: "column",
									gap: "4px",
								}}
							>
								{step.perks.map((p) => (
									<li
										key={p}
										style={{
											fontSize: "11.5px",
											color: "var(--ifm-color-emphasis-500)",
											display: "flex",
											alignItems: "flex-start",
											gap: "5px",
											textAlign: "left",
										}}
									>
										<span style={{ color, flexShrink: 0, fontSize: "10px", marginTop: "1px" }}>✓</span>
										{p}
									</li>
								))}
							</ul>
						)}
					</div>
				))}
			</div>
		)}
	</div>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const ORANGE = "#f97316";
const GREEN = "#22d3a0";
const BLUE = "#60a5fa";

const intents: IntentCardProps[] = [
	{
		icon: <img src="/img/icons/radar-target.webp" className="h-8 w-8 border-0" alt="Security Engine" />,
		accent: ORANGE,
		title: "Detect and block attacks on systems I run",
		desc: "You operate servers, VMs, or containers and want active threat detection — not just a blocklist.",
		pill: "Security Engine",
		href: "/security-engine",
	},
	{
		icon: <img src="/img/icons/shield.webp" className="h-8 w-8 border-0" alt="Blocklists" />,
		accent: GREEN,
		title: "Push a threat feed into my firewall, router, or CDN",
		desc: "You manage network perimeter devices and want a URL to subscribe to — no agent to install.",
		pill: "Blocklist Feed Endpoints",
		href: "/blocklists",
	},
	{
		icon: <img src="/img/icons/world.webp" className="h-8 w-8 border-0" alt="CTI" />,
		accent: BLUE,
		title: "Look up an IP or enrich my security tools",
		desc: "You're a security analyst or developer who wants IP context — in a browser or via REST API.",
		pill: "IP Reputation & CTI",
		href: "/u/cti_api/intro",
	},
];

const schemas: Omit<SchemaBlockProps, "open" | "onToggle">[] = [
	{
		id: "schema-engine",
		color: ORANGE,
		eyebrowIcon: "🛡️",
		eyebrow: "Security Engine",
		title: "Detect and block malicious behaviors on your infrastructure",
		ctaLabel: "Get started →",
		ctaHref: "/security-engine",
		steps: [
			{
				num: 1,
				icon: "⚡",
				title: "Install the Security Engine",
				desc: "Runs on your server, reads your logs, detects attack patterns in real time.",
				perks: [
					"Immediately protected from incoming attacks",
					"Automatically receives global threat intel from the CrowdSec network",
				],
			},
			{
				num: 2,
				icon: "🛡️",
				hint: "RECOMMENDED",
				title: "Activate the Web Application Firewall",
				desc: "Layer in the AppSec component to inspect HTTP traffic and block web exploits before they reach your app.",
			},
			{
				num: 3,
				icon: "📋",
				hint: "OPTIONAL",
				title: "Subscribe to additional blocklists",
				desc: "Add curated threat feeds on top of the community blocklist — by category, use case, or vendor.",
			},
			{
				num: 4,
				icon: "✍️",
				hint: "OPTIONAL",
				title: "Craft your own detection rules",
				desc: "Write custom scenarios for your stack, then share them back with the community on the Hub.",
			},
		],
	},
	{
		id: "schema-blocklists",
		color: GREEN,
		eyebrowIcon: "🚫",
		eyebrow: "Blocklists",
		title: "Push curated threat feeds directly into your firewall, CDN, or WAF",
		ctaLabel: "Get started →",
		ctaHref: "/blocklists",
		steps: [
			{
				num: 1,
				icon: "🔌",
				title: "Create a blocklist integration endpoint",
				desc: "Generate a dedicated URL in the Console — one per target device or environment.",
			},
			{
				num: 2,
				icon: "🗂️",
				title: "Choose which blocklists to serve",
				desc: "Select from curated feeds by threat category: scanners, bots, TOR exits, exploits, and more.",
			},
			{
				num: 3,
				icon: "🔗",
				title: "Plug it in as an external threat feed",
				desc: "Point your firewall, CDN, or WAF at the endpoint. It auto-refreshes — no further maintenance needed.",
				perks: ["Works with pfSense, OPNsense, Cloudflare, nginx, HAProxy, and more", "No agent to install or maintain"],
			},
		],
	},
	{
		id: "schema-cti",
		color: BLUE,
		eyebrowIcon: "🔍",
		eyebrow: "IP Reputation & CTI",
		title: "Query threat intel — in the browser or via API in your tools",
		ctaLabel: "Explore CTI →",
		ctaHref: "/cti",
		steps: [
			{
				num: 1,
				icon: "🖥️",
				title: "Look up any IP in the Console",
				desc: "No setup. Search instantly — get reputation score, behaviors, attack history, and CVE links.",
			},
			{
				num: 2,
				icon: "🔑",
				hint: "For integrations",
				title: "Generate a CTI API key",
				desc: "Unlock programmatic access to the same data. Free tier included — no credit card needed.",
			},
			{
				num: 3,
				icon: "⚙️",
				hint: "Enrich",
				title: "Connect to your SIEM or security tool",
				desc: "Native integrations for Splunk, Sentinel, QRadar, TheHive, OpenCTI, MISP, and more.",
			},
		],
	},
];

// ── Page ──────────────────────────────────────────────────────────────────────

const HomePage = () => {
	useEffect(() => {
		document.body.classList.add("homepage");
		document.documentElement.classList.add("homepage");
		return () => {
			document.body.classList.remove("homepage");
			document.documentElement.classList.remove("homepage");
		};
	}, []);

	const [openSchema, setOpenSchema] = useState<string | null>(null);

	const toggleSchema = (id: string) => setOpenSchema((prev) => (prev === id ? null : id));

	return (
		<Layout title="Documentation" description="CrowdSec, the open-source & participative IPS">
			<main className="flex-1">
				{/* Hero */}
				<section className="py-10 md:py-16 px-4 text-center" style={{ position: "relative", overflow: "hidden" }}>
					<div
						style={{
							position: "absolute",
							inset: 0,
							pointerEvents: "none",
							background: "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
						}}
					/>
					<div style={{ position: "relative", zIndex: 1 }}>
						<h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ letterSpacing: "-1px", lineHeight: 1.1 }}>
							What do you want
							<br />
							to protect today?
						</h1>
						<p
							className="text-base md:text-lg mb-0"
							style={{ color: "var(--ifm-color-emphasis-600)", maxWidth: "460px", margin: "0 auto" }}
						>
							Community-driven security — detection, blocklists, and threat intel for modern infrastructure.
						</p>
					</div>
				</section>

				{/* Search */}
				<section className="pb-8 px-4">
					<div className="container max-w-2xl mx-auto">
						<div className="homepage-search">
							<SearchBar />
						</div>
					</div>
				</section>

				{/* Intent strip */}
				<section className="pb-6 px-4">
					<div className="container mx-auto" style={{ maxWidth: "940px" }}>
						<div
							style={{
								fontFamily: "var(--ifm-font-family-monospace)",
								fontSize: "10.5px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "var(--ifm-color-emphasis-500)",
								marginBottom: "12px",
							}}
						>
							I want to…
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
							{intents.map((i) => (
								<IntentCard key={i.pill} {...i} />
							))}
						</div>

						{/* Existing user strip */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
								flexWrap: "wrap",
								marginTop: "10px",
								padding: "12px 18px",
								background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
								border: "1px solid var(--ifm-color-emphasis-200)",
								borderRadius: "10px",
							}}
						>
							<span
								style={{
									fontFamily: "var(--ifm-font-family-monospace)",
									fontSize: "10.5px",
									letterSpacing: "0.8px",
									textTransform: "uppercase",
									color: "var(--ifm-color-emphasis-500)",
									whiteSpace: "nowrap",
									flexShrink: 0,
								}}
							>
								Already running CrowdSec?
							</span>
							<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
								{[
									{ label: "🖥️ Open the Console", href: "https://app.crowdsec.net", external: true },
									{ label: "📋 Manage alerts & decisions", href: "/u/console/intro" },
									{ label: "🔄 Remediation sync", href: "/u/bouncers/intro" },
									{ label: "❓ Troubleshooting", href: "/docs/next/troubleshooting/security_engine" },
								].map(({ label, href, external }) => (
									<Link
										key={label}
										href={href}
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: "6px",
											padding: "5px 12px",
											borderRadius: "7px",
											fontSize: "12.5px",
											color: "var(--ifm-color-emphasis-700)",
											border: "1px solid var(--ifm-color-emphasis-200)",
											background: "var(--ifm-background-color)",
											textDecoration: "none",
											transition: "border-color .15s, color .15s",
										}}
									>
										{label}
										{external && <ExternalLink size={11} style={{ opacity: 0.5, flexShrink: 0 }} />}
									</Link>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* How each path works — accordion */}
				<section className="py-6 px-4">
					<div className="container mx-auto" style={{ maxWidth: "940px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
								color: "var(--ifm-color-emphasis-400)",
								fontSize: "11px",
								fontFamily: "var(--ifm-font-family-monospace)",
								letterSpacing: "1px",
								textTransform: "uppercase",
								marginBottom: "20px",
							}}
						>
							<div style={{ flex: 1, height: "1px", background: "var(--ifm-color-emphasis-200)" }} />
							how each path works
							<div style={{ flex: 1, height: "1px", background: "var(--ifm-color-emphasis-200)" }} />
						</div>

						{schemas.map((s) => (
							<SchemaBlock key={s.id} {...s} open={openSchema === s.id} onToggle={() => toggleSchema(s.id)} />
						))}
					</div>
				</section>

				{/* Not sure / fallback */}
				<section className="py-6 px-4">
					<div className="container mx-auto" style={{ maxWidth: "940px" }}>
						<div
							style={{
								padding: "24px 28px",
								background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
								border: "1px solid var(--ifm-color-emphasis-200)",
								borderRadius: "13px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: "20px",
								flexWrap: "wrap",
							}}
						>
							<div>
								<div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "3px" }}>Not sure where to start?</div>
								<div style={{ fontSize: "13px", color: "var(--ifm-color-emphasis-600)" }}>
									Answer a few questions and get a recommended path with install steps for your stack.
								</div>
							</div>
							<div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
								<Link to="https://start.crowdsec.net/">
									<Button size="lg" color="primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
										🧭 Guided Setup <ExternalLink size={13} style={{ opacity: 0.7 }} />
									</Button>
								</Link>
								<Link to="https://killercoda.com/iiamloz/scenario/crowdsec-setup">
									<Button
										size="lg"
										variant="outline"
										style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
									>
										⚡ Try in Sandbox <ExternalLink size={13} style={{ opacity: 0.7 }} />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Popular docs */}
				<section className="py-8 px-4">
					<div className="container mx-auto" style={{ maxWidth: "940px" }}>
						<div
							style={{
								fontFamily: "var(--ifm-font-family-monospace)",
								fontSize: "10.5px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "var(--ifm-color-emphasis-500)",
								marginBottom: "12px",
							}}
						>
							Popular docs
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
							{[
								{ label: "🖥️ Console", href: "/u/console/intro" },
								{ label: "🛡️ AppSec / WAF", href: "/docs/next/appsec/intro" },
								{ label: "💻 CLI Reference", href: "/docs/next/cscli/" },
								{
									label: "📖 Docs AI Assistant",
									href: "https://chatgpt.com/g/g-682c3a61a78081918417571116c2b563-crowdsec-documentation",
									external: true,
								},
								{ label: "🔑 CTI API Keys", href: "/cti" },
								{ label: "❓ Troubleshooting", href: "/docs/next/troubleshooting/security_engine" },
								{ label: "🌐 About CrowdSec", href: "https://www.crowdsec.net", external: true },
							].map(({ label, href, external }) => (
								<Link
									key={label}
									href={href}
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: "6px",
										padding: "7px 14px",
										borderRadius: "100px",
										border: "1px solid var(--ifm-color-emphasis-200)",
										fontSize: "13px",
										color: "var(--ifm-color-emphasis-700)",
										background: "rgb(var(--card)/var(--tw-bg-opacity,1))",
										textDecoration: "none",
										transition: "color .15s, border-color .15s",
									}}
								>
									{label}
									{external && <ExternalLink size={12} style={{ opacity: 0.5, flexShrink: 0 }} />}
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default HomePage;
