import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/PostShareModal.css'; // make sure styling is included
import Swal from 'sweetalert2';


const PostShareModal = ({ postId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/auth/users')
      .then(res => {
        const currentUserId = localStorage.getItem('userId');
        setUsers(res.data.filter(u => u.id !== currentUserId));
      })
      .catch(err => {
        console.error('Error fetching users:', err.message);
      });
  }, []);

  const toggleSelectUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = () => {
    if (selectedUserIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No users selected',
        text: 'Please select at least one user to share the post.',
        confirmButtonColor: '#f59e0b' // amber/yellow tone
      });
      return;
    }
  
    const fromUserId = localStorage.getItem('userId');
    const requests = selectedUserIds.map(toUserId =>
      axios.post('http://localhost:8000/api/shared-posts/share', {
        postId,
        fromUserId,
        toUserIds: selectedUserIds,
      })
    );
  
    Promise.all(requests)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Shared!',
          text: 'Your post was successfully shared.',
          confirmButtonColor: '#2563eb',
        });
        onClose();
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to share the post. Please try again.',
        });
      });
  };
  
  

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Share Post</h3>
        <div className="user-list">
          {users.map(user => (
            <button
              key={user.id}
              className={`user-select-button ${selectedUserIds.includes(user.id) ? 'selected' : ''}`}
              onClick={() => toggleSelectUser(user.id)}
            >
              {user.name || user.email}
            </button>
          ))}
        </div>
        <div className="modal-actions">
        <button onClick={handleShare}>
          Share
        </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostShareModal;
