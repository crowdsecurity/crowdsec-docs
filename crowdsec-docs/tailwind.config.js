/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./unversioned/**/*.{js,jsx,ts,tsx,mdx}",
    "./versioned_docs/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: `rgb(var(--primary) / <alpha-value>)`,
        "primary-foreground": `rgb(var(--primary-foreground) / <alpha-value>)`,
        secondary: `rgb(var(--secondary) / <alpha-value>)`,
        "secondary-foreground": `rgb(var(--secondary-foreground) / <alpha-value>)`,
        info: `rgb(var(--info) / <alpha-value>)`,
        "info-foreground": `rgb(var(--info-foreground) / <alpha-value>)`,
        premium: `rgb(var(--premium) / <alpha-value>)`,
        gray: {
          50: `rgb(var(--color-gray-50) / <alpha-value>)`,
          100: `rgb(var(--color-gray-100) / <alpha-value>)`,
          200: `rgb(var(--color-gray-200) / <alpha-value>)`,
          300: `rgb(var(--color-gray-300) / <alpha-value>)`,
          400: `rgb(var(--color-gray-400) / <alpha-value>)`,
          500: `rgb(var(--color-gray-500) / <alpha-value>)`,
          600: `rgb(var(--color-gray-600) / <alpha-value>)`,
          700: `rgb(var(--color-gray-700) / <alpha-value>)`,
          800: `rgb(var(--color-gray-800) / <alpha-value>)`,
          900: `rgb(var(--color-gray-900) / <alpha-value>)`,
          950: `rgb(var(--color-gray-950) / <alpha-value>)`,
        },
        danger: `rgb(var(--color-red) / <alpha-value>)`,
        border: `rgb(var(--border) / <alpha-value>)`,
        ring: `rgb(var(--color-primary) / <alpha-value>)`,
        background: `rgb(var(--background) / <alpha-value>)`,
        foreground: `rgb(var(--foreground) / <alpha-value>)`,
        success: `rgb(var(--color-green) / <alpha-value>)`,
        platinum: `rgb(var(--color-platinum) / <alpha-value>)`,
        card: `rgb(var(--card) / <alpha-value>)`,
        "card-foreground": `rgb(var(--card-foreground) / <alpha-value>)`,
      },
      backgroundImage: () => ({
        landing: "url('/img/landing-page-bg.webp')",
      }),
      scale: {
        99: "0.99",
        101: "1.01",
      },
    },
  },
  safelist: [
    {
      pattern: /invert(-0)?/,
      variants: ["dark", "light", "before"],
    },
  ],
  plugins: [require("tailwindcss-animate")],
  prefix: "", // This is the prefix for the tailwind classes to not clash with docusarus classes
};
