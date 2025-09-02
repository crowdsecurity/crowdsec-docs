import type * as Preset from "@docusaurus/preset-classic";
import type { NavbarItem } from "@docusaurus/theme-common";
import type { Config } from "@docusaurus/types";
import { themes } from "prism-react-renderer";

import tailwindPlugin from "./plugins/tailwind-config";
import { ctiApiSidebar, guidesSideBar, remediationSideBar } from "./sidebarsUnversioned";

const generateCurrentAndNextRedirects = (s) => [
	{
		from: `/docs/${s}`,
		to: `/u/${s}`,
	},
	{
		from: `/docs/next/${s}`,
		to: `/u/${s}`,
	},
];

function handleSidebarItems(items) {
	const arr = [];
	for (const item of items) {
		if (typeof item === "string") {
			arr.push(...generateCurrentAndNextRedirects(item));
		} else if (typeof item === "object") {
			arr.push(...backportRedirect(item));
		}
	}
	return arr;
}

const backportRedirect = (s) => {
	const arr = [];
	if (typeof s === "string") {
		arr.push(...generateCurrentAndNextRedirects(s));
		return arr;
	}
	const { id, link, items } = s;
	if (id) {
		arr.push(...generateCurrentAndNextRedirects(id));
	}
	if (link?.id) {
		arr.push(...generateCurrentAndNextRedirects(link.id));
	}
	if (items) {
		arr.push(...handleSidebarItems(items));
	}
	return arr;
};

const currentYear = new Date().getFullYear();

const ACADEMY_URL = `https://academy.crowdsec.net/courses?${
	process.env.NODE_ENV === "production" ? "utm_source=docs&utm_medium=menu&utm_campaign=top-menu&utm_id=academydocs" : ""
}`;

const NAVBAR_ITEMS: NavbarItem[] = [
	{
		type: "docsVersionDropdown",
		docsPluginId: "default",
		position: "left",
		dropdownActiveClassDisabled: true,
	},
	{
		label: "Security Stack",
		position: "left",
		items: [
			{ type: "doc", docId: "intro", label: "Security Engine" },
			{ to: "/u/bouncers/intro", label: "Remediation Components" },
			{
				type: "docsVersion",
				to: "/docs/next/appsec/intro",
				label: "Web Application Firewall (AppSec)",
			},
			{ type: "doc", docId: "cscli/cscli", label: "Cscli" },
			{ to: "/u/user_guides/intro", label: "Guides" },
			{
				type: "doc",
				label: "SDK",
				docId: "getting_started/sdk_intro",
			},
		],
	},
	{
		to: "/u/blocklists/getting_started",
		position: "left",
		label: "Blocklists",
	},
	{ to: "/u/cti_api/intro", position: "left", label: "CTI" },
	{ to: "/u/console/intro", position: "left", label: "Console" },
	{
		label: "Resources",
		position: "left",
		items: [
			{
				to: "/u/user_guides/intro",
				label: "Guides",
			},
			{
				to: ACADEMY_URL,
				label: "Academy",
			},
		],
	},
	{
		to: "/u/troubleshooting/intro",
		position: "left",
		label: "FAQ/Troubleshooting",
	},
	{
		href: "https://github.com/crowdsecurity/crowdsec",
		position: "right",
		className: "header-github-link header-icon-link invert dark:invert-0",
	},
	{
		href: "https://discord.gg/wGN7ShmEE8",
		position: "right",
		className: "header-discord-link invert dark:invert-0",
	},
	{
		href: "https://discourse.crowdsec.net",
		position: "right",
		className: "header-discourse-link invert dark:invert-0",
	},
	{
		href: "https://hub.crowdsec.net/",
		position: "right",
		className: "header-hub-link dark:invert",
	},
];

const FOOTER_LINKS = [
	{
		title: "Community",
		items: [
			{
				label: "GitHub",
				href: "https://github.com/crowdsecurity/crowdsec",
			},
			{ label: "Discourse", href: "https://discourse.crowdsec.net/" },
			{ label: "Discord", href: "https://discord.gg/crowdsec" },
			{ label: "Twitter", href: "https://twitter.com/crowd_security" },
			{ label: "LinkedIn", href: "https://www.linkedin.com/company/crowdsec/" },
			{ label: "YouTube", href: "https://www.youtube.com/@crowdsec" },
		],
	},
	{
		title: "More",
		items: [
			{ label: "Console", href: "https://app.crowdsec.net/" },
			{ label: "Hub", href: "https://hub.crowdsec.net/" },
			{ label: "Blog", href: "https://crowdsec.net/blog/" },
			{
				label: "Tutorial",
				href: "https://crowdsec.net/blog/category/tutorial/",
			},
			{ label: "Academy", href: "https://academy.crowdsec.net/" },
			{ label: "Custom GPT", href: "https://chatgpt.com/g/g-682c3a61a78081918417571116c2b563-crowdsec-documentation" },
		],
	},
];

