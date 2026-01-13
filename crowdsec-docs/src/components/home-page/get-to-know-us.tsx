import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";
import { HomePageItem } from "./home-item";

type ItemData = {
	icon: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
	title: string;
	description: string;
	link: string;
};

// Core Products - Main CrowdSec offerings
const coreProducts: ItemData[] = [
	{
		icon: () => <img src="/img/icons/radar-target.webp" className="h-6 w-6" alt="security engine" />,
		title: "Security Engine",
		description: "Detect threats with behavior analysis and community intelligence.",
		link: "/u/getting_started/intro",
	},
	{
		icon: () => <img src="/img/icons/shield.webp" className="h-6 w-6" alt="blocklists" />,
		title: "Blocklists",
		description: "Subscribe to curated threat intelligence feeds.",
		link: "/u/blocklists/intro",
	},
	{
		icon: () => <img src="/img/icons/world.webp" className="h-6 w-6" alt="CTI" />,
		title: "CTI",
		description: "Query our threat intelligence database programmatically.",
		link: "/u/cti_api/intro",
	},
];

// Tools & Integration
const toolsAndIntegration: ItemData[] = [
	{
		icon: () => <span className="text-2xl">🖥️</span>,
		title: "Console",
		description: "Manage, monitor, and visualize your security from one dashboard.",
		link: "/u/console/intro",
	},
	{
		icon: () => <img src="/img/icons/waf.webp" className="h-6 w-6" alt="web application firewall" />,
		title: "AppSec / WAF",
		description: "Protect web applications from OWASP Top 10 and custom threats.",
		link: "/docs/next/appsec/intro",
	},
	{
		icon: () => <span className="text-2xl">🧑🏻‍💻</span>,
		title: "CLI Reference",
		description: "Complete command-line interface documentation.",
		link: "/docs/next/cscli/",
	},
];

// Resources & Help
const resources: ItemData[] = [
	{
		icon: () => <img src="/img/crowdsec_logo.png" className="h-6 w-9" alt="CrowdSec logo" />,
		title: "About CrowdSec",
		description: "Learn how our community-powered security works.",
		link: "https://www.crowdsec.net",
	},
	{
		icon: () => <span className="text-2xl">🛠️</span>,
		title: "Online Sandbox",
		description: "Try CrowdSec in an interactive browser environment.",
		link: "https://killercoda.com/iiamloz/scenario/crowdsec-setup",
	},
	{
		icon: () => (
			<ThemedImage
				sources={{
					light: useBaseUrl("/img/icons/OpenAI-black-monoblossom.svg"),
					dark: useBaseUrl("/img/icons/OpenAI-white-monoblossom.svg"),
				}}
				className="h-10 w-10"
				alt="OpenAI logo"
			/>
		),
		title: "AI Assistant",
		description: "Get help from our documentation-trained GPT.",
		link: "https://chatgpt.com/g/g-682c3a61a78081918417571116c2b563-crowdsec-documentation",
	},
];

const GetToKnowUs = (): React.JSX.Element => {
	return (
		<section>
			<div className="text-left mb-6">
				<h2 className="mb-2 text-2xl md:text-3xl font-semibold">Explore CrowdSec</h2>
				<p className="max-w-2xl text-base text-foreground/70">
					Discover our products, tools, and resources to build a comprehensive security solution.
				</p>
			</div>

			{/* Core Products */}
			<div className="text-left mt-8">
				<h3 className="mb-1 text-lg font-medium text-primary">Products</h3>
				<p className="max-w-xl text-sm text-foreground/60 mb-4">
					Our main security components that work together to protect your infrastructure.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{coreProducts.map((item) => (
					<HomePageItem
						title={item.title}
						description={item.description}
						link={item.link}
						icon={item.icon}
						key={item.title}
					/>
				))}
			</div>

			{/* Tools & Integration */}
			<div className="text-left mt-10">
				<h3 className="mb-1 text-lg font-medium text-primary">Tools & Integration</h3>
				<p className="max-w-xl text-sm text-foreground/60 mb-4">
					Extend and integrate CrowdSec with your existing workflows.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{toolsAndIntegration.map((item) => (
					<HomePageItem
						title={item.title}
						description={item.description}
						link={item.link}
						icon={item.icon}
						key={item.title}
					/>
				))}
			</div>

			{/* Resources */}
			<div className="text-left mt-10">
				<h3 className="mb-1 text-lg font-medium text-primary">Resources</h3>
				<p className="max-w-xl text-sm text-foreground/60 mb-4">
					Learn more and get help with your CrowdSec journey.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{resources.map((item) => (
					<HomePageItem
						title={item.title}
						description={item.description}
						link={item.link}
						icon={item.icon}
						key={item.title}
					/>
				))}
			</div>
		</section>
	);
};

export default GetToKnowUs;
