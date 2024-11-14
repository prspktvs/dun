/** @type {import('tailwindcss').Config} */
//The project did not start, so I replaced it with an export.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
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
        agron: ['Monaspace Argon Var'],
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
      },
      colors: {
        'textarea-bg': '#F9F9F9',
        'gray-border': '#B0B0B0',
        'border-color': '#C1B9CF',
        priority: {
          low: '#00A3FF',
          medium: '#F5CC63',
          high: '#FFB774',
          urgent: '#FF7475',
        },
        grayBg: '#EFEFEF',
        inactiveText: '#6F6D73',
        paper: '#FAF9F6',
        salad: '#DBF7CA',
        'primary-text': '#47444F',
        background: '#F9F9F9',
      },
    },
  },
  plugins: [],
}
