import ForwardIcon from "@mui/icons-material/Forward";
import HubIcon from "@mui/icons-material/Hub";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import cibApple from "@site/static/img/logo/apple-colored.svg";
import cibDocker from "@site/static/img/logo/docker-colored.svg";
import cibFreebsd from "@site/static/img/logo/freebsd-colored.svg";
import cibKubernetes from "@site/static/img/logo/kubernetes-colored.svg";
import cibLinux from "@site/static/img/logo/linux-colored.svg";
import cibWindows from "@site/static/img/logo/windows-colored.svg";
import opnsenseLogo from "@site/static/img/logo-opnsense.svg";
import pfSenseLogo from "@site/static/img/logo-pfsense.svg";
import whmLogo from "@site/static/img/logo-whm.svg";
import DocCard from "@site/src/components/docs/DocCard";
import DocCardGrid from "@site/src/components/docs/DocCardGrid";
import React from "react";
import { HomePageItem } from "../components/home-page/home-item";
import { ProductPageLayout, Section } from "../components/product-page";

type PlatformData = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	text: string;
	link: string;
	description?: string;
};

const singleServerSetup: PlatformData[] = [
	{ icon: cibLinux, text: "Linux", link: "/u/getting_started/installation/linux" },
	{ icon: cibWindows, text: "Windows", link: "/u/getting_started/installation/windows" },
	{ icon: cibFreebsd, text: "FreeBSD", link: "/u/getting_started/installation/freebsd" },
	{ icon: cibApple, text: "macOS", link: "/u/getting_started/installation/macos" },
	{ icon: cibDocker, text: "Docker", link: "/u/getting_started/installation/docker" },
	{ icon: cibKubernetes, text: "Kubernetes", link: "/u/getting_started/installation/kubernetes" },
	{ icon: opnsenseLogo, text: "OPNsense", link: "/u/getting_started/installation/opnsense" },
	{ icon: pfSenseLogo, text: "pfSense", link: "/u/getting_started/installation/pfsense" },
	{ icon: whmLogo, text: "WHM", link: "/u/getting_started/installation/whm" },
];

const multiServerSetup: PlatformData[] = [
	{
		icon: HubIcon,
		text: "Central LAPI",
		link: "/u/user_guides/multiserver_setup",
		description: "Use a single LAPI to aggregate alerts and distribute decisions.",
	},
	{
		icon: ForwardIcon,
		text: "Log Centralization",
		link: "/u/user_guides/log_centralization",
		description: "Centralize logs from multiple servers to run detection in one place.",
	},
];

