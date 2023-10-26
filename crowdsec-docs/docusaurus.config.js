const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const path = require('path')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'CrowdSec',
  tagline: 'CrowdSec - Real-time & crowdsourced protection against aggressive IPs',
  url: 'https://docs.crowdsec.net',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/crowdsec_no_txt.png',
  organizationName: 'CrowdSec',
  projectName: 'crowdsec-docs',
  //plugins: [path.resolve(__dirname, 'plugins', 'matomo')],
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    }
  ],
  themeConfig: {
    algolia: {
      appId: 'PWTZ94KULF',
      apiKey: '31673122672f1eb819e16c87468e53b4',
      indexName: 'crowdsec',
      contextualSearch: true
    },
    navbar: {
      items: [

      ],
    },
    navbar: {
      title: '',
      logo: {
        alt: 'CrowdSec',
        src: 'img/crowdsec_logo.png',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'CrowdSec',
        },
        {
          type: 'doc',
          docId: 'cscli/cscli',
          position: 'left',
          label: 'Cscli',
        },
        {
          type: 'doc',
          docId: 'bouncers/intro',
          position: 'left',
          label: 'Remediation',
        },
        {
          type: 'doc',
          docId: 'cti_api/getting_started',
          position: 'left',
          label: 'CTI API',
        },
        { to: 'https://academy.crowdsec.net/', label: 'Academy', position: 'left' },
        {
          type: 'doc',
          docId: 'faq',
          position: 'left',
          label: 'FAQ',
        },
        {
          type: 'doc',
          docId: 'troubleshooting',
          position: 'left',
          label: 'Troubleshooting',
        },
        {
          href: 'https://github.com/crowdsecurity/crowdsec',
          position: 'right',
          className: 'header-github-link header-icon-link',
        },
        {
          href: 'https://discord.gg/wGN7ShmEE8',
          position: 'right',
          className: "header-discord-link",
        },
        {
          href: 'https://discourse.crowdsec.net',
          position: 'right',
          className: "header-discourse-link",
        },
        {
          href: 'https://app.crowdsec.net/',
          position: 'right',
          className: "header-console-link",
        },
        {
          href: 'https://hub.crowdsec.net/',
          position: 'right',
          className: "header-hub-link",
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/crowdsecurity/crowdsec',
            },
            {
              label: 'Discourse',
              href: 'https://discourse.crowdsec.net/',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/crowdsec',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/crowd_security',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: "Console",
              href: "https://app.crowdsec.net/"
            },
            {
              label: 'Hub',
              href: 'https://hub.crowdsec.net/',
            },
            {
              label: 'Blog',
              href: 'https://crowdsec.net/blog/',
            },
            {
              label: 'Tutorial',
              href: 'https://crowdsec.net/blog/category/tutorial/',
            },

          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CrowdSec`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/crowdsecurity/crowdsec-docs/edit/main/crowdsec-docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
