import { FeatureCard, FeatureCardProps, IntegrationCard, ProductPageLayout, Section } from "../components/product-page";

const gettingStarted: FeatureCardProps[] = [
	{
		title: "Introduction",
		description: "Learn what blocklists are and how they stop known bad IPs.",
		link: "/u/blocklists/intro",
		icon: "📖",
	},
	{
		title: "Getting Started",
		description: "Subscribe and start blocking in minutes.",
		link: "/u/blocklists/getting_started",
		icon: "🚀",
	},
	{
		title: "Browse Catalog",
		description: "Explore coverage, categories, and sources.",
		link: "/u/console/blocklists/catalog",
		icon: "📚",
	},
];

const integrationMethods: FeatureCardProps[] = [
	{
		title: "With Security Engine",
		description: "Add blocklists to your existing CrowdSec deployment.",
		link: "/u/blocklists/security_engine",
		icon: "/img/icons/radar-target.webp",
	},
	{
		title: "Direct Firewall Integration",
		description: "Push blocklists directly to firewalls and gateways.",
		link: "/u/integrations/intro",
		icon: "/img/icons/shield-target.webp",
	},
];

const consoleFeatures: FeatureCardProps[] = [
	{
		title: "Blocklist Overview",
		description: "Monitor coverage and update status.",
		link: "/u/console/blocklists/overview",
		icon: "📊",
	},
	{
		title: "Subscription Management",
		description: "Manage subscriptions, quotas, and settings.",
		link: "/u/console/blocklists/subscription",
		icon: "⚙️",
	},
	{
		title: "Blocklist Details",
		description: "Inspect sources, scope, and blocklist details.",
		link: "/u/console/blocklists/details",
		icon: "🔍",
	},
];

const BlocklistsPage = () => {
	return (
		<ProductPageLayout
			title="Blocklists"
			metaDescription="Subscribe to curated threat intelligence blocklists"
			icon="/img/icons/shield.webp"
			description="Subscribe to curated threat intelligence feeds to block known malicious IPs across your infrastructure. Deploy in minutes to firewalls or alongside the Security Engine."
			heroButtons={[
				{ label: "Get Started", link: "/u/blocklists/intro" },
				{ label: "Browse Catalog", link: "/u/console/blocklists/catalog", variant: "outline" },
			]}
			helpDescription="Get help in Discord or dive into Console docs for setup and monitoring."
			helpButtons={[
				{ label: "Join Discord", link: "https://discord.gg/crowdsec" },
				{ label: "Console Docs", link: "/u/console/intro" },
			]}
		>
			<Section title="Getting Started" description="Learn how blocklists work and start blocking in minutes.">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{gettingStarted.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>

			<Section
				title="Integration Methods"
				description="Choose how you want to deploy blocklists, with the Security Engine or directly to firewalls."
				variant="muted"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{integrationMethods.map((item) => (
						<IntegrationCard
							key={item.title}
							title={item.title}
							description={item.description}
							link={item.link}
							icon={
								item.icon.startsWith("/") ? (
									<img src={item.icon} alt={item.title} className="h-6 w-6" />
								) : (
									<span className="text-2xl">{item.icon}</span>
								)
							}
						/>
					))}
				</div>
			</Section>

			<Section title="Console Management" description="Track coverage, updates, and subscriptions from the CrowdSec Console.">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{consoleFeatures.map((item) => (
						<FeatureCard key={item.title} {...item} />
					))}
				</div>
			</Section>
		</ProductPageLayout>
	);
};

export default BlocklistsPage;
