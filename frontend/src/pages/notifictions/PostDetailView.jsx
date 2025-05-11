import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserPosts.css'; 
import { AuthContext } from '../AuthContext';
import userLogo from '../../images/user.png';
import CommentPopup from '../comments/CommentPopup';

function PostDetailView() {
  const { postId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/add-post/${postId}`);
        setPost(response.data);
        fetchCommentCounts([response.data]);
        fetchLikeData([response.data]);
      } catch (err) {
        setError('Error fetching post: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchCommentCounts = async (postsData) => {
    try {
      const counts = {};
      for (const p of postsData) {
        const response = await fetch(`http://localhost:8000/api/comments/post/${p.id}`);
        if (response.ok) {
          const comments = await response.json();
          counts[p.id] = comments.length;
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
      for (const p of postsData) {
        const countResponse = await fetch(`http://localhost:8000/api/likes/count/${p.id}`);
        if (countResponse.ok) {
          likeCountsTemp[p.id] = await countResponse.json();
        }
        if (currentUserId) {
          const isLikedResponse = await fetch(
            `http://localhost:8000/api/likes/is-liked?postId=${p.id}&userId=${currentUserId}`
          );
          if (isLikedResponse.ok) {
            likedPostsTemp[p.id] = await isLikedResponse.json();
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
      const currentlyLiked = likedPosts[postId] || false;
      const currentCount = likeCounts[postId] || 0;
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !currentlyLiked,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: currentlyLiked ? currentCount - 1 : currentCount + 1,
      }));
      const response = await fetch('http://localhost:8000/api/likes/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          postId,
          userId: currentUserId,
          username,
        }),
      });
      if (!response.ok) {
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: currentlyLiked,
        }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: currentCount,
        }));
        console.error('Server rejected like operation');
      }
    } catch (err) {
      const currentlyLiked = likedPosts[postId] || false;
      const currentCount = likeCounts[postId] || 0;
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: currentlyLiked,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: currentCount,
      }));
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
    if (post) fetchCommentCounts([post]);
  };

  const getCommentCount = (postId) => {
    return commentCounts[postId] || 0;
  };

  return (
    <div className="user-page-container">
      <div className="user-posts-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading post...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : !post ? (
          <p className="no-posts">Post not found.</p>
        ) : (
          <div className="posts-feed">
            <div className="post-card">
              <div className="post-header">
                <div className="post-user">
                  <img className="post-user-avatar" src={userLogo} alt="User avatar" />
                  <span className="post-username">{post.username || post.userId}</span>
                </div>
                <div className="post-right">
                  <span className="post-time">{getTimeAgo(post.createdAt)}</span>
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
                          style={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <video
                          key={index}
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

              <div className="User-post-content">
                <p className="User-post-caption">{post.content}</p>
                <p className="User-post-meta">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="User-post-actions">
                <button
                  className={`post-action-btn like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <i className={`${likedPosts[post.id] ? 'fas' : 'far'} fa-thumbs-up`}></i>
                  <span className="like-text">Like</span>
                  <span className="liked-text">Liked</span>
                  ({likeCounts[post.id] || 0})
                </button>
                <button
                  className="post-action-btn comment-btn"
                  onClick={() => openComments(post.id)}
                >
                  <i className="far fa-comment"></i> Comment ({getCommentCount(post.id)})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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

export default PostDetailView;