module.exports = {
  content: ['./src/*.{html,js,css}', './src/views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        niconne: ['Niconne', 'cursive'],
        sans: ['Be VietNam', 'sans-serif'],
        serif: ['EB Garamond', 'serif']
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
