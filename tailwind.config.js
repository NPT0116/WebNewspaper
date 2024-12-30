import flowbite from 'flowbite/plugin';
export default {
  content: ['./src/*.{html,js,css}', './src/views/**/*.ejs', './public/js/**/*.js', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        niconne: ['Niconne', 'serif'],
        sans: ['Be VietNam', 'sans-serif'],
        serif: ['EB Garamond', 'serif'],
        dancing: ['Dancing Script', 'serif']
      },
      transitionTimingFunction: {
        'header-ease': 'cubic-bezier(0.4, 0, 0.2, 1)' // Smooth easing
      },
      backgroundImage: {
        'gradient-45': 'linear-gradient(45deg, #ff6547 0%, #ffb144 51%, #ff7053 100%)'
      }
    }
  },
  safelist: [
    'hidden',
    'scale-y-0',
    'scale-y-100',
    'max-h-48',
    'rounded-lg',
    'mx-auto',
    'z-10',
    'w-8',
    ' h-8',
    'text-gray-200',
    'animate-spin',
    'dark:text-gray-600',
    'fill-blue-600',
    'px-4',
    'py-2',
    'hover:bg-gray-100',
    'cursor-pointer'
  ],
  plugins: [
    flowbite // Thêm tailwind-hamburgers vào đây
  ]
};
