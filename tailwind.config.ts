import type { Config } from 'tailwindcss';
import { colors } from './src/styles/themes/main';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: colors,
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(primary|secondary|accent|neutral|warning|error|success|info)-(50|100|200|300|400|500|600|700|800|900|950|DEFAULT)$/
    }
  ],
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
