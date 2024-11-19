// eslint-disable-next-line @typescript-eslint/no-require-imports,no-undef
const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ['class'],
  safelist: ['dark'],
  prefix: '',

  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      boxShadow: {
        'primary-sm': '0 1px 2px 0 hsl(var(--primary-600))',
        'primary-md': '0 4px 6px -1px hsl(var(--primary-700)), 0 2px 4px -2px hsl(var(--primary-700))',
        'primary-lg': '0 10px 15px -3px hsl(var(--primary-800)), 0 4px 6px -4px hsl(var(--primary-800))',
        'primary-xl': '0 20px 25px -5px hsl(var(--primary-900)), 0 10px 10px -5px hsl(var(--primary-900))',
        'primary-inner': 'inset 0 2px 4px 0 hsl(175, 40%, 55%)',
      },
      colors: {
        'primary-100': 'hsl(var(--primary-100))',
        'primary-200': 'hsl(var(--primary-200))',
        'primary-300': 'hsl(var(--primary-300))',
        'primary-400': 'hsl(var(--primary-400))',
        'primary-500': 'hsl(var(--primary))',
        'primary-600': 'hsl(var(--primary-600))',
        'primary-700': 'hsl(var(--primary-700))',
        'primary-800': 'hsl(var(--primary-800))',
        'primary-900': 'hsl(var(--primary-900))',
        'dark-900': 'hsl(var(--dark-900))',
        'dark-800': 'hsl(var(--dark-800))',
        'dark-700': 'hsl(var(--dark-700))',
        'dark-600': 'hsl(var(--dark-600))',
        'dark-500': 'hsl(var(--dark-500))',
        'light-100': 'hsl(var(--light-100))',
        'light-200': 'hsl(var(--light-200))',
        'light-300': 'hsl(var(--light-300))',
        'light-400': 'hsl(var(--light-400))',
        'light-500': 'hsl(var(--light-500))',
        'light-600': 'hsl(var(--light-600))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
    },
  },
  plugins: [animate],
}