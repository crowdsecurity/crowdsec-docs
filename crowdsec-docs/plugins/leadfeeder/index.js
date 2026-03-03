var path = require("path")

module.exports = function (context, options) {
    const isProd = process.env.NODE_ENV === "production"
    const trackerUrl = options.trackerUrl

    if (!trackerUrl) {
        throw new Error("docusaurus-plugin-leadfeeder: 'trackerUrl' option is required.")
    }

    return {
        name: "docusaurus-plugin-leadfeeder",
        configureWebpack() {
            return {
                plugins: [
                    new (require("webpack")).DefinePlugin({
                        "process.env.LEADFEEDER_TRACKER_URL": JSON.stringify(trackerUrl),
                    }),
                ],
            }
        },
        getClientModules() {
            return isProd ? [path.resolve(__dirname, "./tracker")] : []
        },
    }
}
