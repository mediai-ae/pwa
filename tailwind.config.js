export default {
  content: ['./index.html', './app.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        tahoma: ['Tahoma', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#2c3b55',
        'secondary-dark': '#394263',
        'light-bg': '#f9fafb',
        'light-text': '#111827',
        accent: '#0066cc',
        'accent-soft': '#0055aa',
        'accent-dark': '#004080',
        rga: {
          r: 'red',
          g: 'green',
          a: 'orange',
          na: 'gray',
        },
      },
    },
  },
};
