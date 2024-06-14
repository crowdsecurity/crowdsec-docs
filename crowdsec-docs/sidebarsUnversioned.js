module.exports = {
    ctiApiSidebar: [
        {
            type: "doc",
            label: "Introduction",
            id: "cti_api/intro",
        },
        {
            type: "doc",
            label: "Getting Started",
            id: "cti_api/getting_started",
        },
        {
            type: "category",
            label: "Taxonomy",
            items: [
                "cti_api/taxonomy/intro",
                "cti_api/taxonomy/cti_object",
                "cti_api/taxonomy/scores",
                "cti_api/taxonomy/scenarios",
                "cti_api/taxonomy/classifications",
                "cti_api/taxonomy/behaviors",
                "cti_api/taxonomy/false_positives",
            ],
        },
        {
            type: "link",
            label: "Swagger",
            href: "https://crowdsecurity.github.io/cti-api/",
        },
        {
            type: "category",
            label: "Integrations",
            link: {
                type: "doc",
                id: "cti_api/integration_intro",
            },
            items: [
                "cti_api/integration_chrome",
                "cti_api/integration_gigasheet",
                "cti_api/integration_intelowl",
                "cti_api/integration_maltego",
                "cti_api/integration_misp",
                "cti_api/integration_msticpy",
                "cti_api/integration_opencti",
                "cti_api/integration_paloalto_xsoar",
                "cti_api/integration_qradar",
                "cti_api/integration_securitycopilot",
                "cti_api/integration_sekoia_xdr",
                "cti_api/integration_splunk_siem",
                "cti_api/integration_splunk_soar",
                "cti_api/integration_thehive",
            ],
        },
        {
            type: "doc",
            label: "Search Queries",
            id: "cti_api/search_queries",
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
                    label: "Transfer an Engine",
                    id: "console/security_engines/transfer_engine",
                },
                {
                    type: "doc",
                    label: "Remove an Engine",
                    id: "console/security_engines/remove_engine",
                },
                {
                    type: "doc",
                    label: "Troubleshooting",
                    id: "console/security_engines/troubleshooting",
                },
                {
                    type: "doc",
                    label: "Select multiple organizations",
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
            label: "Blocklists",
            link: {
                type: "doc",
                id: "console/blocklists/overview",
            },
            items: [
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
                    type: "category",
                    label: "Integrations",
                    link: {
                        type: "doc",
                        id: "console/blocklists/integrations/firewall",
                    },
                    items: [
                        {
                            type: "doc",
                            label: "Firewall integrations",
                            id: "console/blocklists/integrations/firewall",
                        }
                     
                    ],
                }
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
                },
                {
                    type: "doc",
                    label: "Quotas",
                    id: "console/alerts/quotas",
                },
            ],
        },
        {
            type: "category",
            label: "Decision",
            link: {
                type: "doc",
                id: "console/decisions/decisions_intro",
            },
            items: ["console/decisions/decisions_management"],
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
    troubleshootingSideBar: [
        {
            type: "doc",
            id: "troubleshooting/intro",
            label: "Introduction",
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
        "user_guides/appsec_tuto",
    ],
    gettingStarted: [
        "getting_started/intro",
        "getting_started/pre_requisites",
        {
            type: "category",
            label: "Installation",
            items: [
                "getting_started/installation/linux",
                "getting_started/installation/freebsd",
                "getting_started/installation/windows",
                "getting_started/installation/macos",
                "getting_started/installation/docker",
                "getting_started/installation/kubernetes",
                // "getting_started/installation/pfsense",
                // "getting_started/installation/opnsense",
                "getting_started/installation/whm",
            ],
        },
        {
            type: "category",
            label: "Post Installation Steps",
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
                    items: [
                        "getting_started/post_installation/console_blocklists",
                        "getting_started/post_installation/console_hub",
                    ],
                },
                {
                    type: "category",
                    label: "Acquisition",
                    link: {
                        type: "doc",
                        id: "getting_started/post_installation/acquisition",
                    },
                    items: [
                        "getting_started/post_installation/acquisition_new",
                        "getting_started/post_installation/acquisition_troubleshoot",
                    ],
                },
                "getting_started/post_installation/profiles",
                "getting_started/post_installation/metrics",
                "getting_started/post_installation/troubleshoot",
            ],
        },
        {
            type: "link",
            label: "Technical Documentation",
            href: "/docs/next/intro",
        },
    ],
}
