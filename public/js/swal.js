const confirmDelete = (id, title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      // Find the form by ID and submit it
      const form = document.getElementById(`delete-form-${id}`);
      if (form) form.submit();
    }
  });
};
