import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

type SidebarConfig = SidebarsConfig[string];

/** IF you make significant changes to the nav bar or side bars
 * make sure to have proper mapping in crowdsec-docs/src/sectionMap.ts */
const sidebarsUnversionedConfig: SidebarConfig = {
	ctiApiSidebar: [
		{
			type: "doc",
			label: "Introduction",
			id: "cti_api/intro",
		},
		// ── EXPLORE ──────────────────────────────────────────────────────────
		{
			type: "html",
			value: "<span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>Explore</span>",
			defaultStyle: false,
		},
		{
			type: "link",
			label: "Web UI",
			href: "/u/console/ip_reputation/intro",
			customProps: {
				tag: "otherSection",
			},
		},
		{
			type: "link",
			label: "Live Exploit Tracker",
			href: "/u/tracker_api/intro",
			customProps: {
				tag: "otherSection",
			},
		},
		// ── API ──────────────────────────────────────────────────────────────
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' /> <span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>API</span>",
			defaultStyle: false,
		},
		{
			type: "doc",
			label: "API Access",
			id: "cti_api/api_introduction",
		},
		{
			type: "category",
			label: "Integrations",
			link: {
				type: "doc",
				id: "cti_api/api_integration/integration_intro",
			},
			items: [
				"cti_api/api_integration/integration_ipdex",
				"cti_api/api_integration/integration_chrome",
				"cti_api/api_integration/integration_gigasheet",
				"cti_api/api_integration/integration_intelowl",
				"cti_api/api_integration/integration_maltego",
				"cti_api/api_integration/integration_misp",
				"cti_api/api_integration/integration_ms_sentinel",
				"cti_api/api_integration/integration_msticpy",
				"cti_api/api_integration/integration_opencti",
				"cti_api/api_integration/integration_paloalto_xsoar",
				"cti_api/api_integration/integration_qradar",
				"cti_api/api_integration/integration_securitycopilot",
				"cti_api/api_integration/integration_sekoia_xdr",
				"cti_api/api_integration/integration_splunk_siem",
				"cti_api/api_integration/integration_splunk_soar",
				"cti_api/api_integration/integration_thehive",
			],
		},
		// ── TECHNICAL DOC ─────────────────────────────────────────────────────
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' /> <span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>Technical Doc</span>",
			defaultStyle: false,
		},
		{
			type: "category",
			label: "Taxonomy",
			items: [
				"cti_api/taxonomy/intro",
				"cti_api/taxonomy/cti_object",
				"cti_api/taxonomy/scores",
				"cti_api/taxonomy/scenarios",
				"cti_api/taxonomy/behaviors",
				"cti_api/taxonomy/classifications",
				"cti_api/taxonomy/false_positives",
				"cti_api/taxonomy/benign",
			],
		},
		{
			type: "doc",
			label: "Advanced Query Syntax",
			id: "cti_api/search_queries",
		},
		{
			type: "link",
			label: "Swagger ↗",
			href: "https://crowdsecurity.github.io/cti-api/",
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
		},
		{
			type: "doc",
			label: "FAQ",
			id: "cti_api/faq",
		},
	],
	trackerApiSidebar: [
		{
			type: "doc",
			label: "Overview",
			id: "tracker_api/intro",
		},
		{
			type: "category",
			label: "Understanding the Data",
			items: [
				{
					type: "doc",
					label: "Scores & Ratings",
					id: "tracker_api/scores",
				},
				{
					type: "doc",
					label: "Exploitation Phases",
					id: "tracker_api/exploitation_phases",
				},
				{
					type: "doc",
					label: "CrowdSec Analysis",
					id: "tracker_api/crowdsec_analysis",
				},
				{
					type: "doc",
					label: "Threat Context",
					id: "tracker_api/threat_context",
				},
				{
					type: "doc",
					label: "Reconnaissance Rules vs CVEs",
					id: "tracker_api/fingerprints_vs_cves",
				},
			],
		},
		{
			type: "doc",
			label: "Web Interface",
			id: "tracker_api/web_interface",
		},
		{
			type: "category",
			label: "API",
			items: [
				{
					type: "doc",
					label: "Authentication & Setup",
					id: "tracker_api/api_authentication",
				},
				{
					type: "doc",
					label: "CVEs",
					id: "tracker_api/api_cves",
				},
				{
					type: "doc",
					label: "Reconnaissance / Fingerprints",
					id: "tracker_api/api_fingerprints",
				},
				{
					type: "doc",
					label: "Vendors, Products & Tags",
					id: "tracker_api/api_lookups",
				},
				{
					type: "doc",
					label: "Integrations & Blocklists",
					id: "tracker_api/api_integrations",
				},
				{
					type: "doc",
					label: "SDKs & Libraries",
					id: "tracker_api/api_sdks",
				},
				{
					type: "link",
					label: "API Reference",
					href: "https://admin.api.crowdsec.net/v1/docs#tag/Cves",
				},
			],
		},
		{
			type: "category",
			label: "Guides",
			items: [
				{
					type: "doc",
					label: "Triage Workflow",
					id: "tracker_api/guide_triage",
				},
				{
					type: "doc",
					label: "Proactive Monitoring",
					id: "tracker_api/guide_proactive",
				},
			],
		},
	],
	consoleSidebar: [
		{
			type: "doc",
			label: "Introduction",
			id: "console/intro",
		},
		{
			type: "doc",
			label: "Getting Started",
			id: "console/getting_started",
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
			defaultStyle: false,
		},
		// ── Security Stack ──────────────────────────────────────────────────────────
		{
			type: "html",
			value: "<span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>Security Stack</span>",
			defaultStyle: false,
		},
		{
			type: "category",
			label: "Security Engine",
			link: {
				type: "doc",
				id: "console/security_engines/dashboard",
			},
			items: [
				{
					type: "doc",
					label: "Dashboard",
					id: "console/security_engines/dashboard",
				},
				{
					type: "doc",
					label: "Filter And Sort",
					id: "console/security_engines/filter_and_sort",
				},
				{
					type: "doc",
					label: "Pending Security Engines",
					id: "console/security_engines/pending_security_engines",
				},
				{
					type: "doc",
					label: "Name and Tags",
					id: "console/security_engines/name_and_tags",
				},
				{
					type: "doc",
					label: "Transferring an Engine",
					id: "console/security_engines/transfer_engine",
				},
				{
					type: "doc",
					label: "Archiving an Engine",
					id: "console/security_engines/archive_engine",
				},
				{
					type: "doc",
					label: "Removing an Engine",
					id: "console/security_engines/remove_engine",
				},
				{
					type: "doc",
					label: "Troubleshooting Hints",
					id: "console/security_engines/troubleshooting",
				},
				{
					type: "doc",
					label: "Am I Under Attack",
					id: "console/security_engines/am_i_under_attack",
					customProps: {
						tag: "premium",
					},
				},
				{
					type: "doc",
					label: "Select multiple organizations 🧪",
					id: "console/security_engines/select_multiple_organizations",
				},
				{
					type: "doc",
					label: "Details page",
					id: "console/security_engines/details_page",
				},
			],
		},
		{
			type: "category",
			label: "Alerts",
			link: {
				type: "doc",
				id: "console/alerts/intro",
			},
			items: [
				{
					type: "doc",
					label: "Introduction",
					id: "console/alerts/intro",
				},
				{
					type: "doc",
					label: "Visualizer",
					id: "console/alerts/visualizer",
				},
				{
					type: "doc",
					label: "Alerts analysis",
					id: "console/alerts/alerts_analysis",
				},
				{
					type: "doc",
					label: "Alerts contexts",
					id: "console/alerts/alerts_contexts",
				},
				{
					type: "doc",
					label: "Background Noise",
					id: "console/alerts/background_noise",
					customProps: {
						tag: "premium",
					},
				},
				{
					type: "doc",
					label: "Quotas",
					id: "console/alerts/quotas",
				},
			],
		},
		{
			id: "console/remediation_sync",
			type: "doc",
			label: "Remediation Sync",
			customProps: {
				tag: "premium",
			},
		},
		{
			type: "doc",
			label: "Remediation Metrics",
			id: "console/remediation_metrics",
		},
		{
			type: "category",
			label: "Decision",
			link: {
				type: "doc",
				id: "console/decisions/decisions_intro",
			},
			items: [
				{
					type: "doc",
					id: "console/decisions/decisions_management",
					label: "Management",
					customProps: {
						tag: "premium",
					},
				},
			],
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
			defaultStyle: false,
		},
		// ── Blocklist & Allowlists ──────────────────────────────────────────────────────────
		{
			type: "html",
			value: "<span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>Blocklist & Allowlists</span>",
			defaultStyle: false,
		},
		{
			label: "Blocklists",
			type: "doc",
			id: "blocklists/intro",
			customProps: {
				tag: "otherSection",
			},
		},
		{
			id: "console/allowlists",
			type: "doc",
			label: "Centralized Allowlists",
			customProps: {
				tag: "premium",
			},
		},
		{
			id: "console/threat_forecast",
			type: "doc",
			label: "Threat Forecast",
			customProps: {
				tag: "premium",
			},
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
			defaultStyle: false,
		},
		// ── IP Reputation / CTI ──────────────────────────────────────────────────────────
		{
			type: "html",
			value: "<span style='display:block; padding: 10px 8px 4px; font-family: var(--ifm-font-family-monospace); font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ifm-color-emphasis-600);'>IP Reputation / CTI</span>",
			defaultStyle: false,
		},
		{
			id: "console/ip_reputation/intro",
			type: "doc",
			label: "Web UI Overview",
		},
		{
			type: "category",
			label: "Search UI",
			link: {
				type: "doc",
				id: "console/ip_reputation/search_ui",
			},
			items: [
				{
					type: "doc",
					label: "Advanced Search",
					id: "console/ip_reputation/search_ui_advanced",
				},
				{
					type: "doc",
					label: "IP Reputation Report",
					id: "console/ip_reputation/ip_report",
				},
				{
					type: "link",
					label: "Search Queries Syntax",
					href: "/u/cti_api/search_queries",
					customProps: {
						tag: "otherSection",
					},
				},
				{
					type: "doc",
					label: "IP Reputation Report",
					id: "console/ip_reputation/ip_report",
				},
			],
		},
		{
			type: "category",
			label: "API Keys",
			link: {
				type: "doc",
				id: "console/ip_reputation/api_keys",
			},
			items: [
				{
					type: "link",
					label: "CTI API Integrations",
					href: "/u/cti_api/api_integration/integration_intro",
					customProps: {
						tag: "otherSection",
					},
				},
				{
					type: "link",
					label: "Enrichment Fields Ref",
					href: "/u/cti_api/taxonomy/intro",
					customProps: {
						tag: "otherSection",
					},
				},
			],
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
			defaultStyle: false,
		},
		// ── Other ──────────────────────────────────────────────────────────
		{
			type: "category",
			label: "Notifications",
			link: {
				type: "doc",
				id: "console/notification_integrations/overview",
			},
			customProps: {
				tag: "premium",
			},
			items: [
				{
					type: "doc",
					label: "Notification Rule",
					id: "console/notification_integrations/rule",
				},
				{
					type: "doc",
					label: "Discord",
					id: "console/notification_integrations/discord",
				},
				{
					type: "doc",
					label: "Slack",
					id: "console/notification_integrations/slack",
				},

				{
					type: "doc",
					label: "Webhook",
					id: "console/notification_integrations/webhook",
				},
			],
		},
		{
			type: "category",
			label: "Service API",
			link: {
				type: "doc",
				id: "console/service_api/getting_started",
			},
			customProps: {
				tag: "premium",
			},
			items: [
				{
					type: "category",
					label: "Quickstart",
					items: [
						"console/service_api/quickstart/authentication",
						"console/service_api/quickstart/blocklists",
						"console/service_api/quickstart/integrations",
						"console/service_api/quickstart/allowlists",
						"console/service_api/quickstart/metrics",
					],
				},
				{
					type: "doc",
					label: "Blocklists",
					id: "console/service_api/blocklists",
				},
				{
					type: "doc",
					label: "Integrations",
					id: "console/service_api/integrations",
				},
				{
					type: "category",
					label: "SDKs",
					items: [
						{
							type: "doc",
							label: "Python",
							id: "console/service_api/sdks/python",
						},
					],
				},
				{
					type: "link",
					label: "Swagger",
					href: "https://admin.api.crowdsec.net/v1/docs#/",
				},
				{
					type: "link",
					label: "Redoc",
					href: "https://admin.api.crowdsec.net/v1/redoc",
				},
				{
					type: "doc",
					id: "console/service_api/faq",
					label: "FAQ",
				},
			],
		},
		{
			type: "html",
			value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
			defaultStyle: false,
		},
		{
			type: "doc",
			label: "🩺 Stack Health",
			id: "console/stackhealth",
		},
		{
			type: "category",
			label: "🏅 Premium Upgrade",
			link: {
				type: "doc",
				id: "console/premium_upgrade",
			},
			items: [
				{
					type: "doc",
					label: "Optimal Setup",
					id: "console/premium_upgrade/optimal_setup",
				},
				{
					type: "doc",
					label: "Testing Premium",
					id: "console/premium_upgrade/testing_premium",
				},
				{
					type: "doc",
					label: "Features Overview",
					id: "console/premium_upgrade/features_overview",
				},
			],
		},
	],
	remediationSideBar: [
		{
			type: "doc",
			id: "bouncers/intro",
		},
		{
			type: "doc",
			label: "AWS WAF",
			id: "bouncers/aws_waf",
		},
		{
			type: "doc",
			label: "Apache",
			id: "bouncers/apache_bouncer",
		},
		{
			type: "doc",
			label: "BlockList Mirror",
			id: "bouncers/blocklist-mirror",
		},
		{
			type: "doc",
			label: "Cloudflare",
			id: "bouncers/cloudflare",
		},
		{
			type: "doc",
			label: "Cloudflare Workers",
			id: "bouncers/cloudflare-workers",
		},
		{
			type: "doc",
			label: "Custom",
			id: "bouncers/custom",
		},
		{
			type: "doc",
			label: "Envoy (Kubernetes)",
			id: "bouncers/envoy",
		},
		{
			type: "doc",
			label: "Fastly",
			id: "bouncers/fastly",
		},
		{
			type: "doc",
			label: "Firewall",
			id: "bouncers/firewall",
		},
		{
			type: "doc",
			label: "HAProxy",
			id: "bouncers/haproxy",
		},
		{
			type: "doc",
			label: "HAProxy SPOA",
			id: "bouncers/haproxy_spoa",
		},
		{
			type: "doc",
			label: "Ingress Nginx",
			id: "bouncers/ingress-nginx",
		},
		{
			type: "doc",
			label: "Magento 2",
			id: "bouncers/magento",
		},
		{
			type: "doc",
			label: "MISP Feed Generator",
			id: "bouncers/misp-feed-generator",
		},
		{
			type: "doc",
			label: "Nginx",
			id: "bouncers/nginx",
		},
		{
			type: "doc",
			label: "OpenResty",
			id: "bouncers/openresty",
		},
		{
			type: "doc",
			label: "PHP",
			id: "bouncers/php",
		},
		{
			type: "doc",
			label: "PHP Library",
			id: "bouncers/php-lib",
		},
		{
			type: "doc",
			label: "Windows Firewall",
			id: "bouncers/windows_firewall",
		},
		{
			type: "doc",
			label: "Wordpress",
			id: "bouncers/wordpress",
		},
		{
			type: "doc",
			label: "Traefik (Kubernetes)",
			id: "bouncers/traefik",
		},
		{
			type: "link",
			label: "Third Party",
			href: "https://hub.crowdsec.net/browse/#bouncers",
		},
		// {
		//     "type": "doc",
		//     "label": "Contributing",
		//     "id": "bouncers/contributing/contributing_bouncers"
		// },
	],
	blocklistsSideBar: [
		{
			type: "doc",
			id: "blocklists/intro",
			label: "Introduction",
		},
		{
			type: "doc",
			id: "blocklists/getting_started",
			label: "Getting Started",
		},
		{
			type: "doc",
			label: "Featured",
			id: "console/blocklists/featured",
		},
		{
			type: "doc",
			label: "Catalog",
			id: "console/blocklists/catalog",
		},
		{
			type: "doc",
			label: "Details",
			id: "console/blocklists/details",
		},
		{
			type: "doc",
			label: "Subscription",
			id: "console/blocklists/subscription",
		},
		{
			type: "doc",
			label: "Security Engine",
			id: "blocklists/security_engine",
		},
		{
			type: "category",
			link: {
				type: "doc",
				id: "integrations/intro",
			},
			label: "Integrations",
			items: [
				"integrations/rawiplist",
				"integrations/remediationcomponent",
				{
					type: "html",
					value: "<hr style='margin: 0.75rem 0; opacity: 0.35;' />",
					defaultStyle: false,
				},
				"integrations/checkpoint",
				"integrations/cisco",
				"integrations/f5",
				"integrations/fortinet",
				"integrations/juniper",
				"integrations/mikrotik",
				"integrations/opnsense",
				"integrations/paloalto",
				"integrations/pfsense",
				"integrations/sophos",
			],
		},
	],
	troubleshootingSideBar: [
		{
			type: "doc",
			id: "troubleshooting/intro",
			label: "Introduction",
		},
		{
			type: "doc",
			id: "troubleshooting/usecases",
			label: "Use Cases",
		},
		{
			type: "doc",
			id: "troubleshooting/security_engine",
			label: "Security Engine",
		},
		{
			type: "doc",
			id: "troubleshooting/remediation_components",
			label: "Remediation Components",
		},
		{
			type: "doc",
			id: "troubleshooting/cti",
			label: "CTI",
		},
	],

	guidesSideBar: [
		"user_guides/intro",
		{
			type: "category",
			label: "Management",
			items: [
				"user_guides/hub_mgmt",
				"user_guides/decisions_mgmt",
				"user_guides/bouncers_configuration",
				"user_guides/machines_mgmt",
				"user_guides/lapi_mgmt",
			],
		},
		"user_guides/building",
		"user_guides/replay_mode",
		"user_guides/cscli_explain",
		"user_guides/cscli_macos",
		"user_guides/multiserver_setup",
		"user_guides/consuming_fastly_logs",
		"user_guides/alert_context",
		"user_guides/log_centralization",
		"user_guides/waf_rp_howto",
	],
	gettingStarted: [
		{
			type: "doc",
			id: "getting_started/intro",
			label: "🧭 Introduction",
		},
		{
			type: "category",
			label: "📦 Installation",
			items: [
				"getting_started/installation/linux",
				"getting_started/installation/freebsd",
				"getting_started/installation/windows",
				"getting_started/installation/macos",
				"getting_started/installation/docker",
				"getting_started/installation/kubernetes",
				"getting_started/installation/pfsense",
				"getting_started/installation/opnsense",
				"getting_started/installation/whm",
			],
		},
		{
			type: "doc",
			id: "getting_started/health_check",
			label: "🩺 Stack Health-Check",
		},
		{
			type: "category",
			label: "💡 Post Installation Steps",
			link: {
				type: "doc",
				id: "getting_started/next_steps",
			},
			items: [
				{
					type: "category",
					label: "CrowdSec Console",
					link: {
						type: "doc",
						id: "getting_started/post_installation/console",
					},
					items: ["getting_started/post_installation/console_blocklists", "getting_started/post_installation/console_hub"],
					className: "sideBarItemRecommended", // to display tag
				},
				{
					type: "doc",
					id: "getting_started/post_installation/whitelists",
					label: "Whitelisting IPs",
					className: "sideBarItemRecommended",
				},
				{
					type: "category",
					label: "Acquisition",
					className: "sideBarItemOptional",
					link: {
						type: "doc",
						id: "getting_started/post_installation/acquisition",
					},
					items: [
						{
							type: "doc",
							id: "getting_started/post_installation/acquisition_new",
							label: "Adding a new Acquisition",
						},
						{
							type: "doc",
							id: "getting_started/post_installation/acquisition_troubleshoot",
							label: "Acquisition issues 🚨",
						},
					],
				},
				{
					type: "doc",
					id: "getting_started/post_installation/profiles",
					label: "Profiles",
					className: "sideBarItemOptional",
				},
				{
					type: "doc",
					id: "getting_started/post_installation/metrics",
					label: "Metrics",
					className: "sideBarItemOptional",
				},
				{
					type: "doc",
					id: "getting_started/post_installation/troubleshoot",
					label: "General Troubleshooting 🚨",
				},
			],
		},
		{
			type: "link",
			label: "🛠️ Technical Documentation",
			href: "/docs/next/intro",
		},
	],
};

export default sidebarsUnversionedConfig;
