module.exports = {
  content: ['./src/*.{html,js,css}', './src/views/**/*.ejs'],
  theme: {
    extend: {
      transitionTimingFunction: {
        'header-ease': 'cubic-bezier(0.4, 0, 0.2, 1)' // Smooth easing
      }
    }
  },
  safelist: ['hidden', 'scale-y-0', 'scale-y-100'],
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ]
};
