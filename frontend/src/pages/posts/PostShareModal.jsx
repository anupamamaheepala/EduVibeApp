import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/PostShareModal.css'; 
import Swal from 'sweetalert2';


const PostShareModal = ({ postId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/auth/users')
      .then(res => {
        const currentUserId = localStorage.getItem('userId');
        const filteredUsers = res.data.filter(user =>
          user.id && user.id !== currentUserId 
        );
        setUsers(filteredUsers);
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
        confirmButtonColor: '#f59e0b' 
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
            <strong>{user.username || `${user.firstName} ${user.lastName}` || 'Unknown User'}</strong>
            <br />
            <span style={{ color: '#666', fontSize: '12px' }}>
              {user.email && user.email.trim() !== '' ? user.email : 'No email'}
            </span>
          </button>
        ))}
    </div>

    <div className="external-share">
      <p>Or share via:</p>
      <div className="share-icons">
        <a
          href={`mailto:?subject=Check out this post&body=Here's a post you might find interesting: http://localhost:3000/post/${postId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share via Email"
        >
          <img src="https://img.icons8.com/color/48/000000/gmail--v1.png" alt="Email" />
        </a>
        <a
          href={`https://wa.me/?text=Check out this post: http://localhost:3000/post/${postId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
        >
          <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp" />
        </a>
        <a
          href={`https://t.me/share/url?url=http://localhost:3000/post/${postId}&text=Check out this post`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Telegram"
        >
          <img src="https://img.icons8.com/color/48/000000/telegram-app--v1.png" alt="Telegram" />
        </a>
      </div>
    </div>

    <div className="copy-link-section">
      <button
        className="copy-link-button"
        onClick={() => {
          const shareUrl = `http://localhost:3000/post/${postId}`;
          navigator.clipboard.writeText(shareUrl).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Link copied!',
              text: 'Post link has been copied to clipboard.',
              timer: 1500,
              showConfirmButton: false,
            });
          });
        }}
      >
        📋 Copy Link
      </button>
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
