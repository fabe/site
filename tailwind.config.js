module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {},
    fontFamily: {
      sans: [
        'SFRounded',
        'ui-rounded',
        'SF Pro Rounded',
        'system-ui',
        'Helvetica Neue',
        'Arial',
        'Helvetica',
        'sans-serif',
      ],
      mono: [
        'JetBrains Mono',
        'ui-monospace',
        'SFMono-Regular',
        'Consolas',
        'Liberation Mono',
        'Menlo',
        'monospace',
      ],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
