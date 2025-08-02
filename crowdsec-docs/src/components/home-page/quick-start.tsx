import ForwardIcon from "@mui/icons-material/Forward";
import HubIcon from "@mui/icons-material/Hub";
import cibApple from "@site/static/img/logo/apple-colored.svg";
import cibDocker from "@site/static/img/logo/docker-colored.svg";
import cibFreebsd from "@site/static/img/logo/freebsd-colored.svg";
import cibKubernetes from "@site/static/img/logo/kubernetes-colored.svg";
import cibLinux from "@site/static/img/logo/linux-colored.svg";
import cibWindows from "@site/static/img/logo/windows-colored.svg";
import opnsenseLogo from "@site/static/img/logo-opnsense.svg";
import pfSenseLogo from "@site/static/img/logo-pfsense.svg";
import whmLogo from "@site/static/img/logo-whm.svg";
import React from "react";
import { HomePageItem } from "./home-item";

type StaticData = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	text: string;
	link: string;
	description?: string;
};

const singleServerSetup: StaticData[] = [
	{
		icon: cibLinux,
		text: "Linux",
		link: "/u/getting_started/installation/linux",
	},
	{
		icon: cibWindows,
		text: "Windows",
		link: "/u/getting_started/installation/windows",
	},
	{
		icon: cibFreebsd,
		text: "FreeBSD",
		link: "/u/getting_started/installation/freebsd",
	},
	{
		icon: cibApple,
		text: "macOS",
		link: "/u/getting_started/installation/macos",
	},
	{
		icon: cibDocker,
		text: "Docker",
		link: "/u/getting_started/installation/docker",
	},
	{
		icon: cibKubernetes,
		text: "Kubernetes",
		link: "/u/getting_started/installation/kubernetes",
	},
	{
		icon: opnsenseLogo,
		text: "OPNsense",
		link: "/u/getting_started/installation/opnsense",
	},
	{
		icon: pfSenseLogo,
		text: "pfSense",
		link: "/u/getting_started/installation/pfsense",
	},
	{
		icon: whmLogo,
		text: "WHM",
		link: "/u/getting_started/installation/whm",
	},
	// Experimental, not linking to it
	// {
	//     icon: cloudwaysLogo,
	//     text: "Cloudways",
	//     link: "/u/getting_started/installation/cloudways",
	// },
];

const multiServerSetup: StaticData[] = [
	{
		icon: HubIcon,
		text: "Central LAPI",
		link: "/u/user_guides/multiserver_setup",
		description: "Use a single LAPI to collect alerts.",
	},
	{
		icon: ForwardIcon,
		text: "Log Centralization",
		link: "/u/user_guides/log_centralization",
		description: "Use Rsyslog to centralize logs.",
	},
];

const QuickStart = (): React.JSX.Element => {
	return (
		<section>
			<div className="text-left">
				<h2 className="mb-1">Select your environment</h2>
				<p className="max-w-xl text-sm text-foreground/70">We can secure your stack. Just select your platform and get started.</p>
			</div>

			<div className="text-left">
				<h4 className="mb-1">Single Server Setup</h4>
				<p className="max-w-xl text-sm text-foreground/70">
					Install CrowdSec on a single server. This is the simplest way to get started with CrowdSec.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				{singleServerSetup.map((props) => (
					<HomePageItem title={props.text} description="" link={props.link} icon={props.icon} key={props.text} />
				))}
			</div>
			<p className="text-xs mt-1 mb-4 text-foreground/70 text-right">
				*Logos and trademarks, such as the logos above, are the property of their respective owners and are used here for
				identification purposes only.
			</p>
			<div className="text-left">
				<h4 className="mb-1">Multi-Server Setup</h4>
				<p className="max-w-xl text-sm text-foreground/70">
					Use CrowdSec within a multi-server environment. This is the advanced way to get started.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				{multiServerSetup.map((props) => (
					<HomePageItem title={props.text} description={props.description} link={props.link} icon={props.icon} key={props.text} />
				))}
			</div>
		</section>
	);
};

export default QuickStart;
