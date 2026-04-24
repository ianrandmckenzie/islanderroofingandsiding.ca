/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.html', './src/**/*.{js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#BF403A',
        secondary: '#D13027',
        tertiary: '#914139',
      },
      fontFamily: {
        sans: ['Tahoma', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        serif: [],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
