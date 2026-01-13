import Link from "@docusaurus/Link";
import HubIcon from "@mui/icons-material/Hub";
import ForwardIcon from "@mui/icons-material/Forward";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import Layout from "@theme/Layout";
import React from "react";
import { Button } from "../ui/button";
import { HomePageItem } from "../components/home-page/home-item";

// Platform icons
import cibApple from "@site/static/img/logo/apple-colored.svg";
import cibDocker from "@site/static/img/logo/docker-colored.svg";
import cibFreebsd from "@site/static/img/logo/freebsd-colored.svg";
import cibKubernetes from "@site/static/img/logo/kubernetes-colored.svg";
import cibLinux from "@site/static/img/logo/linux-colored.svg";
import cibWindows from "@site/static/img/logo/windows-colored.svg";
import opnsenseLogo from "@site/static/img/logo-opnsense.svg";
import pfSenseLogo from "@site/static/img/logo-pfsense.svg";
import whmLogo from "@site/static/img/logo-whm.svg";

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
		description: "Use a single LAPI to collect alerts from multiple engines.",
	},
	{
		icon: ForwardIcon,
		text: "Log Centralization",
		link: "/u/user_guides/log_centralization",
		description: "Use Rsyslog to centralize logs from multiple servers.",
	},
];

type FeatureCardProps = {
	title: string;
	description: string;
	link: string;
	icon: string;
};

const FeatureCard = ({ title, description, link, icon }: FeatureCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="h-full border border-solid border-border rounded-lg p-5 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200">
			<div className="text-3xl mb-3">
				{icon.startsWith("/") ? <img src={icon} alt={title} className="h-8 w-8" /> : icon}
			</div>
			<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
			<p className="text-sm text-gray-600 dark:text-gray-700 mb-0">{description}</p>
		</div>
	</Link>
);

const features: FeatureCardProps[] = [
	{
		title: "Parsers & Scenarios",
		description: "Understand how CrowdSec analyzes logs and detects threats using community-maintained rules.",
		link: "/docs/next/concepts",
		icon: "📊",
	},
	{
		title: "Bouncers",
		description: "Block threats at firewalls, web servers, CDNs, and more with remediation components.",
		link: "/u/bouncers/intro",
		icon: "/img/icons/shield-target.webp",
	},
	{
		title: "Console Integration",
		description: "Connect to CrowdSec Console for centralized management, alerts, and analytics.",
		link: "/u/console/intro",
		icon: "📱",
	},
	{
		title: "AppSec / WAF",
		description: "Protect web applications from OWASP Top 10 vulnerabilities and custom attack patterns.",
		link: "/docs/next/appsec/intro",
		icon: "/img/icons/waf.webp",
	},
];

const nextSteps = [
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
		<Layout title="Security Engine" description="Install and configure the CrowdSec Security Engine">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="py-10 md:py-16 px-4 border-b border-border">
					<div className="container max-w-5xl mx-auto">
						<Link to="/" className="text-sm text-gray-500 dark:text-gray-600 hover:text-primary mb-4 inline-block">
							← Back to Documentation
						</Link>
						<div className="flex flex-col md:flex-row md:items-center gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<img src="/img/icons/radar-target.webp" className="h-7 w-7" alt="Security Engine" />
									</div>
									<h1 className="text-3xl md:text-4xl font-bold m-0 text-gray-900 dark:text-gray-900">Security Engine</h1>
								</div>
								<p className="text-lg text-gray-600 dark:text-gray-700 mb-6 max-w-2xl">
									Detect and block malicious behavior in real-time. The Security Engine analyzes your logs, identifies
									threats using behavior detection, and shares intelligence with the CrowdSec community.
								</p>
								<div className="flex gap-3">
									<Link to="/u/getting_started/intro">
										<Button color="primary">
											Read Introduction
										</Button>
									</Link>
									<Link to="https://killercoda.com/iiamloz/scenario/crowdsec-setup">
										<Button variant="outline">
											Try in Sandbox
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Installation Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<div className="text-left mb-6">
							<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Installation</h2>
							<p className="text-gray-600 dark:text-gray-700 max-w-2xl">
								Choose your platform to install the Security Engine. Each guide covers setup, configuration, and
								connecting to the CrowdSec Console.
							</p>
						</div>

						{/* Single Server */}
						<div className="mt-8">
							<h3 className="text-lg font-medium text-primary mb-1">Single Server</h3>
							<p className="text-sm text-gray-600 dark:text-gray-700 mb-4 max-w-xl">
								Standalone installation for protecting a single machine or service.
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
								Distributed deployment for organizations managing multiple servers or infrastructure.
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

				{/* Features Section */}
				<section className="py-10 md:py-14 px-4 bg-muted border-t border-border">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Key Capabilities</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Explore what you can do with the Security Engine once it's installed.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{features.map((feature) => (
								<FeatureCard key={feature.title} {...feature} />
							))}
						</div>
					</div>
				</section>

				{/* Next Steps Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">After Installation</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Resources to help you configure, manage, and troubleshoot your Security Engine.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{nextSteps.map((step) => (
								<FeatureCard key={step.title} {...step} />
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-10 md:py-14 px-4 bg-primary/5 border-t border-border">
					<div className="container max-w-3xl mx-auto text-center">
						<h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-900">Need Help?</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-6">
							Join our community Discord for support, or check out the troubleshooting guide for common questions.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link to="https://discord.gg/crowdsec">
								<Button size="lg" variant="outline">
									Join Discord
								</Button>
							</Link>
							<Link to="/u/troubleshooting/intro">
								<Button size="lg" variant="outline">
									Troubleshooting
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default SecurityEnginePage;
