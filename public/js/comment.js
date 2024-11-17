/* eslint-disable no-undef */
const textCount = document.getElementById('text-count');
textCount.innerHTML = `0 / 500 words`;
document.addEventListener('input', (event) => {
  if (event.target.classList.contains('auto-expand')) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to calculate correctly
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
  }
});

const message = document.getElementById('message');
message.addEventListener('input', (event) => {
  const value = event.target.value;
  const textCount = document.getElementById('text-count');
  textCount.innerHTML = `${value.length} / 500 words`;
});
