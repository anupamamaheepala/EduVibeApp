import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserPosts.css';
import DeleteUserPost from './DeleteUserPosts';
import { AuthContext } from '../AuthContext';
import userLogo from '../../images/user.png';
import ShareModal from './PostShareModal';
import CommentPopup from '../comments/CommentPopup';

function UserPosts() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [sharingPostId, setSharingPostId] = useState(null);
  const currentUserId = localStorage.getItem('userId');
  const [openImage, setOpenImage] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({}); // New state for like counts
  const [likedPosts, setLikedPosts] = useState({}); // New state for liked posts

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!currentUserId) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/view-posts/user/${currentUserId}`);
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        fetchCommentCounts(sortedPosts);
        fetchLikeData(sortedPosts); // Fetch like data
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUserId]);

  const fetchCommentCounts = async (postsData) => {
    try {
      const counts = {};
      for (const post of postsData) {
        const response = await fetch(`http://localhost:8000/api/comments/post/${post.id}`);
        if (response.ok) {
          const comments = await response.json();
          counts[post.id] = comments.length;
        }
      }
      setCommentCounts(counts);
    } catch (err) {
      console.error('Error fetching comment counts:', err);
    }
  };

  const fetchLikeData = async (postsData) => {
    try {
      const likeCountsTemp = {};
      const likedPostsTemp = {};
      for (const post of postsData) {
        const countResponse = await fetch(`http://localhost:8000/api/likes/count/${post.id}`);
        if (countResponse.ok) {
          likeCountsTemp[post.id] = await countResponse.json();
        }
        if (currentUserId) {
          const isLikedResponse = await fetch(
            `http://localhost:8000/api/likes/is-liked?postId=${post.id}&userId=${currentUserId}`
          );
          if (isLikedResponse.ok) {
            likedPostsTemp[post.id] = await isLikedResponse.json();
          }
        }
      }
      setLikeCounts(likeCountsTemp);
      setLikedPosts(likedPostsTemp);
    } catch (err) {
      console.error('Error fetching like data:', err);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUserId) {
      alert('Please log in to like posts');
      return;
    }
    const username = localStorage.getItem('username') || 'Anonymous';
    try {
      const response = await fetch('http://localhost:8000/api/likes/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          postId,
          userId: currentUserId,
          username,
        }),
      });
      if (response.ok) {
        const isLiked = response.status === 200;
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: isLiked,
        }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: isLiked ? (prev[postId] || 0) + 1 : (prev[postId] || 1) - 1,
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const openComments = (postId) => {
    setActiveCommentPostId(postId);
  };

  const closeComments = () => {
    setActiveCommentPostId(null);
    fetchCommentCounts(posts);
  };

  const getCommentCount = (postId) => {
    return commentCounts[postId] || 0;
  };

  const toggleDropdown = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleEdit = (postId) => {
    navigate(`/EditUserPosts/${postId}`);
    setOpenDropdown(null);
  };

  const handleShare = (postId) => {
    setSharingPostId(postId);
    setOpenDropdown(null);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedId));
    setOpenDropdown(null);
  };

  return (
    <div className="user-page-container">
      <div className="user-posts-container">
        <div className="header-actions">
          <h2 style={{ color: '#301934' }}>My Posts</h2>
          <a href="/add-post" className="create-post-button">Create Post</a>
        </div>
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
                  <div className="post-user">
                    <img className="post-user-avatar" src={userLogo} alt="User avatar" />
                    <span className="post-username">{post.username || post.userId}</span>
                  </div>
                  <div className="post-right">
                    <span className="post-time">{getTimeAgo(post.createdAt)}</span>
                    <button
                      onClick={() => toggleDropdown(post.id)}
                      className="dropdown-button"
                      aria-label="More options"
                    >
                      ⋮
                    </button>
                    {openDropdown === post.id && (
                      <div className="dropdown-menu" ref={dropdownRef}>
                        <button onClick={() => handleEdit(post.id)} className="dropdown-item">
                          Edit
                        </button>
                        <DeleteUserPost postId={post.id} onDelete={handlePostDeleted} />
                        <button onClick={() => handleShare(post.id)} className="dropdown-item">
                          Share
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {post.mediaUrls && post.mediaUrls.length > 0 && (() => {
                  const mediaCount = post.mediaUrls.length;
                  let mediaClass = 'media-gallery';
                  if (mediaCount === 1) mediaClass += ' media-1';
                  else if (mediaCount === 2) mediaClass += ' media-2';
                  else if (mediaCount === 3) mediaClass += ' media-3';
                  else if (mediaCount === 4) mediaClass += ' media-4';

                  return (
                    <div className={mediaClass}>
                      {post.mediaUrls.map((url, index) => {
                        const type = post.mediaTypes?.[index] || (url.endsWith('.mp4') ? 'video' : 'image');
                        return type === 'image' ? (
                          <img
                            key={index}
                            src={url}
                            alt={`Post media ${index}`}
                            onClick={() => setOpenImage(url)}
                            style={{ cursor: 'pointer' }}
                          />
                        ) : (
                          <video
                            key={index}
                            onClick={() => setOpenVideo(url)}
                            style={{ cursor: 'pointer' }}
                            muted
                          >
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="post-content">
                  <p className="post-caption">{post.content}</p>
                  <p className="post-meta">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="post-actions">
                  <button
                    className={`post-action-btn like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <i className={`far fa-thumbs-up ${likedPosts[post.id] ? 'fas' : ''}`}></i> Like (
                    {likeCounts[post.id] || 0})
                  </button>
                  <button
                    className="post-action-btn comment-btn"
                    onClick={() => openComments(post.id)}
                  >
                    <i className="far fa-comment"></i> Comment ({getCommentCount(post.id)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {openImage && (
          <div className="image-modal-backdrop" onClick={() => setOpenImage(null)}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={openImage} alt="Full view" />
              <button className="close-btn" onClick={() => setOpenImage(null)}>✕</button>
            </div>
          </div>
        )}
        {openVideo && (
          <div className="image-modal-backdrop" onClick={() => setOpenVideo(null)}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh' }}>
                <source src={openVideo} type="video/mp4" />
              </video>
              <button className="close-btn" onClick={() => setOpenVideo(null)}>✕</button>
            </div>
          </div>
        )}
      </div>
      {sharingPostId && (
        <ShareModal postId={sharingPostId} onClose={() => setSharingPostId(null)} />
      )}
      {activeCommentPostId && (
        <CommentPopup
          postId={activeCommentPostId}
          isOpen={activeCommentPostId !== null}
          onClose={closeComments}
        />
      )}
    </div>
  );
}

export default UserPosts;