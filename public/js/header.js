/* eslint-disable no-undef */
let lastScrollPosition = 0;
const header = document.getElementById('header');

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const handleScroll = () => {
  const currentScrolPosition = window.scrollY;
  if (currentScrolPosition > lastScrollPosition) {
    header.classList.add('scale-y-0');
    header.classList.remove('scale-y-100');
  } else {
    header.classList.add('scale-y-100');
    header.classList.remove('scale-y-0');
  }
  lastScrollPosition = currentScrolPosition;
};

window.addEventListener('scroll', debounce(handleScroll, 100));
