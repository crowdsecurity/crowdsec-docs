export default function tailwindPlugin() {
    return {
        name: "tailwind-plugin",
        configurePostCss(postcssOptions) {
            postcssOptions.plugins = [require("postcss-import"), require("tailwindcss"), require("autoprefixer")]
            return postcssOptions
        },
    }
}
