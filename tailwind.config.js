/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: {
    extend: {
      colors: {
        accent: {
          primary: 'rgb(var(--color-accent-primary)/<alpha-value>)',
          muted: 'rgb(var(--color-accent-muted)/<alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary)/<alpha-value>)',
          muted: 'rgb(var(--color-primary-muted)/<alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground)/<alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary)/<alpha-value>)',
          muted: 'rgb(var(--color-secondary-muted)/<alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground)/<alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--color-tertiary)/<alpha-value>)',
          muted: 'rgb(var(--color-tertiary-muted)/<alpha-value>)',
          foreground: 'rgb(var(--color-tertiary-foreground)/<alpha-value>)',
        },
        error: 'rgb(var(--color-error)/<alpha-value>)',
        success: 'rgb(var(--color-success)/<alpha-value>)',
        warning: 'rgb(var(--color-warning)/<alpha-value>)',
        info: 'rgb(var(--color-info)/<alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--color-text)/<alpha-value>)',
          muted: 'rgb(var(--color-text-muted)/<alpha-value>)',
        },
        border: 'rgb(var(--color-border)/<alpha-value>)',
        background: {
          DEFAULT: 'rgb(var(--color-background)/<alpha-value>)',
          subtle: 'rgb(var(--color-background-subtle)/<alpha-value>)',
        },
      },
      fontFamily: {
        heading: undefined,
        body: undefined,
        mono: undefined,
        jakarta: ['var(--font-plus-jakarta-sans)'],
        roboto: ['var(--font-roboto)'],
        code: ['var(--font-source-code-pro)'],
        inter: ['var(--font-inter)'],
        'space-mono': ['var(--font-space-mono)'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