const redirects = [
	...[
		...(Array.isArray(remediationSideBar) ? remediationSideBar : [remediationSideBar]),
		...(Array.isArray(ctiApiSidebar) ? ctiApiSidebar : [ctiApiSidebar]),
		...(Array.isArray(guidesSideBar) ? guidesSideBar : [guidesSideBar]),
	].flatMap(backportRedirect),
	{ from: "/docs/troubleshooting", to: "/u/troubleshooting/intro" },
	{ from: "/docs/next/troubleshooting", to: "/u/troubleshooting/intro" },
	{ from: "/docs/faq", to: "/u/troubleshooting/intro" },
	{ from: "/docs/next/faq", to: "/u/troubleshooting/intro" },
	{
		from: "/docs/next/getting_started/install_crowdsec",
		to: "/u/getting_started/installation/linux",
	},
	{
		from: "/docs/next/getting_started/install_crowdsec_freebsd",
		to: "/u/getting_started/installation/freebsd",
	},
	{
		from: "/docs/getting_started/install_crowdsec",
		to: "/u/getting_started/installation/linux",
	},
	{
		from: "/docs/getting_started/install_crowdsec_freebsd",
		to: "/u/getting_started/installation/freebsd",
	},
];

const config: Config = {
	future: {
		v4: {
			removeLegacyPostBuildHeadAttribute: true,
		},
		experimental_faster: true,
	},
	title: "CrowdSec",
	tagline: "CrowdSec - Real-time & crowdsourced protection against aggressive IPs",
	url: "https://docs.crowdsec.net",
	baseUrl: "/",
	onBrokenLinks: "warn",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/crowdsec_no_txt.png",
	organizationName: "CrowdSec",
	projectName: "crowdsec-docs",
	markdown: {
		mdx1Compat: {
			comments: true,
			admonitions: true,
			headingIds: true,
		},
	},
	stylesheets: [
		{
			href: "https://fonts.googleapis.com/icon?family=Material+Icons",
		},
	],
	themeConfig: {
		image: "img/crowdsec_og_image.png",
		colorMode: {
			defaultMode: "dark",
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},
		announcementBar: {
			id: "banner_docs",
			content:
				'<a target="_blank" href="https://doc.crowdsec.net/docs/next/appsec/intro" rel="noopener">Learn how to guard your webserver in real-time with the CrowdSec WAF</a>',
			backgroundColor: "#F8AB13",
			textColor: "#131132",
			isCloseable: true,
		},
		algolia: {
			appId: "PWTZ94KULF",
			apiKey: "31673122672f1eb819e16c87468e53b4",
			indexName: "crowdsec",
			contextualSearch: true,
		},
		zooming: {
			selector: ".markdown :not(a) > img",
			delay: 500,
			background: {
				light: "rgba(101,108,133,0.8)",
				dark: "rgba(9,10,17,0.8)",
			},
		},
		navbar: {
			title: "",
			logo: {
				alt: "CrowdSec",
				src: "img/crowdsec_logo.png",
			},
			items: NAVBAR_ITEMS,
		},
		footer: {
			style: "dark",
			links: FOOTER_LINKS,
			copyright: `Copyright © ${currentYear} CrowdSec`,
		},
		prism: {
			theme: themes.shadesOfPurple,
			darkTheme: themes.vsDark,
			additionalLanguages: ["bash", "yaml", "json"],
		},
	} satisfies Preset.ThemeConfig,
	presets: [
		[
			"@docusaurus/preset-classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					editUrl: "https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/",
					lastVersion: "current",
					versions: {
						"v1.7": {
							banner: "none",
							path: "/",
						},
						current: {
							path: "/next",
						},
					},
				},
				blog: {
					showReadingTime: true,
					editUrl: "https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],
	plugins: [
		"docusaurus-plugin-zooming",
		[
			"@docusaurus/plugin-content-docs",
			{
				id: "unversioned",
				path: "unversioned",
				routeBasePath: "u",
				sidebarPath: "./sidebarsUnversioned.ts",
			},
		],

		["./plugins/gtag/index.ts", { trackingID: "G-0TFBMNTDFQ" }],
		["@docusaurus/plugin-client-redirects", { redirects }],
		tailwindPlugin,
	],
};

export default config;
