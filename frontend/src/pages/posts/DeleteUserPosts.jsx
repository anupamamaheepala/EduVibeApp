// src/components/DeleteUserPost.jsx
import React from 'react';

function DeleteUserPost({ postId, onDelete }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/delete-posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('Post deleted successfully.');
      onDelete(postId); // Inform parent component
    } catch (error) {
      alert('Error deleting post: ' + error.message);
    }
  };

  return (
    <button onClick={handleDelete} className="dropdown-item delete">
      Delete
    </button>
  );
}

export default DeleteUserPost;
