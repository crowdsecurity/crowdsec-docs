import Layout from "@theme/Layout";
import SearchBar from "@theme/SearchBar";
import { useEffect } from "react";
import GuidedSetupCard from "../components/docs/GuidedSetupCard";
import PathCard from "../components/docs/PathCard";
import PathCards from "../components/docs/PathCards";
import PathwayRow from "../components/docs/PathwayRow";
import PopularChips from "../components/docs/PopularChips";
import RunningStrip from "../components/docs/RunningStrip";

/* ── Colour vars — reference CSS tokens (work in dark + light) */
const CS_ORANGE = "var(--cs-orange)";
const CS_TEAL = "var(--cs-teal)";
const CS_VIOLET = "var(--cs-violet)";
const CS_BLUE = "var(--cs-blue)";

/* ── Small inline icons for the RunningStrip */
function IconCompass() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M15 9l-2 5-5 2 2-5 5-2z" />
		</svg>
	);
}
function IconShield() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
		</svg>
	);
}
function IconGauge() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 14a9 9 0 0 1 18 0" />
			<path d="M12 14l4-4" />
			<circle cx="12" cy="14" r="1.5" />
		</svg>
	);
}
function IconPulse() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 12h4l2-6 4 12 2-6h6" />
		</svg>
	);
}
function IconFeed() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="6" cy="18" r="2" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<path d="M4 11a9 9 0 0 1 9 9" />
		</svg>
	);
}
function IconGlobe() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
		</svg>
	);
}

const securityEngineSteps = [
	{
		title: "Install the Security Engine",
		desc: "Runs on your server, detects attack patterns in real time. Immediately protected with the Community Blocklist.",
	},
	{
		title: "Activate the WAF module",
		hint: "RECOMMENDED" as const,
		desc: "Layer in the AppSec component to inspect HTTP traffic and block web exploits.",
	},
	{
		title: "Subscribe to blocklists",
		hint: "OPTIONAL" as const,
		desc: "Add extra curated feeds on top of the built-in detection & community blocklist.",
	},
	{
		title: "Craft your own rules",
		hint: "OPTIONAL" as const,
		desc: "Write custom scenarios for your stack, then share them on the Hub.",
	},
];
const blocklistSteps = [
	{
		title: "Create an integration endpoint",
		desc: "Generates a dedicated URL and credentials to serve blocklists to your perimeter devices.",
	},
	{ title: "Choose blocklists to serve", desc: "Select from curated feeds: scanners, bots, TOR exits, exploits, and more." },
	{ title: "Plug in as a threat feed", desc: "Point your firewall, CDN, or WAF at the endpoint. No agent to install." },
];
const ctiSteps = [
	{ title: "Look up any IP in the Console", desc: "Get reputation score, behaviors, attack history, and CVE links instantly." },
	{
		title: "Generate a CTI API key",
		hint: "OPTIONAL" as const,
		desc: "Unlock programmatic access to 30+ data points per IP detected by the CrowdSec network.",
	},
	{
		title: "Connect to your SIEM/SOAR",
		hint: "OPTIONAL" as const,
		desc: "Native integrations for Splunk, Sentinel, QRadar, TheHive, MISP, and more.",
	},
];

const alreadyRunningLinks = [
	{ icon: <IconCompass />, label: "Open the Console", href: "https://app.crowdsec.net", color: CS_ORANGE, ext: true },
	{ icon: <IconShield />, label: "Activate the WAF", href: "/docs/next/appsec/intro", color: CS_TEAL },
	{ icon: <IconGauge />, label: "Measure what is being blocked", href: "/u/console/remediation_metrics", color: CS_VIOLET },
	{ icon: <IconPulse />, label: "Check my Stack Health", href: "/u/console/stackhealth", color: CS_BLUE },
];

