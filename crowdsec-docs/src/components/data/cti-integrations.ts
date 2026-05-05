export interface CtiIntegrationData {
	name: string;
	slug: string;
	href: string;
	plugin: string; // vendor-specific plugin/extension/module name shown as subtext
	desc: string; // shown on hover tooltip
	color: string;
}

export const ctiIntegrations: CtiIntegrationData[] = [
	{
		name: "IPDEX",
		slug: "ipdex",
		href: "/u/cti_api/api_integration/integration_ipdex",
		plugin: "CrowdSec CTI Reports",
		desc: "IPDEX extracts IP addresses from your logs and cross-references them against CrowdSec's global threat intelligence network — instantly.",
		color: "#e55c2f",
	},
	{
		name: "Chrome",
		slug: "chrome",
		href: "/u/cti_api/api_integration/integration_chrome",
		plugin: "CrowdSec CTI Extension",
		desc: "Browser extension to instantly look up any IP on a page without leaving your browser.",
		color: "#4285f4",
	},
	{
		name: "Gigasheet",
		slug: "gigasheet",
		href: "/u/cti_api/api_integration/integration_gigasheet",
		plugin: "No-Code API Enrichment",
		desc: "Enrich spreadsheet columns with CTI data using Gigasheet's no-code API enrichment feature — no scripting required.",
		color: "#00b4d8",
	},
	{
		name: "IntelOwl",
		slug: "intelowl",
		href: "/u/cti_api/api_integration/integration_intelowl",
		plugin: "CrowdSec Analyzer",
		desc: "Open-source threat intelligence platform with a built-in CrowdSec analyzer for automated IP enrichment.",
		color: "#e63946",
	},
	{
		name: "Maltego",
		slug: "maltego",
		href: "/u/cti_api/api_integration/integration_maltego",
		plugin: "CrowdSec Transform",
		desc: "Link analysis and data visualization tool. Use the CrowdSec Transform to pivot from IPs to full reputation context.",
		color: "#efefef",
	},
	{
		name: "MISP",
		slug: "misp",
		href: "/u/cti_api/api_integration/integration_misp",
		plugin: "CrowdSec Feed Module",
		desc: "Open-source threat sharing platform. Import CrowdSec CTI data as a MISP feed for collaborative threat intelligence workflows.",
		color: "#1a73e8",
	},
	{
		name: "MSTICpy",
		slug: "msticpy",
		href: "/u/cti_api/api_integration/integration_msticpy",
		plugin: "CrowdSec TI Provider",
		desc: "Microsoft's open-source security Python library. Query CrowdSec CTI directly from Jupyter notebooks and threat hunting scripts.",
		color: "#00a4ef",
	},
	{
		name: "Microsoft Sentinel",
		slug: "ms-sentinel",
		href: "/u/cti_api/api_integration/integration_ms_sentinel",
		plugin: "CrowdSec Threat Intelligence",
		desc: "Cloud-native SIEM. Enrich Sentinel incidents and hunting queries with CrowdSec IP reputation data via the native connector.",
		color: "#0078d4",
	},
	{
		name: "OpenCTI",
		slug: "opencti",
		href: "/u/cti_api/api_integration/integration_opencti",
		plugin: "CrowdSec Connector",
		desc: "Open-source CTI platform. Ingest CrowdSec reputation data as a structured connector for correlation and sharing.",
		color: "#e55c2f",
	},
	{
		name: "Palo Alto XSOAR",
		slug: "paloalto_xsoar",
		href: "/u/cti_api/api_integration/integration_paloalto_xsoar",
		plugin: "CrowdSec Integration",
		desc: "SOAR platform by Palo Alto Networks. Automate IP reputation lookups in playbooks using the CrowdSec integration.",
		color: "#fa582d",
	},
	{
		name: "QRadar",
		slug: "qradar",
		href: "/u/cti_api/api_integration/integration_qradar",
		plugin: "CrowdSec App",
		desc: "IBM SIEM solution. Enrich QRadar offenses and rules with CrowdSec IP reputation via the dedicated app.",
		color: "#0530ad",
	},
	{
		name: "Security Copilot",
		slug: "securitycopilot",
		href: "/u/cti_api/api_integration/integration_securitycopilot",
		plugin: "CrowdSec Plugin",
		desc: "Microsoft's AI-powered security assistant. Query CrowdSec CTI data inline using natural language prompts.",
		color: "#0078d4",
	},
	{
		name: "Sekoia XDR",
		slug: "sekoia",
		href: "/u/cti_api/api_integration/integration_sekoia_xdr",
		plugin: "CrowdSec CTI Intake",
		desc: "Extended Detection and Response platform. Feed CrowdSec IP reputation into Sekoia for detection and threat hunting.",
		color: "#6c47ff",
	},
	{
		name: "Splunk SIEM",
		slug: "splunk_siem",
		href: "/u/cti_api/api_integration/integration_splunk_siem",
		plugin: "CrowdSec Add-on for Splunk",
		desc: "Enrich Splunk Enterprise Security searches and dashboards with live CrowdSec IP reputation data.",
		color: "#65a637",
	},
	{
		name: "Splunk SOAR",
		slug: "splunk_soar",
		href: "/u/cti_api/api_integration/integration_splunk_soar",
		plugin: "CrowdSec App for SOAR",
		desc: "Automate IP enrichment and response playbooks in Splunk SOAR using the CrowdSec threat intelligence app.",
		color: "#65a637",
	},
	{
		name: "TheHive",
		slug: "thehive",
		href: "/u/cti_api/api_integration/integration_thehive",
		plugin: "CrowdSec Analyzer",
		desc: "Open-source SIRP for incident response teams. Add CrowdSec as a Cortex analyzer to auto-enrich observables.",
		color: "#f5a623",
	},
];
