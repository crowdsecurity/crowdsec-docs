
const createConfigSnippet = ({ trackingID, anonymizeIP }) => `gtag('config', '${trackingID}', { ${anonymizeIP ? "'anonymize_ip': true" : ''} });`

const createConfigSnippets = ({arr, anonymizeIP}) => arr.map((trackingID) => createConfigSnippet({trackingID, anonymizeIP})).join('\n')

export default function pluginGoogleGtag(
  _,
  options,
 ) {
  const isProd = process.env.NODE_ENV === 'production';

  const firstTrackingId = options.trackingID[0];

  return {
    name: 'simple-gtag',

    contentLoaded({actions}) {
      actions.setGlobalData(options);
    },

    getClientModules() {
      return isProd ? ['./gtag'] : [];
    },
    injectHtmlTags() {
      if (!isProd) {
        return {};
      }
      return {
        // Gtag includes GA by default, so we also preconnect to
        // google-analytics.
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.google-analytics.com',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.googletagmanager.com',
            },
          },
          // https://developers.google.com/analytics/devguides/collection/gtagjs/#install_the_global_site_tag
          {
            tagName: 'script',
            attributes: {
              async: true,
              // We only include the first tracking id here because google says
              // we shouldn't install multiple tags/scripts on the same page
              // Instead we should load one script and use n * gtag("config",id)
              // See https://developers.google.com/tag-platform/gtagjs/install#add-products
              src: `https://www.googletagmanager.com/gtag/js?id=${firstTrackingId}`,
            },
          },
          {
            tagName: 'script',
            innerHTML: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${createConfigSnippets(options)};
              `,
          },
        ],
      };
    },
  };
}

export {validateThemeConfig, validateOptions} from './validate.ts';