const popularChips = [
	{ label: "🖥️ Console", href: "/u/console/intro" },
	{ label: "🛡️ AppSec / WAF", href: "/docs/next/appsec/intro" },
	{ label: "💻 CLI Reference", href: "/docs/next/cscli/" },
	{ label: "🔑 CTI API Keys", href: "/u/console/ip_reputation/api_keys" },
	{ label: "❓ Troubleshooting", href: "/u/troubleshooting/intro" },
	{ label: "🌐 CrowdSec.net", href: "https://www.crowdsec.net" },
];

export default function HomePage() {
	useEffect(() => {
		document.body.classList.add("homepage");
		document.documentElement.classList.add("homepage");
		return () => {
			document.body.classList.remove("homepage");
			document.documentElement.classList.remove("homepage");
		};
	}, []);

	return (
		<Layout title="Documentation" description="CrowdSec — the open-source & participative IPS">
			<main>
				{/* ── Hero ── full-width so grid bg spans the viewport ── */}
				<section style={{ position: "relative", padding: "92px 24px 48px", textAlign: "center", overflow: "hidden" }}>
					{/* Radial glow */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"radial-gradient(ellipse 600px 280px at 50% 80px, color-mix(in srgb, var(--cs-orange) 13%, transparent), transparent 70%)",
							pointerEvents: "none",
						}}
						aria-hidden="true"
					/>

					{/* Subtle grid */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							backgroundImage:
								"linear-gradient(var(--cs-border-hi) 1px, transparent 1px), linear-gradient(90deg, var(--cs-border-hi) 1px, transparent 1px)",
							backgroundSize: "64px 64px",
							maskImage: "radial-gradient(ellipse 700px 320px at 50% 30%, black 30%, transparent 75%)",
							opacity: 0.4,
							pointerEvents: "none",
						}}
						aria-hidden="true"
					/>

					<div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
						{/* Badge */}
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								padding: "5px 12px",
								borderRadius: 999,
								background: "color-mix(in srgb, var(--cs-orange) 12%, transparent)",
								border: "1px solid color-mix(in srgb, var(--cs-orange) 33%, transparent)",
								marginBottom: 28,
								fontFamily: "var(--cs-font-mono)",
								fontSize: 11.5,
								color: "var(--cs-orange)",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "var(--cs-orange)",
									boxShadow: "0 0 10px var(--cs-orange)",
									display: "inline-block",
								}}
								aria-hidden="true"
							/>
							CrowdSec Docs
						</div>

						<h1
							style={{
								fontSize: "clamp(40px, 6vw, 64px)",
								lineHeight: 1.04,
								margin: 0,
								fontWeight: 700,
								letterSpacing: "-0.03em",
								color: "var(--cs-ink)",
							}}
						>
							Find the right
							<br />
							<span
								style={{
									background: "linear-gradient(120deg, var(--cs-ink) 30%, var(--cs-orange) 70%, var(--cs-ink))",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
								}}
							>
								CrowdSec tool
							</span>{" "}
							for you.
						</h1>

						<p
							style={{
								marginTop: 20,
								fontSize: 17,
								color: "var(--cs-ink-dim)",
								lineHeight: 1.5,
								maxWidth: 520,
								marginLeft: "auto",
								marginRight: "auto",
							}}
						>
							Three paths — one platform. Detect attacks at the edge, push curated threat feeds into your stack, or query
							intel on demand.
						</p>

						{/* Search */}
						<div className="homepage-search" style={{ marginTop: 36, maxWidth: 560, margin: "36px auto 0" }}>
							<SearchBar />
						</div>
					</div>
				</section>

				<div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 80px" }}>
					{/* ── "I want to…" eyebrow ── */}
					<div
						style={{
							fontFamily: "var(--cs-font-mono)",
							fontSize: 11,
							letterSpacing: "0.18em",
							textTransform: "uppercase",
							color: "var(--cs-ink-mute)",
							fontWeight: 500,
							marginBottom: 14,
							marginLeft: 4,
						}}
					>
						I want to…
					</div>

					{/* ── Path cards ── */}
					<PathCards>
						<PathCard
							eyebrow="01 · DETECT"
							color={CS_ORANGE}
							icon={
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.6}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
								</svg>
							}
							title="Detect & block attacks on my servers"
							desc="Identify and ban bad-behaving IPs from your logs and requests using CrowdSec Detection Scenarios and Virtual-Patching collections."
							tag="Security Engine"
							tags={["IDS", "IPS", "WAF", "CrowdSec FOSS"]}
							audience="Sysadmins · DevOps · SRE"
							href="/security-engine"
						/>
						<PathCard
							eyebrow="02 · PROTECT"
							color={CS_TEAL}
							icon={<IconFeed />}
							title="Push blocklists into my firewall, CDN or WAF"
							desc="Manage network-perimeter devices and want a URL to subscribe to — no agent to install, just curated feeds your equipment can pull."
							tag="Blocklist Endpoint"
							tags={["AWS", "Threat Feeds", "NGINX", "Cloudflare"]}
							audience="Network · Platform teams"
							href="/blocklists"
						/>
						<PathCard
							eyebrow="03 · INVESTIGATE"
							color={CS_VIOLET}
							icon={<IconGlobe />}
							title="Investigate IP behaviors & enrich alerts"
							desc="Security analyst or developer who wants IP context, behaviors, CVEs, aggressivity… in a browser or via REST API."
							tag="IP Reputation & CTI"
							tags={["SOC", "Lookup", "Threat Intel", "API"]}
							audience="SOC · Threat Intel"
							href="/u/cti_api/intro"
						/>
					</PathCards>

					{/* ── Already running strip ── */}
					<RunningStrip links={alreadyRunningLinks} />

					{/* ── How each path works ── */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							margin: "40px auto 22px",
							maxWidth: 360,
							justifyContent: "center",
						}}
					>
						<div style={{ height: 1, flex: 1, background: "var(--cs-border)" }} />
						<div
							style={{
								fontFamily: "var(--cs-font-mono)",
								fontSize: 11,
								letterSpacing: "0.14em",
								textTransform: "uppercase",
								color: "var(--cs-ink-mute)",
								fontWeight: 500,
							}}
						>
							How each path works
						</div>
						<div style={{ height: 1, flex: 1, background: "var(--cs-border)" }} />
					</div>

					<PathwayRow
						color={CS_ORANGE}
						eyebrow="SECURITY ENGINE"
						title="Detect and block malicious behaviors on your infrastructure"
						sub="Open-source agent that parses logs, applies scenarios, and bans IPs."
						steps={securityEngineSteps}
						ctaLabel="Get started"
						ctaHref="/security-engine"
						defaultOpen
					/>
					<PathwayRow
						color={CS_TEAL}
						eyebrow="BLOCKLISTS"
						title="Push curated threat feeds directly into your firewall, CDN or WAF"
						sub="Subscribe via URL. Compatible with AWS, Cloudflare, NGINX, Fastly, F5, and more."
						steps={blocklistSteps}
						ctaLabel="Get started"
						ctaHref="/blocklists"
					/>
					<PathwayRow
						color={CS_VIOLET}
						eyebrow="IP REPUTATION & CTI"
						title="Query threat intel — in the browser or via API in your tools"
						sub="Search 1B+ observed IPs, enrich SIEM/SOAR alerts, hunt patterns across the community."
						steps={ctiSteps}
						ctaLabel="Explore CTI"
						ctaHref="/u/cti_api/intro"
					/>

					{/* ── Guided setup ── */}
					<GuidedSetupCard
						title="Not sure where to start?"
						desc="Answer a few questions and get a recommended path with install steps for your stack."
						primaryCta={{ label: "🧭 Use Case Questionnaire", href: "https://start.crowdsec.net/" }}
						secondaryCta={{ label: "⚡ Try in Sandbox", href: "https://killercoda.com/iiamloz/scenario/crowdsec-setup" }}
					/>

					{/* ── Popular docs ── */}
					<PopularChips chips={popularChips} />
				</div>
			</main>
		</Layout>
	);
}
