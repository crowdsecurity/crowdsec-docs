import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment"

let loaded = false

function loadLeadfeeder() {
    if (loaded) return
    loaded = true

    window.ldfdr =
        window.ldfdr ||
        function () {
            ;(window.ldfdr._q = window.ldfdr._q || []).push([].slice.call(arguments))
        }

    var fs = document.getElementsByTagName("script")[0]
    var cs = document.createElement("script")
    cs.src = "https://sc.lfeeder.com/lftracker_v1_lAxoEaKqxpv7OYGd.js"
    cs.async = 1
    fs.parentNode.insertBefore(cs, fs)
}

const clientModule = {
    onRouteDidUpdate() {
        if (!ExecutionEnvironment.canUseDOM) return

        const consent = JSON.parse(localStorage.getItem("docusaurus.cookieConsent") ?? "null")
        if (!consent) return

        loadLeadfeeder()
    },
}

export default clientModule
