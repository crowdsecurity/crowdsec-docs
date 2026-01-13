import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";
import GetToKnowUs from "../components/home-page/get-to-know-us";
import QuickStart from "../components/home-page/quick-start";
import { Button } from "../ui/button";

const HomePageHeader = (): React.JSX.Element => {
	return (
		<section className="flex-1 p-4 md:px-0 md:py-12 text-center relative overflow-hidden">
			<div className="container space-y-8 md:space-y-16 z-20">
				{/* Hero Section */}
				<div className="py-4 md:py-8">
					<div className="flex gap-6 justify-between flex-col-reverse md:flex-row items-center md:items-start">
						<div className="text-left w-full">
							<h1 className="mb-2 text-3xl md:text-4xl font-bold">CrowdSec Documentation</h1>
							<p className="max-w-2xl text-foreground/70 text-base md:text-lg leading-relaxed">
								Learn how to detect and block malicious IPs with our open-source security engine. Protect your
								infrastructure and applications with community-powered threat intelligence.
							</p>
						</div>
						<img alt="CrowdSec Logo" src="/img/crowdsec_logo.png" className="h-16 w-24 md:h-20 md:w-auto flex-shrink-0" />
					</div>
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
						<Link to="/u/getting_started/intro" className="w-full sm:w-auto">
							<Button size="lg" color="primary" className="w-full">
								Get Started
							</Button>
						</Link>
						<Link to="https://start.crowdsec.net/" className="w-full sm:w-auto">
							<Button size="lg" variant="outline" className="w-full">
								Help Me Choose
							</Button>
						</Link>
					</div>
				</div>

				{/* Installation Section */}
				<div className="border-t border-border/50 pt-8 md:pt-12">
					<QuickStart />
				</div>

				{/* Explore Section */}
				<div className="border-t border-border/50 pt-8 md:pt-12">
					<GetToKnowUs />
				</div>
			</div>
		</section>
	);
};

const HomePage = () => {
	return (
		<Layout title={`Documentation`} description="CrowdSec, the open-source & participative IPS">
			<HomePageHeader />
		</Layout>
	);
};

export default HomePage;
