import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/UserPosts.css';

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock current user ID (replace with actual auth system)
  const currentUserId = 'currentUser';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const userPosts = data.filter((post) => post.userId === currentUserId);
        setPosts(userPosts);
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  // Handle dropdown toggle
  const toggleDropdown = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts.filter((post) => post.id !== postId));
      setOpenDropdown(null);
    } catch (err) {
      setError('Error deleting post: ' + err.message);
    }
  };


  const handleEdit = (postId) => {
    navigate(`/EditUserPosts/${postId}`);
    setOpenDropdown(null);
  };
  
  // Handle share post
  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post URL copied to clipboard!');
    });
    setOpenDropdown(null);
  };

  return (
    <div className="user-posts-container">
      <h2>Your Posts</h2>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : posts.length === 0 ? (
        <p className="no-posts">You haven't posted yet.</p>
      ) : (
        <div className="posts-feed">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
              <div className="dropdown-container">
  <button
    onClick={() => toggleDropdown(post.id)}
    className="dropdown-button"
    aria-label="More options"
  >
    ⋮
  </button>
  {openDropdown === post.id && (
    <div className="dropdown-menu" ref={dropdownRef}>
      <button
        onClick={() => handleEdit(post.id)}
        className="dropdown-item"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(post.id)}
        className="dropdown-item delete"
      >
        Delete
      </button>
      <button
        onClick={() => handleShare(post.id)}
        className="dropdown-item"
      >
        Share
      </button>
    </div>
  )}
</div>

              </div>
              {post.mediaUrl && (
                <div className="post-media">
                  {post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt="Post media" />
                  ) : (
                    <video controls aria-label="Post video">
                      <source src={post.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              <div className="post-content">
                <p className="post-caption">{post.content}</p>
                <p className="post-meta">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPosts;