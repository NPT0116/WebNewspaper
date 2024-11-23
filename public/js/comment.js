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
// Kết nối Socket.IO

// Lắng nghe sự kiện newComment
// Xử lý gửi form bằng AJAX
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Ngăn chặn reload trang

  const content = document.getElementById('message').value;
  const formAction = commentForm.getAttribute('action');

  try {
    const response = await fetch(formAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      const newComment = await response.json(); // Nhận comment mới từ server
      socket.emit('addComment', newComment); // Phát tới server
      document.getElementById('message').value = ''; // Reset form
    } else {
      console.error('Failed to post comment:', response.statusText);
    }
  } catch (error) {
    console.error('Error posting comment:', error);
  }
});
