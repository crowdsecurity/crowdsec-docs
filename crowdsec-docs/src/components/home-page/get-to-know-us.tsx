import React from "react";
import { HomePageItem } from "./home-item";

type StaticData = {
	icon: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
	title: string;
	description: string;
	link: string;
};

const staticData: StaticData[] = [
	{
		icon: () => <img src="/img/crowdsec_logo.png" className="h-6 w-9" alt="CrowdSec logo" />,
		title: "What is CrowdSec?",
		description: "Data curated solution with a bunch of millions IPs detected by our large community.",
		link: "https://www.crowdsec.net",
	},
	{
		icon: () => <img src="/img/icons/radar-target.webp" className="h-6 w-6" alt="security engines" />,
		title: "Security Engines",
		description: "Secure yourself.",
		link: "/docs/intro",
	},
	{
		icon: () => <span className="text-2xl">🖥️</span>,
		title: "CrowdSec Console",
		description: "Manage and monitor your security.",
		link: "/u/console/intro",
	},
	{
		icon: () => <span className="text-2xl">🧑🏻‍💻</span>,
		title: "CrowdSec CLI",
		description: "Use our command line interface.",
		link: "/docs/cscli/",
	},
	{
		icon: () => <img src="/img/icons/waf.webp" className="h-6 w-6" alt="Web application firewall" />,
		title: "CrowdSec WAF",
		description: "Protect your web applications.",
		link: "/docs/appsec/intro",
	},
	{
		icon: () => <img src="/img/icons/shield.webp" className="h-6 w-6" alt="blocklists" />,
		title: "Blocklists",
		description: "Block thousands of IPs.",
		link: "/u/blocklists/intro",
	},
	{
		icon: () => <img src="/img/icons/world.webp" className="h-6 w-6" alt="world API" />,
		title: "APIs",
		description: "Integrate with your tools.",
		link: "/u/cti_api/intro",
	},
];

const GetToKnowUs = (): React.JSX.Element => {
	return (
		<section>
			<h2 className="text-left text-white">Get to know us!</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="md:col-span-2">
					<HomePageItem
						title={staticData[0].title}
						description={staticData[0].description}
						link={staticData[0].link}
						icon={staticData[0].icon}
					/>
				</div>
				{staticData.slice(1, staticData.length).map((props) => (
					<HomePageItem
						title={props.title}
						description={props.description}
						link={props.link}
						icon={props.icon}
						key={props.title}
					/>
				))}
			</div>
		</section>
	);
};

export default GetToKnowUs;
