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
      animation: {
        'thinking-1': 'thinking 1s 0.3s infinite cubic-bezier(0.175, 0.885, 0.320, 1.275)',
        'thinking-2': 'thinking 1s 0.425s infinite cubic-bezier(0.175, 0.885, 0.320, 1.275)',
        'thinking-3': 'thinking 1s 0.55s infinite cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      },
      keyframes: {
        'thinking': {
          '0%': {transform: 'translateY(0)'},
          '20%': {transform: 'translateY(-60%)'},
          '80%': {transform: 'translateY(0)'},
          '100%': {transform: 'translateY(0)'},
        },
      },
      spacing: {
        8: '30px',
      },
      borderRadius: {
        '4xl': '25px',
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