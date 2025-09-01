module.exports = {
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        'sage-green': '#8FA998',
        'burnt-sienna': '#A67C52',
        'dusty-rose': '#E4C9C9',
        'beige': '#F5F0E6',
        'off-white': '#F8F8F8',
        'light-gray': '#E0E0E0',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
