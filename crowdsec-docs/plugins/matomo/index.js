
var path = require("path");

module.exports = function (context) {
  const {siteConfig} = context;
  const {themeConfig} = siteConfig;
  const {matomo} = themeConfig || {};

  //const isProd = process.env.NODE_ENV === 'production';
  isProd = true;
  return {
    name: 'docusaurus-plugin-matomo',
    getClientModules() {
        return isProd ? [path.resolve(__dirname, './track')] : [];
      },
    injectHtmlTags() {
      return {
        headTags: [
        {
            tagName: 'script',
            attributes: {
                src: 'https://cdnjs.cloudflare.com/ajax/libs/tarteaucitronjs/1.9.7/tarteaucitron.js',
            },
        },
        {
            tagName: 'script',
            innerHTML: `tarteaucitron.init({
                "privacyUrl": "", /* Privacy policy url */
                "bodyPosition": "bottom", /* or top to bring it as first element for accessibility */
      
                "hashtag": "#tarteaucitron", /* Open the panel with this hashtag */
                "cookieName": "tarteaucitron", /* Cookie name */
          
                "orientation": "middle", /* Banner position (top - bottom) */
             
                "groupServices": false, /* Group services by category */
                "serviceDefaultState": "wait", /* Default state (true - wait - false) */
                                 
                "showAlertSmall": false, /* Show the small banner on bottom right */
                "cookieslist": false, /* Show the cookie list */
                                 
                "closePopup": false, /* Show a close X on the banner */
      
                "showIcon": true, /* Show cookie icon to manage cookies */
                //"iconSrc": "", /* Optionnal: URL or base64 encoded image */
                "iconPosition": "BottomRight", /* BottomRight, BottomLeft, TopRight and TopLeft */
      
                "adblocker": false, /* Show a Warning if an adblocker is detected */
                                 
                "DenyAllCta" : true, /* Show the deny all button */
                "AcceptAllCta" : true, /* Show the accept all button when highPrivacy on */
                "highPrivacy": true, /* HIGHLY RECOMMANDED Disable auto consent */
                                 
                "handleBrowserDNTRequest": false, /* If Do Not Track == 1, disallow all */
      
                "removeCredit": false, /* Remove credit link */
                "moreInfoLink": true, /* Show more info link */
      
                "useExternalCss": false, /* If false, the tarteaucitron.css file will be loaded */
                "useExternalJs": false, /* If false, the tarteaucitron.js file will be loaded */
      
                //"cookieDomain": ".my-multisite-domaine.fr", /* Shared cookie for multisite */
                                
                "readmoreLink": "", /* Change the default readmore link */
      
                "mandatory": true, /* Show a message about mandatory cookies */
                "mandatoryCta": true /* Show the disabled accept button when mandatory on */
              });`,
          },
          {
            tagName: 'script',
            innerHTML:`
            tarteaucitron.user.matomoId = '5';
            tarteaucitron.user.matomoHost = 'https://crowdsec.matomo.cloud/';
            (tarteaucitron.job = tarteaucitron.job || []).push('matomocloud');`,
          }   
        ],
      };
    },
  };
};