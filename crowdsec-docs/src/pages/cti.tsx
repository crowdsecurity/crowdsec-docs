import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";
import { Button } from "../ui/button";

type FeatureCardProps = {
	title: string;
	description: string;
	link: string;
	icon: string;
};

const FeatureCard = ({ title, description, link, icon }: FeatureCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="h-full border border-solid border-border rounded-lg p-5 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200">
			<div className="text-3xl mb-3">{icon.startsWith("/") ? <img src={icon} alt={title} className="h-8 w-8" /> : icon}</div>
			<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors">
				{title}
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-700 mb-0">{description}</p>
		</div>
	</Link>
);

type IntegrationItemProps = {
	title: string;
	link: string;
};

const IntegrationItem = ({ title, link }: IntegrationItemProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="border border-solid border-border rounded-lg px-4 py-3 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200">
			<span className="text-sm font-medium text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors">{title}</span>
		</div>
	</Link>
);

const gettingStarted: FeatureCardProps[] = [
	{
		title: "Introduction",
		description: "Learn what the CTI API offers and how it can enhance your security.",
		link: "/u/cti_api/intro",
		icon: "📖",
	},
	{
		title: "Console Quickstart",
		description: "Use the web interface to search and explore threat intelligence.",
		link: "/u/cti_api/getting_started",
		icon: "🖥️",
	},
	{
		title: "API Quickstart",
		description: "Integrate CTI data programmatically into your applications.",
		link: "/u/cti_api/api_getting_started",
		icon: "🔌",
	},
];

const coreFeatures: FeatureCardProps[] = [
	{
		title: "IP Reports",
		description: "Get detailed threat intelligence reports for any IP address.",
		link: "/u/cti_api/ip_report",
		icon: "📋",
	},
	{
		title: "Search Queries",
		description: "Search the threat intelligence database with powerful queries.",
		link: "/u/cti_api/search_queries",
		icon: "🔍",
	},
	{
		title: "Advanced Search",
		description: "Build complex queries to find specific threat patterns.",
		link: "/u/cti_api/advanced_search",
		icon: "🎯",
	},
	{
		title: "CVE Explorer",
		description: "Explore CVE data and see which IPs exploit specific vulnerabilities.",
		link: "/u/cti_api/cve_explorer",
		icon: "🛡️",
	},
];

const taxonomy: FeatureCardProps[] = [
	{
		title: "Taxonomy Overview",
		description: "Understand how threat data is categorized and classified.",
		link: "/u/cti_api/taxonomy/intro",
		icon: "📊",
	},
	{
		title: "Reputation Scores",
		description: "Learn how IP reputation scores are calculated.",
		link: "/u/cti_api/taxonomy/scores",
		icon: "⭐",
	},
	{
		title: "Behaviors",
		description: "Explore the types of malicious behaviors we track.",
		link: "/u/cti_api/taxonomy/behaviors",
		icon: "🔬",
	},
	{
		title: "Classifications",
		description: "Understand threat actor classifications and categories.",
		link: "/u/cti_api/taxonomy/classifications",
		icon: "🏷️",
	},
];

const integrations: IntegrationItemProps[] = [
	{ title: "Splunk SIEM", link: "/u/cti_api/api_integration/integration_splunk_siem" },
	{ title: "Splunk SOAR", link: "/u/cti_api/api_integration/integration_splunk_soar" },
	{ title: "Microsoft Sentinel", link: "/u/cti_api/api_integration/integration_ms_sentinel" },
	{ title: "Security Copilot", link: "/u/cti_api/api_integration/integration_securitycopilot" },
	{ title: "Palo Alto XSOAR", link: "/u/cti_api/api_integration/integration_paloalto_xsoar" },
	{ title: "IBM QRadar", link: "/u/cti_api/api_integration/integration_qradar" },
	{ title: "TheHive", link: "/u/cti_api/api_integration/integration_thehive" },
	{ title: "OpenCTI", link: "/u/cti_api/api_integration/integration_opencti" },
	{ title: "MISP", link: "/u/cti_api/api_integration/integration_misp" },
	{ title: "Maltego", link: "/u/cti_api/api_integration/integration_maltego" },
	{ title: "Sekoia XDR", link: "/u/cti_api/api_integration/integration_sekoia_xdr" },
	{ title: "IntelOwl", link: "/u/cti_api/api_integration/integration_intelowl" },
];

