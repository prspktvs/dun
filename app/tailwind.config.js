/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'h-sm': { raw: '(min-height: 400px)' },
        'h-md': { raw: '(min-height: 750px)' },
        'h-lg': { raw: '(min-height: 1000px)' },
      },
      borderWidth: {
        '1': '1px',
      },
      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))',
      },
      fontFamily: {
        monaspace: ['MonaspaceArgon', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        commissioner: ['Commissioner', 'sans-serif'],
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
      },
      colors: {
        'gray-border': '#B0B0B0',
        'border-color': '#C1B9CF',
        grayBg: '#EFEFEF',
        inactiveText: '#6F6D73',
        paper: '#FAF9F6',
        salad: '#DBF7CA',
      },
    },
  },
  plugins: [],
}
