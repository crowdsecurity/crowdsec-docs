import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }
  return {
    onRouteUpdate({location}) {
        if (typeof window._paq != 'undefined') {
            console.log(window._paq);
            window._paq.push(['setCustomUrl', location.pathname]);
            window._paq.push(['setDocumentTitle', document.title]);
            window._paq.push(['trackPageView']);
        }
    },
  };
})();