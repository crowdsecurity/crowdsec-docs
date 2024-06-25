const { themes } = require("prism-react-renderer")

const {
    remediationSideBar,
    ctiApiSidebar,
    guidesSideBar,
} = require("./sidebarsUnversioned.js")

const generateCurrentAndNextRedirects = (s) => [
    {
        from: `/docs/${s}`,
        to: `/u/${s}`,
    },
    {
        from: `/docs/next/${s}`,
        to: `/u/${s}`,
    },
]

const backportRedirect = (s) => {
    const arr = []
    if (typeof s !== "string") {
        const { id, link, items } = s
        if (id) {
            arr.push(...generateCurrentAndNextRedirects(id))
        }
        if (link && link.id) {
            arr.push(...generateCurrentAndNextRedirects(link.id))
        }
        if (items) {
            for (const item of items) {
                if (typeof item === "string") {
                    arr.push(...generateCurrentAndNextRedirects(item))
                }
                if (typeof item === "object") {
                    arr.push(...backportRedirect(item))
                }
            }
        }
    } else {
        arr.push(...generateCurrentAndNextRedirects(s))
    }
    return arr
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "CrowdSec",
    tagline:
        "CrowdSec - Real-time & crowdsourced protection against aggressive IPs",
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
        announcementBar: {
            id: "banner_docs",
            content:
                '<a target="_blank" href="https://doc.crowdsec.net/u/user_guides/alert_context">Learn how to improve alert visualisation and threat hunting with alert context</a>',
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
        navbar: {
            items: [],
        },
        navbar: {
            title: "",
            logo: {
                alt: "CrowdSec",
                src: "img/crowdsec_logo.png",
            },
            items: [
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
                        {
                            type: "doc",
                            docId: "intro",
                            label: "Security Engine",
                        },
                        {
                            to: "/u/bouncers/intro",
                            label: "Remediation Components",
                        },
                        {
                            type: "docsVersion",
                            to: "/docs/next/appsec/intro",
                            label: "Application Security Component",
                        },
                        {
                            type: "doc",
                            docId: "cscli/cscli",
                            label: "Cscli",
                        },
                        {
                            to: "/u/user_guides/intro",
                            label: "Guides",
                        },
                    ],
                },
                {
                    to: "/u/blocklists/getting_started",
                    position: "left",
                    label: "Blocklists",
                },
                {
                    label: "API(s)",
                    position: "left",
                    items: [
                        {
                            label: "CTI API",
                            to: "/u/cti_api/getting_started",
                        },
                        {
                            label: "Service API",
                            to: "/u/service_api/intro",
                        },
                    ],
                },
                {
                    to: "/u/console/intro",
                    position: "left",
                    label: "Console",
                },
                {
                    to: `https://academy.crowdsec.net/courses?${
                        process.env.NODE_ENV === "production"
                            ? "utm_source=docs&utm_medium=menu&utm_campaign=top-menu&utm_id=academydocs"
                            : ""
                    }`,
                    label: "Academy",
                    position: "left",
                },
                {
                    to: "/u/troubleshooting/intro",
                    position: "left",
                    label: "FAQ/Troubleshooting",
                },
                {
                    href: "https://github.com/crowdsecurity/crowdsec",
                    position: "right",
                    className: "header-github-link header-icon-link",
                },
                {
                    href: "https://discord.gg/wGN7ShmEE8",
                    position: "right",
                    className: "header-discord-link",
                },
                {
                    href: "https://discourse.crowdsec.net",
                    position: "right",
                    className: "header-discourse-link",
                },
                {
                    href: "https://hub.crowdsec.net/",
                    position: "right",
                    className: "header-hub-link",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Community",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/crowdsecurity/crowdsec",
                        },
                        {
                            label: "Discourse",
                            href: "https://discourse.crowdsec.net/",
                        },
                        {
                            label: "Discord",
                            href: "https://discord.gg/crowdsec",
                        },
                        {
                            label: "Twitter",
                            href: "https://twitter.com/crowd_security",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "Console",
                            href: "https://app.crowdsec.net/",
                        },
                        {
                            label: "Hub",
                            href: "https://hub.crowdsec.net/",
                        },
                        {
                            label: "Blog",
                            href: "https://crowdsec.net/blog/",
                        },
                        {
                            label: "Tutorial",
                            href: "https://crowdsec.net/blog/category/tutorial/",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} CrowdSec`,
        },
        prism: {
            theme: themes.shadesOfPurple,
            additionalLanguages: ["bash", "yaml", "json"],
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/",
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "unversioned",
                path: "unversioned",
                routeBasePath: "u",
                sidebarPath: require.resolve("./sidebarsUnversioned.js"),
            },
        ],
        ["./plugins/gtag/index.js", { trackingID: "G-0TFBMNTDFQ" }],
        [
            "@docusaurus/plugin-client-redirects",
            {
                redirects: [
                    // Redirect current and next routes to unversioned to avoid 404 on articles and app.crowdsec.net
                    ...[
                        ...remediationSideBar,
                        ...ctiApiSidebar,
                        ...guidesSideBar,
                    ].flatMap(backportRedirect),
                    {
                        from: "/docs/troubleshooting",
                        to: "/u/troubleshooting/intro",
                    },
                    {
                        from: "/docs/next/troubleshooting",
                        to: "/u/troubleshooting/intro",
                    },
                    {
                        from: "/docs/faq",
                        to: "/u/troubleshooting/intro",
                    },
                    {
                        from: "/docs/next/faq",
                        to: "/u/troubleshooting/intro",
                    },
                ],
            },
        ],
        async function myPlugin(context, options) {
            return {
                name: "docusaurus-tailwindcss",
                configurePostCss(postcssOptions) {
                    // Appends TailwindCSS and AutoPrefixer.
                    postcssOptions.plugins.push(require("tailwindcss"))
                    postcssOptions.plugins.push(require("autoprefixer"))
                    return postcssOptions
                },
            }
        },
    ],
}
