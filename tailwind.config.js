module.exports = {
  content: ['./src/*.{html,js,css}', './src/views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be VietNam', 'sans-serif'],
        serif: ['EB Garamond', 'serif'],
        eb: ['EB Garamond']
      },
      fontSize: {
        '2xs': ['0.5rem', { lineHeight: '0.75rem' }]
      }
    }
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ]
};
