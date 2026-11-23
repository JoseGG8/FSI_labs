/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        ink: '#111827',
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          600: '#243B53',
          700: '#1E3A5F',
          800: '#102A43',
          900: '#0B1F33'
        }
      }
    }
  },
  plugins: []
};