const CTIPage = () => {
	return (
		<Layout title="CTI API" description="Query CrowdSec's threat intelligence database">
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
										<img src="/img/icons/world.webp" className="h-7 w-7" alt="CTI API" />
									</div>
									<h1 className="text-3xl md:text-4xl font-bold m-0 text-gray-900 dark:text-gray-900">CTI API</h1>
								</div>
								<p className="text-lg text-gray-600 dark:text-gray-700 mb-6 max-w-2xl">
									Query our threat intelligence database to enrich your security workflows. Get IP reputation scores,
									attack history, and behavioral data from our global network of sensors.
								</p>
								<div className="flex gap-3">
									<Link to="/u/cti_api/intro">
										<Button color="primary">Read Introduction</Button>
									</Link>
									<Link to="/u/cti_api/api_getting_started">
										<Button variant="outline">API Quickstart</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Getting Started Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<div className="text-left mb-6">
							<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Getting Started</h2>
							<p className="text-gray-600 dark:text-gray-700 max-w-2xl">
								Choose how you want to access threat intelligence—via web console or API.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{gettingStarted.map((item) => (
								<FeatureCard key={item.title} {...item} />
							))}
						</div>
					</div>
				</section>

				{/* Core Features Section */}
				<section className="py-10 md:py-14 px-4 bg-muted border-t border-border">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Core Features</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Explore the threat intelligence capabilities available through the CTI API.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{coreFeatures.map((item) => (
								<FeatureCard key={item.title} {...item} />
							))}
						</div>
					</div>
				</section>

				{/* Taxonomy Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Data Taxonomy</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Understand how threat data is structured, scored, and classified.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{taxonomy.map((item) => (
								<FeatureCard key={item.title} {...item} />
							))}
						</div>
					</div>
				</section>

				{/* Integrations Section */}
				<section className="py-10 md:py-14 px-4 bg-muted border-t border-border">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Integrations</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Connect CTI data to your existing security tools and workflows.
						</p>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
							{integrations.map((item) => (
								<IntegrationItem key={item.title} {...item} />
							))}
						</div>
						<div className="mt-4 text-center">
							<Link to="/u/cti_api/api_integration/integration_intro" className="text-sm text-primary hover:underline">
								View all integrations →
							</Link>
						</div>
					</div>
				</section>

				{/* Resources Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Resources</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Additional documentation and references for the CTI API.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FeatureCard
								title="API Reference"
								description="Complete API documentation with endpoints and parameters."
								link="/u/cti_api/api_introduction"
								icon="📚"
							/>
							<FeatureCard
								title="FAQ"
								description="Common questions about the CTI API and its capabilities."
								link="/u/cti_api/faq"
								icon="❓"
							/>
							<FeatureCard
								title="Chrome Extension"
								description="Check IP reputation directly from your browser."
								link="/u/cti_api/api_integration/integration_chrome"
								icon="🌐"
							/>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-10 md:py-14 px-4 bg-primary/5 border-t border-border">
					<div className="container max-w-3xl mx-auto text-center">
						<h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-900">Need Help?</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-6">
							Join our community Discord for support, or check out the FAQ for common questions.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link to="https://discord.gg/crowdsec">
								<Button size="lg" variant="outline">
									Join Discord
								</Button>
							</Link>
							<Link to="/u/cti_api/faq">
								<Button size="lg" variant="outline">
									View FAQ
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default CTIPage;
