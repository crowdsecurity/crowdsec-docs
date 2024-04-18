const colors = require('tailwindcss/colors')

module.exports = {
    corePlugins: {
        preflight: false,
    },
    darkMode: ["class", '[data-theme="dark"]'],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./unversioned/**/*.{js,jsx,ts,tsx}",
        "./versioned_docs/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        colors: {
            ...colors, // Default colors
            primary: {
                light: "#2E2A77",
                dark: '#242441',
            },
            secondary: "#F8AB13",
        },
        extend: {},
    },
    plugins: [],
    prefix: "tw-", // This is the prefix for the tailwind classes to not clash with docusarus classes
};
