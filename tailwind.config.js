/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fill: {
      'dark-shade': '#2B435E',
      'white': '#ffffff',
    },
    fontFamily: {
      'sans': ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      spacing: {
        8: '30px',
      },
      backgroundColor: {
        'border': '#cccccc',
        'light-shade': '#F5F6F4',
        'light-accent': '#9C855F',
        'base-color': '#999BA7',
        'dark-accent': '#7E6469',
        'dark-shade': '#2B435E',
        'main-button': '#1e2d3b',
        'main-button-hover': '#141e27',
        'white': '#ffffff',
        'black': '#000000',
      },
      textColor: {
        'dark-shade': '#2B435E',
        'error': '#f44336',
      },
      borderColor: {
        'error': '#f44336',
        'border-color': '#cccccc',
      },
      maxWidth: {
        'maxWidth': '768px',
      },
      gridTemplateRows: {
        'layout': '1fr auto',
      },
    },
  },
  plugins: [],
  variants: {
    fill: ['hover'],
  }
};