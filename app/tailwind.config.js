/** @type {import('tailwindcss').Config} */

export default {
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
        roboto: ['Roboto', 'sans-serif'],
        monaspace: ['MonaspaceArgon', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        commissioner: ['Commissioner', 'sans-serif'],
        national: ['National Park', 'sans-serif'],
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
      },
      colors: {
        borders: {
          gray: '#B0B0B0',
          purple: '#C1B9CF',
        },
        priority: {
          low: '#00A3FF',
          medium: '#F5CC63',
          high: '#FFB774',
          urgent: '#FF7475',
        },
        grayBg: '#EFEFEF',
        hoverBox: '#FBFBFD',
        inactiveText: '#6F6D73',
        btnBg: '#8279BD',
        paper: '#FAF9F6',
        salad: '#DBF7CA',
        'primary-text': '#47444F',
        background: '#F9F9F9',
      },
    },
  },
  plugins: [],
}
