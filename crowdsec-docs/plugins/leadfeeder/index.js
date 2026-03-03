var path = require("path")

module.exports = function () {
    const isProd = process.env.NODE_ENV === "production"

    return {
        name: "docusaurus-plugin-leadfeeder",
        getClientModules() {
            return isProd ? [path.resolve(__dirname, "./tracker")] : []
        },
    }
}
