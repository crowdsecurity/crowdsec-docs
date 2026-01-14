import Link from "@docusaurus/Link";
import {
	FeatureCard,
	FeatureCardProps,
	IntegrationItem,
	IntegrationItemProps,
	ProductPageLayout,
	Section,
} from "../components/product-page";

const gettingStarted: FeatureCardProps[] = [
	{
		title: "Introduction",
		description: "Learn what the CTI API offers and how to use it.",
		link: "/u/cti_api/intro",
		icon: "📖",
	},
	{
		title: "Console Quickstart",
		description: "Use the web interface to search and explore CTI data.",
		link: "/u/cti_api/getting_started",
		icon: "🖥️",
	},
	{
		title: "API Quickstart",
		description: "Integrate CTI data programmatically into your workflows.",
		link: "/u/cti_api/api_getting_started",
		icon: "🔌",
	},
];

const coreFeatures: FeatureCardProps[] = [
	{
		title: "IP Reports",
		description: "Get full context for any IP, including reputation and activity.",
		link: "/u/cti_api/ip_report",
		icon: "📋",
	},
	{
		title: "Search Queries",
		description: "Search CTI data with filters and query operators.",
		link: "/u/cti_api/search_queries",
		icon: "🔍",
	},
	{
		title: "Advanced Search",
		description: "Build complex queries to spot patterns at scale.",
		link: "/u/cti_api/advanced_search",
		icon: "🎯",
	},
	{
		title: "CVE Explorer",
		description: "Explore CVEs and see active exploitation by IP.",
		link: "/u/cti_api/cve_explorer",
		icon: "🛡️",
	},
];

const taxonomy: FeatureCardProps[] = [
	{
		title: "Taxonomy Overview",
		description: "Learn how CTI data is structured and labeled.",
		link: "/u/cti_api/taxonomy/intro",
		icon: "📊",
	},
	{
		title: "Reputation Scores",
		description: "See how scores are computed and what they mean.",
		link: "/u/cti_api/taxonomy/scores",
		icon: "⭐",
	},
	{
		title: "Behaviors",
		description: "Explore the behaviors we track across attacks.",
		link: "/u/cti_api/taxonomy/behaviors",
		icon: "🔬",
	},
	{
		title: "Classifications",
		description: "Understand threat classifications and categories.",
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

const resources: FeatureCardProps[] = [
	{
		title: "API Reference",
		description: "Full API reference with endpoints and parameters.",
		link: "https://crowdsecurity.github.io/cti-api/",
		icon: "📚",
	},
	{
		title: "FAQ",
		description: "Common questions about access, limits, and data.",
		link: "/u/cti_api/faq",
		icon: "❓",
	},
	{
		title: "Chrome Extension",
		description: "Check IP reputation directly in your browser.",
		link: "/u/cti_api/api_integration/integration_chrome",
		icon: "🌐",
	},
];

const CTIPage = () => {
	return (
		<ProductPageLayout
			title="CrowdSec CTI"
			metaDescription="Query CrowdSec's threat intelligence database"
			icon="/img/icons/world.webp"
			description="Query CrowdSec threat intelligence to enrich investigations and automate lookups. Get IP reputation, attack history, and behavior data from a global sensor network."
			heroButtons={[
				{ label: "Get Started", link: "/u/cti_api/intro" },
				{ label: "API Quickstart", link: "/u/cti_api/api_getting_started", variant: "outline" },
			]}
			helpDescription="Get help in Discord or check the FAQ for quick answers."
			helpButtons={[
				{ label: "Join Discord", link: "https://discord.gg/crowdsec" },
				{ label: "View FAQ", link: "/u/cti_api/faq" },
			]}
		>
			<Section title="Getting Started" description="Choose your access path: web console for exploration or API for automation.">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{gettingStarted.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>

			<Section title="Core Features" description="Explore the core capabilities available through the CTI API." variant="muted">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{coreFeatures.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>

			<Section title="Data Taxonomy" description="Understand how CTI data is structured, scored, and classified.">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{taxonomy.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>

			<Section title="Integrations" description="Connect CTI data to your SIEM, SOAR, and security workflows." variant="muted">
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
			</Section>

			<Section title="Resources" description="Docs to help you integrate, automate, and troubleshoot CTI.">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{resources.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>
		</ProductPageLayout>
	);
};

export default CTIPage;
