module.exports = {
    ctiApiSidebar: [
        {
            type: "doc",
            label: "Introduction",
            id: "intro",
        },
        {
            type: "doc",
            label: "Getting Started",
            id: "getting_started",
        },
        {
            type: 'category',
            label: 'Taxonomy',
            items: [
                "taxonomy/intro",
                "taxonomy/cti_object",
                "taxonomy/scores",
                "taxonomy/scenarios",
                "taxonomy/classifications",
                "taxonomy/behaviors",
                "taxonomy/false_positives"
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
                id: "integration_intro",
            },
            items: [
                "integration_chrome",
                "integration_gigasheet",
                "integration_intelowl",
                "integration_maltego",
                "integration_misp",
                "integration_msticpy",
                "integration_opencti",
                "integration_paloalto_xsoar",
                "integration_qradar",
                "integration_sekoia_xdr",
                "integration_splunk_siem",
                "integration_splunk_soar",
                "integration_thehive",
            ],
        },
    ],
}