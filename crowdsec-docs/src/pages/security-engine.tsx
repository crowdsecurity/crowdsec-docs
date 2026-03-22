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
import React from "react";
import { HomePageItem } from "../components/home-page/home-item";
import { FeatureCard, FeatureCardProps, ProductPageLayout, Section } from "../components/product-page";

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

const features: FeatureCardProps[] = [
	{
		title: "Parsers & Scenarios",
		description: "Learn how CrowdSec parses logs and detects threats with community-maintained scenarios.",
		link: "/docs/next/concepts",
		icon: "📊",
	},
	{
		title: "Remediation Components",
		description: "Block threats at firewalls, web servers, and CDNs with remediation components.",
		link: "/u/bouncers/intro",
		icon: "/img/icons/shield-target.webp",
	},
	{
		title: "Console Integration",
		description: "Connect to the CrowdSec Console for centralized management, alerts, and analytics.",
		link: "/u/console/intro",
		icon: "📱",
	},
	{
		title: "AppSec / WAF",
		description: "Protect web applications from OWASP Top 10 risks and custom attack patterns.",
		link: "/docs/next/appsec/intro",
		icon: "/img/icons/waf.webp",
	},
];

const nextSteps: FeatureCardProps[] = [
	{
		title: "Post-Installation Checklist",
		description: "Essential steps after installing the Security Engine",
		link: "/u/getting_started/next_steps",
		icon: "✅",
	},
	{
		title: "CLI Reference",
		description: "Complete cscli command documentation",
		link: "/docs/next/cscli/",
		icon: "💻",
	},
	{
		title: "Configuration",
		description: "Fine-tune your Security Engine settings",
		link: "/docs/next/configuration/crowdsec_configuration",
		icon: "⚙️",
	},
	{
		title: "Troubleshooting",
		description: "Common issues and how to resolve them",
		link: "/u/troubleshooting/intro",
		icon: "🔧",
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
			{/* Installation Section - custom layout for platforms */}
			<section className="py-10 md:py-14 px-4">
				<div className="container max-w-5xl mx-auto">
					<div className="text-left mb-6">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Installation</h2>
						<p className="text-gray-600 dark:text-gray-700 max-w-2xl">
							Choose your platform to install the Security Engine. Each guide covers setup, configuration, and enrolling in
							the CrowdSec Console to sync decisions and metrics.
						</p>
					</div>

					{/* Single Server */}
					<div className="mt-8">
						<h3 className="text-lg font-medium text-primary mb-1">Single Server</h3>
						<p className="text-sm text-gray-600 dark:text-gray-700 mb-4 max-w-xl">
							Deploy on a single host or service for fast detection and blocking.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{singleServerSetup.map((props) => (
								<HomePageItem title={props.text} description="" link={props.link} icon={props.icon} key={props.text} />
							))}
						</div>
					</div>

					{/* Healthcheck */}
					<div className="mt-4">
						<HomePageItem
							title="Installation Healthcheck"
							description="Verify your installation is working correctly"
							link="/u/getting_started/health_check"
							icon={MonitorHeartIcon}
						/>
					</div>

					<p className="text-xs mt-2 text-gray-500 dark:text-gray-600 text-right">
						*Logos and trademarks are property of their respective owners.
					</p>

					{/* Multi-Server */}
					<div className="mt-10">
						<h3 className="text-lg font-medium text-primary mb-1">Multi-Server</h3>
						<p className="text-sm text-gray-600 dark:text-gray-700 mb-4 max-w-xl">
							Scale detection across fleets with centralized alerts or logs.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{multiServerSetup.map((props) => (
								<HomePageItem
									title={props.text}
									description={props.description || ""}
									link={props.link}
									icon={props.icon}
									key={props.text}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<Section
				title="Key Capabilities"
				description="Explore the core capabilities you can enable right after install."
				variant="muted"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{features.map((feature) => (
						<FeatureCard key={feature.title} {...feature} />
					))}
				</div>
			</Section>

			<Section title="After Installation" description="Guides to tune detection, manage decisions, and keep the engine healthy.">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{nextSteps.map((step) => (
						<FeatureCard key={step.title} {...step} />
					))}
				</div>
			</Section>
		</ProductPageLayout>
	);
};

export default SecurityEnginePage;
