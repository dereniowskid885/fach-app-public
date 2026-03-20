import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',

        card: 'oklch(var(--card))',
        'card-foreground': 'oklch(var(--card-foreground))',

        popover: 'oklch(var(--popover))',
        'popover-foreground': 'oklch(var(--popover-foreground))',

        primary: 'oklch(var(--primary))',
        'primary-foreground': 'oklch(var(--primary-foreground))',
        'primary-constant': 'oklch(var(--primary-constant))',

        secondary: 'oklch(var(--secondary))',
        'secondary-foreground': 'oklch(var(--secondary-foreground))',

        tertiary: 'oklch(var(--tertiary))',
        'tertiary-foreground': 'oklch(var(--tertiary-foreground))',

        muted: 'oklch(var(--muted))',
        'muted-foreground': 'oklch(var(--muted-foreground))',
        'muted-constant': 'oklch(var(--muted-constant))',

        accent: 'oklch(var(--accent))',
        'accent-foreground': 'oklch(var(--accent-foreground))',

        destructive: 'oklch(var(--destructive))',
        'destructive-foreground': 'oklch(var(--destructive-foreground))',

        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',

        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },

        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        'primary-hover': 'oklch(var(--primary-hover))',
        'secondary-hover': 'oklch(var(--secondary-hover))',
        'destructive-hover': 'oklch(var(--destructive-hover))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  safelist: [
    'bg-yellow-50',
    'text-yellow-600',
    'border-yellow-200',
    'bg-emerald-50',
    'text-emerald-600',
    'border-emerald-200',
    'bg-purple-50',
    'text-purple-600',
    'border-purple-200',
    'bg-blue-50',
    'text-blue-600',
    'border-blue-200',
    'bg-orange-50',
    'text-orange-600',
    'border-orange-200',
    'bg-teal-50',
    'text-teal-600',
    'border-teal-200',
    'bg-lime-50',
    'text-lime-600',
    'border-lime-200',
    'bg-red-50',
    'text-red-600',
    'border-red-200'
  ],
  plugins: [animate]
} satisfies Config;
