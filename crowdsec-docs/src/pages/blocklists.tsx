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

type IntegrationCardProps = {
	title: string;
	description: string;
	link: string;
	icon: React.ReactNode;
};

const IntegrationCard = ({ title, description, link, icon }: IntegrationCardProps): React.JSX.Element => (
	<Link href={link} className="hover:no-underline group">
		<div className="h-full border border-solid border-border rounded-lg p-4 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 flex items-center gap-4">
			<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">{icon}</div>
			<div>
				<h3 className="text-base font-semibold text-gray-900 dark:text-gray-900 group-hover:text-primary transition-colors mb-1">
					{title}
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-700 mb-0">{description}</p>
			</div>
		</div>
	</Link>
);

const gettingStarted: FeatureCardProps[] = [
	{
		title: "Introduction",
		description: "Learn what blocklists are and how they protect your infrastructure.",
		link: "/u/blocklists/intro",
		icon: "📖",
	},
	{
		title: "Getting Started",
		description: "Subscribe to blocklists and start protecting your systems.",
		link: "/u/blocklists/getting_started",
		icon: "🚀",
	},
	{
		title: "Browse Catalog",
		description: "Explore available blocklists and their coverage.",
		link: "/u/console/blocklists/catalog",
		icon: "📚",
	},
];

const integrationMethods: FeatureCardProps[] = [
	{
		title: "With Security Engine",
		description: "Add blocklist protection to your existing CrowdSec deployment.",
		link: "/u/blocklists/security_engine",
		icon: "/img/icons/radar-target.webp",
	},
	{
		title: "Direct Firewall Integration",
		description: "Push blocklists directly to firewalls without the Security Engine.",
		link: "/u/integrations/intro",
		icon: "/img/icons/shield-target.webp",
	},
];

const consoleFeatures: FeatureCardProps[] = [
	{
		title: "Blocklist Overview",
		description: "Monitor your subscribed blocklists and their status.",
		link: "/u/console/blocklists/overview",
		icon: "📊",
	},
	{
		title: "Subscription Management",
		description: "Manage your blocklist subscriptions and settings.",
		link: "/u/console/blocklists/subscription",
		icon: "⚙️",
	},
	{
		title: "Blocklist Details",
		description: "View detailed information about specific blocklists.",
		link: "/u/console/blocklists/details",
		icon: "🔍",
	},
];

const BlocklistsPage = () => {
	return (
		<Layout title="Blocklists" description="Subscribe to curated threat intelligence blocklists">
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
										<img src="/img/icons/shield.webp" className="h-7 w-7" alt="Blocklists" />
									</div>
									<h1 className="text-3xl md:text-4xl font-bold m-0 text-gray-900 dark:text-gray-900">Blocklists</h1>
								</div>
								<p className="text-lg text-gray-600 dark:text-gray-700 mb-6 max-w-2xl">
									Subscribe to curated threat intelligence feeds to protect your infrastructure. Block known malicious IPs
									without running your own detection—just subscribe and deploy.
								</p>
								<div className="flex gap-3">
									<Link to="/u/blocklists/intro">
										<Button color="primary">Read Introduction</Button>
									</Link>
									<Link to="/u/console/blocklists/catalog">
										<Button variant="outline">Browse Catalog</Button>
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
								Learn how blocklists work and start protecting your infrastructure in minutes.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{gettingStarted.map((item) => (
								<FeatureCard key={item.title} {...item} />
							))}
						</div>
					</div>
				</section>

				{/* Integration Methods Section */}
				<section className="py-10 md:py-14 px-4 bg-muted border-t border-border">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Integration Methods</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Choose how you want to deploy blocklists to your infrastructure.
						</p>
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
					</div>
				</section>

				{/* Console Features Section */}
				<section className="py-10 md:py-14 px-4">
					<div className="container max-w-5xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-900">Console Management</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-8 max-w-2xl">
							Manage and monitor your blocklist subscriptions from the CrowdSec Console.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{consoleFeatures.map((item) => (
								<FeatureCard key={item.title} {...item} />
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-10 md:py-14 px-4 bg-primary/5 border-t border-border">
					<div className="container max-w-3xl mx-auto text-center">
						<h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-900">Need Help?</h2>
						<p className="text-gray-600 dark:text-gray-700 mb-6">
							Join our community Discord for support, or check out the Console documentation for more details.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link to="https://discord.gg/crowdsec">
								<Button size="lg" variant="outline">
									Join Discord
								</Button>
							</Link>
							<Link to="/u/console/intro">
								<Button size="lg" variant="outline">
									Console Docs
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default BlocklistsPage;
