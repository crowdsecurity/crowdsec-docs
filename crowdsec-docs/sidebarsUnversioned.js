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
            type: 'category',
            label: 'Taxonomy',
            items: [
                "cti_api/taxonomy/intro",
                "cti_api/taxonomy/cti_object",
                "cti_api/taxonomy/scores",
                "cti_api/taxonomy/scenarios",
                "cti_api/taxonomy/classifications",
                "cti_api/taxonomy/behaviors",
                "cti_api/taxonomy/false_positives"
            ]
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
                "cti_api/integration_sekoia_xdr",
                "cti_api/integration_splunk_siem",
                "cti_api/integration_splunk_soar",
                "cti_api/integration_thehive",
            ],
        },
    ],
    appsecSideBar: [
        {
            type: "doc",
            id: "appsec/intro",
        },
        {
            type: "doc",
            id: "appsec/install",
        },
        {
            type: "doc",
            id: "appsec/rules",
        },
    ],
    remediationSideBar: [
        {
            type: "doc",
            id: "bouncers/intro",
        },
        {
            "type": "doc",
            "label": "AWS WAF",
            "id": "bouncers/aws_waf"
        },
        {
            "type": "doc",
            "label": "BlockList Mirror",
            "id": "bouncers/blocklist-mirror"
        },
        {
            "type": "doc",
            "label": "Cloudflare",
            "id": "bouncers/cloudflare"
        },
        {
            "type": "doc",
            "label": "Cloudflare Workers",
            "id": "bouncers/cloudflare-workers"
        },
        {
            "type": "doc",
            "label": "Custom",
            "id": "bouncers/custom"
        },
        {
            "type": "doc",
            "label": "Fastly",
            "id": "bouncers/fastly"
        },
        {
            "type": "doc",
            "label": "Firewall",
            "id": "bouncers/firewall"
        },
        {
            "type": "doc",
            "label": "HAProxy",
            "id": "bouncers/haproxy"
        },
        {
            "type": "doc",
            "label": "Ingress Nginx",
            "id": "bouncers/ingress-nginx"
        },
        {
            "type": "doc",
            "label": "Magento 2",
            "id": "bouncers/magento"
        },
        {
            "type": "doc",
            "label": "MISP Feed Generator",
            "id": "bouncers/misp-feed-generator"
        },
        {
            "type": "doc",
            "label": "Nginx",
            "id": "bouncers/nginx"
        },
        {
            "type": "doc",
            "label": "OpenResty",
            "id": "bouncers/openresty"
        },
        {
            "type": "doc",
            "label": "PHP",
            "id": "bouncers/php"
        },
        {
            "type": "doc",
            "label": "PHP Library",
            "id": "bouncers/php-lib"
        },
        {
            "type": "doc",
            "label": "Windows Firewall",
            "id": "bouncers/windows_firewall"
        },
        {
            "type": "doc",
            "label": "Wordpress",
            "id": "bouncers/wordpress"
        },
        {
            "type": "link",
            "label": "Third Party",
            "href": "https://hub.crowdsec.net/browse/#bouncers"
        },
        // {
        //     "type": "doc",
        //     "label": "Contributing",
        //     "id": "bouncers/contributing/contributing_bouncers"
        // },
    ],
}