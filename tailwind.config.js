/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        base: "0.97rem",
        "base-adjusted-sm": "0.938rem",
      },
      fontFamily: {
        sans: [
          "var(--sans-font)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        serif: [
          "LiterataVar",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      colors: {
        silver: "#DFDFDE",
        "silver-dark": "#9B9B9B",
        "neutral-950": "#010101",
        "neutral-850": "#1C1C1C",
      },
      textDecorationThickness: {
        1.5: "1.5px",
      },
      textUnderlineOffset: {
        1.5: "1.5px",
        2.5: "2.5px",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.215, 0.61, 0.355, 1)",
        spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      maxWidth: {
        main: "46rem",
      },
      width: {
        main: "46rem",
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
      },
      letterSpacing: {
        xs: "-.000490774em",
        sm: "-.00622354em",
        normal: "-.0109598em",
        zero: "0",
      },
      animation: {
        scale: "scale .4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        fadeIn: "fadeIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        shake: "shake .2s ease-in-out 0s 2",
        bannerFadeIn:
          "bannerFadeIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards",
      },
      keyframes: {
        scale: {
          "0%": { transform: "scale(.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-0.5rem)" },
          "75%": { transform: "translateX(0.5rem)" },
        },
        bannerFadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateX(-50%) translateY(24px)",
          },
          "100%": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
        },
      },
      boxShadow: {
        "elevation-sm":
          "0px 0px 0px 1px rgba(0,0,0,0.02),0px 8px 24px 0px rgba(0,0,0,0.10)",
        "elevation-md":
          "0px 0px 0px 1px rgba(0,0,0,0.02),0px 4px 8px 0px rgba(0,0,0,0.08),0px 12px 30px 0px rgba(0,0,0,0.12)",
        border: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset",
        dark: "0 16px 70px rgb(0 0 0 / 20%)",
        fancy:
          "0px 0px 0px 1px rgba(25, 37, 50, 0.05), 0px 3px 7px -3px rgba(25, 37, 50, 0.1), 0px 6px 12px -2px rgba(25, 37, 50, 0.1), inset 0 0 0 1px rgba(255, 255, 255, .05)",
        fancyDark:
          "inset 0 0 0 0.5px rgba(255, 255, 255, .1), 0px 3px 7px -3px rgba(25, 37, 50, 0.1), 0px 6px 12px -2px rgba(25, 37, 50, 0.1)",
      },
      lineHeight: {
        golden: "1.6875",
      },
      typography: {
        quotefix: {
          css: {
            "blockquote p:first-of-type::before": { marginLeft: "-.6ch" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-touch")()],
};
