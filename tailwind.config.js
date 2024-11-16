module.exports = {
  content: ['./src/*.{html,js,css}', './src/views/**/*.ejs'],
  theme: {
    extend: {}
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ]
};
