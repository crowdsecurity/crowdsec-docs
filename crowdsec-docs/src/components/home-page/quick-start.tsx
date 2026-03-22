import ForwardIcon from "@mui/icons-material/Forward";
import HubIcon from "@mui/icons-material/Hub";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
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
			<div className="text-left mb-6">
				<h2 className="mb-2 text-2xl md:text-3xl font-semibold">Installation</h2>
				<p className="max-w-2xl text-base text-foreground/70">
					Choose your platform to install the CrowdSec Security Engine. Each guide walks you through setup, configuration, and
					connecting to the CrowdSec Console.
				</p>
			</div>

			{/* Single Server */}
			<div className="text-left mt-8">
				<h3 className="mb-1 text-lg font-medium text-primary">Single Server</h3>
				<p className="max-w-xl text-sm text-foreground/60 mb-4">
					Standalone installation for protecting a single machine or service.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
				{singleServerSetup.map((props) => (
					<HomePageItem title={props.text} description="" link={props.link} icon={props.icon} key={props.text} />
				))}
			</div>

			{/* Healthcheck */}
			<div className="mt-4">
				<HomePageItem
					title="Installation Healthcheck"
					description="Verify your installation is working correctly"
					link="/u/getting_started/health_check"
					icon={MonitorHeartIcon}
					key="Installation Healthcheck"
				/>
			</div>

			<p className="text-xs mt-2 text-foreground/50 text-right">*Logos and trademarks are property of their respective owners.</p>

			{/* Multi-Server */}
			<div className="text-left mt-10">
				<h3 className="mb-1 text-lg font-medium text-primary">Multi-Server</h3>
				<p className="max-w-xl text-sm text-foreground/60 mb-4">
					Distributed deployment for organizations managing multiple servers or infrastructure.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{multiServerSetup.map((props) => (
					<HomePageItem title={props.text} description={props.description} link={props.link} icon={props.icon} key={props.text} />
				))}
			</div>
		</section>
	);
};

export default QuickStart;
