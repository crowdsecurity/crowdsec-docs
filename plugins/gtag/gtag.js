import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

const clientModule = {
    onRouteDidUpdate({ location, previousLocation }) {
        if (!ExecutionEnvironment.canUseDOM) {
            return null;
        }
        const cookieConsentResponse = JSON.parse(
            localStorage.getItem("docusaurus.cookieConsent") ?? "null"
        );
        if (!cookieConsentResponse) {
            window["ga-disable-MEASUREMENT_ID"] = true;
            return;
        }
        if (
            previousLocation &&
            (location.pathname !== previousLocation.pathname ||
                location.search !== previousLocation.search ||
                location.hash !== previousLocation.hash)
        ) {
            // Normally, the document title is updated in the next tick due to how
            // `react-helmet-async` updates it. We want to send the current document's
            // title to gtag instead of the old one's, so we use `setTimeout` to defer
            // execution to the next tick.
            // See: https://github.com/facebook/docusaurus/issues/7420
            setTimeout(() => {
                // Always refer to the variable on window in case it gets overridden
                // elsewhere.
                window.gtag(
                    "set",
                    "page_path",
                    location.pathname + location.search + location.hash
                );
                window.gtag("event", "page_view");
            });
        }
    },
};

export default clientModule;
