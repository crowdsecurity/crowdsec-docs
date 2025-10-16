import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import React from "react";
import GetToKnowUs from "../components/home-page/get-to-know-us";
import QuickStart from "../components/home-page/quick-start";
import { Button } from "../ui/button";

const HomePageHeader = (): React.JSX.Element => {
	return (
		<section className="flex-1 p-2 md:px-0 md:py-16 text-center relative overflow-hidden">
			{/* <div className="block absolute top-0 left-1/2 -translate-x-1/2 h-80 w-full bg-landing bg-cover bg-center z-0 opacity-50 " /> */}
			<div className="container space-y-4 md:space-y-12 z-20">
				<div>
					<div className="flex gap-4 justify-between flex-col-reverse md:flex-row items-center md:items-start">
						<div className="text-left w-full">
							<h1 className="mb-1">Welcome to the CrowdSec Documentation</h1>
							<p className="max-w-xl text-foreground/70 text-sm">
								CrowdSec provides open source solution for detecting and blocking malicious IPs, safeguarding both
								infrastructure and application security.
							</p>
						</div>
						<img alt="CrowdSec Logo" src="/img/crowdsec_logo.png" className="h-20 w-28 md:h-24 md:w-auto" />
					</div>
					<div className="flex flex-col md:flex-row items-start gap-2">
						<Link to="/u/getting_started/intro" className="w-full md:w-auto">
							<Button color="primary" className="w-full md:w-auto">
								🚀 Quick Guides
							</Button>
						</Link>
						<div className="flex flex-row gap-2 w-full md:w-auto">
							<Link to="https://app.crowdsec.net/" className="flex-1 md:flex-none">
								<Button variant="secondary" className="w-full md:w-auto">
									👨‍💻 Explore the Console
								</Button>
							</Link>
							<Link to="https://killercoda.com/iiamloz/scenario/crowdsec-setup" className="flex-1 md:flex-none">
								<Button variant="secondary" className="w-full md:w-auto">
									🛠️ Online Sandbox
								</Button>
							</Link>
							<Link to="https://start.crowdsec.net/" className="flex-1 md:flex-none">
								<Button variant="secondary" className="w-full md:w-auto">
									💡 Not sure where to start?
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<QuickStart />

				<GetToKnowUs />
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
