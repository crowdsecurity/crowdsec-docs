import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";
import { Button } from "../ui/button";

type ProductCardProps = {
	title: string;
	description: string;
	icon: React.ReactNode;
	link: string;
	features: string[];
	bestFor: string;
};

const ProductCard = ({ title, description, icon, link, features, bestFor }: ProductCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group flex">
		<div className="w-full flex flex-col border border-solid border-border rounded-xl p-6 bg-card shadow-sm group-hover:shadow-lg group-hover:border-primary/50 transition-all duration-300">
			<div className="flex items-center gap-4 mb-4">
				<div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
					{icon}
				</div>
				<h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors m-0">
					{title}
				</h3>
			</div>
			<p className="text-gray-600 dark:text-gray-700 text-base mb-3">{description}</p>
			<p className="text-sm font-medium text-primary mb-4">{bestFor}</p>
			<ul className="space-y-2 mb-4 flex-grow">
				{features.map((feature) => (
					<li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-700">
						<span className="text-primary">✓</span>
						{feature}
					</li>
				))}
			</ul>
			<div className="mt-auto pt-4 border-t border-border">
				<span className="text-primary font-medium group-hover:underline">Explore product →</span>
			</div>
		</div>
	</Link>
);

const products: ProductCardProps[] = [
	{
		title: "Security Engine",
		description: "Analyze your logs to detect attacks, block malicious IPs, and protect web applications.",
		icon: <img src="/img/icons/radar-target.webp" className="h-10 w-10 border-0" alt="Security Engine" />,
		link: "/security-engine",
		features: ["Behavior-based detection", "Community threat sharing", "AppSec / WAF for web apps", "Open source"],
		bestFor: "Best for self-hosted detection and protection.",
	},
	{
		title: "Blocklists",
		description: "Deploy curated threat intel feeds to protect your network without running detection yourself.",
		icon: <img src="/img/icons/shield.webp" className="h-10 w-10 border-0" alt="Blocklists" />,
		link: "/blocklists",
		features: ["Curated IP lists", "Ready to deploy", "Automatic updates", "Multiple categories"],
		bestFor: "Best for fast protection with minimal setup.",
	},
	{
		title: "CTI",
		description: "Query CrowdSec threat intelligence to enrich investigations, automate lookups, and integrate with tools.",
		icon: <img src="/img/icons/world.webp" className="h-10 w-10 border-0" alt="CTI" />,
		link: "/cti",
		features: ["REST API access", "IP reputation scores", "Attack context", "SIEM integrations"],
		bestFor: "Best for enrichment, integrations, and investigations.",
	},
];

const HomePage = () => {
	return (
		<Layout title="Documentation" description="CrowdSec, the open-source & participative IPS">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="py-8 md:py-12 px-4">
					<div className="container max-w-5xl mx-auto">
						<div className="flex items-center justify-between gap-6">
							<div>
								<h1 className="text-2xl md:text-4xl font-bold mb-2">CrowdSec Documentation</h1>
								<p className="text-base md:text-lg text-gray-600 dark:text-gray-700 max-w-xl">
									Community-driven security that unifies detection, blocklists, and threat intel for modern
									infrastructure.
								</p>
							</div>
							<img alt="CrowdSec Logo" src="/img/crowdsec_logo.png" className="hidden md:block h-16 flex-shrink-0 border-0" />
						</div>
					</div>
				</section>

				{/* Product Selection */}
				<section className="pb-12 md:pb-20 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-center text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-900">
							Choose your starting point
						</h2>
						<p className="text-center text-gray-600 dark:text-gray-700 mb-8">
							Each path links to setup, how-tos, and reference docs.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{products.map((product) => (
								<ProductCard key={product.title} {...product} />
							))}
						</div>
					</div>
				</section>

				{/* Help Section */}
				<section className="py-12 md:py-16 px-4 bg-primary/5 border-t border-border">
					<div className="container max-w-3xl mx-auto text-center">
						<h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-900">
							Not sure where to start?
						</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-6">
							Answer a few questions and get a recommended path with install steps for your stack.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link to="https://start.crowdsec.net/">
								<Button size="lg" color="primary">
									Guided Setup
								</Button>
							</Link>
							<Link to="https://killercoda.com/iiamloz/scenario/crowdsec-setup">
								<Button size="lg" variant="outline">
									Try in a Sandbox
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Quick Links */}
				<section className="py-10 md:py-12 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-center text-sm font-medium mb-4 text-gray-500 dark:text-gray-600">Popular Docs</h2>
						<div className="flex flex-wrap justify-center gap-2">
							<Link to="/u/console/intro">
								<Button variant="outline" size="sm">
									Console
								</Button>
							</Link>
							<Link to="/docs/next/appsec/intro">
								<Button variant="outline" size="sm">
									AppSec / WAF
								</Button>
							</Link>
							<Link to="/docs/next/cscli/">
								<Button variant="outline" size="sm">
									CLI Reference
								</Button>
							</Link>
							<Link to="https://chatgpt.com/g/g-682c3a61a78081918417571116c2b563-crowdsec-documentation">
								<Button variant="outline" size="sm">
									Docs AI Assistant
								</Button>
							</Link>
							<Link to="https://www.crowdsec.net">
								<Button variant="outline" size="sm">
									About CrowdSec
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default HomePage;
