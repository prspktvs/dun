/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))',
      },
      fontFamily: {
        monaspace: ['MonaspaceArgon', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        'gray-border': '#B0B0B0',
        'border-color': '#C1B9CF',
        salad: '#DBF7CA',
      },
    },
  },
  plugins: [],
}
