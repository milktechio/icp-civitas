import type { Config } from 'tailwindcss';

import twForms from '@tailwindcss/forms';
import twTypography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors';

export default <Config>{
  content: [
    './app/app.{vue,js,ts,jsx,tsx}',
    './app/error.{vue,js,ts,jsx,tsx}',
    './app/pages/**/*.{vue,js,ts,jsx,tsx}',
    './app/layouts/**/*.{vue,js,ts,jsx,tsx}',
    './app/components/**/*.{vue,js,ts,jsx,tsx}',
    './app/composables/**/*.{vue,js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        brand: colors.green,
      },

      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray.950/10%'),
      }),

      fontFamily: {
        sans: [
          'Inter, system-ui, sans-serif',
          {
            fontVariationSettings: '"slnt" 0deg',
            fontFeatureSettings: '"cv11", "cv04", "cv03", "cv02"',
          },
        ],
      },

      boxShadow: {
        'card-sm': '0 0 0 1px rgb(0 0 0 / 0.08), 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card-md': '0 0 0 1px rgb(0 0 0 / 0.05), 0 6px 12px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },

  plugins: [twForms, twTypography],
};
