import type { Config } from 'tailwindcss';
import { colors } from './src/styles/themes/main';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: colors
    }
  },
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(primary|secondary|accent|neutral|warning|error|success|info)-(50|100|200|300|400|500|600|700|800|900|950|DEFAULT)$/
    }
  ],
  plugins: []
} satisfies Config;