const SecurityEnginePage = () => {
	return (
		<ProductPageLayout
			title="Security Engine"
			metaDescription="Install and configure the CrowdSec Security Engine"
			icon="/img/icons/radar-target.webp"
			description="Detect and block malicious behavior in real time. The Security Engine analyzes your logs with behavior-based scenarios, shares intelligence with the CrowdSec community, and powers automated remediation and AppSec protection."
			heroButtons={[
				{ label: "Get Started", link: "/u/getting_started/intro" },
				{ label: "Try in Sandbox", link: "https://killercoda.com/iiamloz/scenario/crowdsec-setup", variant: "outline" },
			]}
			helpDescription="Get answers fast in Discord or jump straight to troubleshooting."
			helpButtons={[
				{ label: "Join Discord", link: "https://discord.gg/crowdsec" },
				{ label: "Troubleshooting", link: "/u/troubleshooting/intro" },
			]}
		>
			{/* Installation Section */}
			<Section title="Installation" description="Choose your platform. Each guide covers setup, configuration, and enrolling in the CrowdSec Console.">
				<div style={{ marginBottom: 24 }}>
					<div style={{
						fontFamily: 'var(--cs-font-mono)', fontSize: 11, textTransform: 'uppercase',
						letterSpacing: '0.12em', color: 'var(--cs-orange)', fontWeight: 600, marginBottom: 12,
					}}>
						Single Server
					</div>
					<p style={{ fontSize: 13.5, color: 'var(--cs-ink-dim)', marginBottom: 14, maxWidth: 520 }}>
						Deploy on a single host or service for fast detection and blocking.
					</p>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
						{singleServerSetup.map((p) => (
							<HomePageItem title={p.text} description="" link={p.link} icon={p.icon} key={p.text} />
						))}
					</div>
				</div>

				<div style={{ marginBottom: 8 }}>
					<HomePageItem
						title="Installation Healthcheck"
						description="Verify your installation is working correctly"
						link="/u/getting_started/health_check"
						icon={MonitorHeartIcon}
					/>
				</div>
				<p style={{ fontSize: 12, color: 'var(--cs-ink-mute)', textAlign: 'right', marginBottom: 24 }}>
					*Logos and trademarks are property of their respective owners.
				</p>

				<div>
					<div style={{
						fontFamily: 'var(--cs-font-mono)', fontSize: 11, textTransform: 'uppercase',
						letterSpacing: '0.12em', color: 'var(--cs-teal)', fontWeight: 600, marginBottom: 12,
					}}>
						Multi-Server
					</div>
					<p style={{ fontSize: 13.5, color: 'var(--cs-ink-dim)', marginBottom: 14, maxWidth: 520 }}>
						Scale detection across fleets with centralized alerts or logs.
					</p>
					<DocCardGrid cols={2}>
						{multiServerSetup.map((p) => (
							<DocCard
								key={p.text}
								iconName="box"
								color="var(--cs-teal)"
								title={p.text}
								desc={p.description ?? ""}
								href={p.link}
							/>
						))}
					</DocCardGrid>
				</div>
			</Section>

			{/* Key Capabilities */}
			<Section title="Key Capabilities" description="Core capabilities you can enable right after install." variant="muted">
				<DocCardGrid cols={2}>
					<DocCard
						iconName="book"
						color="var(--cs-orange)"
						title="Parsers & Scenarios"
						desc="Learn how CrowdSec parses logs and detects threats with community-maintained scenarios."
						href="/docs/next/concepts"
					/>
					<DocCard
						iconName="shield"
						color="var(--cs-teal)"
						title="Remediation Components"
						desc="Block threats at firewalls, web servers, and CDNs with remediation components."
						href="/u/bouncers/intro"
					/>
					<DocCard
						iconName="compass"
						color="var(--cs-violet)"
						title="Console Integration"
						desc="Connect to the CrowdSec Console for centralized management, alerts, and analytics."
						href="/u/console/intro"
					/>
					<DocCard
						iconName="lock"
						color="var(--cs-blue)"
						title="AppSec / WAF"
						desc="Protect web applications from OWASP Top 10 risks and custom attack patterns."
						href="/docs/next/appsec/intro"
					/>
				</DocCardGrid>
			</Section>

			{/* After Installation */}
			<Section title="After Installation" description="Guides to tune detection, manage decisions, and keep the engine healthy.">
				<DocCardGrid cols={2}>
					<DocCard
						iconName="check"
						color="var(--cs-teal)"
						title="Post-Installation Checklist"
						desc="Essential steps after installing the Security Engine."
						href="/u/getting_started/next_steps"
					/>
					<DocCard
						iconName="terminal"
						color="var(--cs-orange)"
						title="CLI Reference"
						desc="Complete cscli command documentation."
						href="/docs/next/cscli/"
					/>
					<DocCard
						iconName="box"
						color="var(--cs-violet)"
						title="Configuration"
						desc="Fine-tune your Security Engine settings."
						href="/docs/next/configuration/crowdsec_configuration"
					/>
					<DocCard
						iconName="search"
						color="var(--cs-blue)"
						title="Troubleshooting"
						desc="Common issues and how to resolve them."
						href="/u/troubleshooting/intro"
					/>
				</DocCardGrid>
			</Section>
		</ProductPageLayout>
	);
};

export default SecurityEnginePage;
