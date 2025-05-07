import React from 'react';
import Swal from 'sweetalert2';

function DeleteUserPost({ postId, onDelete }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This post will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/delete-posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      Swal.fire({
        title: 'Deleted!',
        text: 'Your post has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      onDelete(postId); // Inform parent component
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting post: ' + error.message,
        icon: 'error',
      });
    }
  };

  return (
    <button onClick={handleDelete} className="dropdown-item delete">
      Delete
    </button>
  );
}

export default DeleteUserPost;
