import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/SinglePostView.css';
import userLogo from '../../images/user.png';
import CommentPopup from '../comments/CommentPopup';
import CommentSection from '../comments/CommentSection';
import { AuthContext } from '../AuthContext';
import Login from '../LoginSingleView';
import Header from '../HeaderSinglePost';
import Footer from '../Footer';

const SinglePostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({}); // New state for like count
  const [likedPosts, setLikedPosts] = useState({}); // New state for liked status
  const { isAuthenticated } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);

  useEffect(() => {
    const fetchPostAndLikeData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/view-posts/${postId}`);
        setPost(res.data);
        fetchCommentCounts([res.data]);
        fetchLikeData(res.data);
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndLikeData();
  }, [postId]);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginPopup(false);
    }
  }, [isAuthenticated]);

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

  const fetchLikeData = async (postData) => {
    try {
      const likeCountsTemp = {};
      const likedPostsTemp = {};
      const countResponse = await fetch(`http://localhost:8000/api/likes/count/${postData.id}`);
      if (countResponse.ok) {
        likeCountsTemp[postData.id] = await countResponse.json();
      }
      const userId = localStorage.getItem('userId');
      if (userId) {
        const isLikedResponse = await fetch(
          `http://localhost:8000/api/likes/is-liked?postId=${postData.id}&userId=${userId}`
        );
        if (isLikedResponse.ok) {
          likedPostsTemp[postData.id] = await isLikedResponse.json();
        }
      }
      setLikeCounts(likeCountsTemp);
      setLikedPosts(likedPostsTemp);
    } catch (err) {
      console.error('Error fetching like data:', err);
    }
  };

  const handleLike = async (postId) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !localStorage.getItem('token')) {
      setShowLoginPopup(true);
      return;
    }
    const username = localStorage.getItem('username') || 'Anonymous';
    try {
      const response = await fetch('http://localhost:8000/api/likes/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          postId,
          userId,
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

  const openComments = (postId) => {
    setActiveCommentPostId(postId);
  };

  const closeComments = () => {
    setActiveCommentPostId(null);
    if (post) {
      fetchCommentCounts([post]);
    }
  };

  const getCommentCount = (postId) => {
    return commentCounts[postId] || 0;
  };

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) return <p>Loading...</p>;
  if (error || !post) return <p>{error}</p>;

  return (
    <div className="Single-page-container">
      <Header openPopup={() => setShowLoginPopup(true)} />

      <div className="Single-posts-container">
        <div className="Single-posts-feed">
          <div className="Single-post-card">
            <div className="Single-post-header">
              <div className="Single-post-user">
                <img className="Single-post-user-avatar" src={userLogo} alt="User avatar" />
                <span className="Single-post-username">{post.username || post.userId}</span>
              </div>
              <span className="Single-post-time">{getTimeAgo(post.createdAt)}</span>
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
                      <img key={index} src={url} alt={`Post media ${index}`} />
                    ) : (
                      <video key={index} controls>
                        <source src={url} type="video/mp4" />
                      </video>
                    );
                  })}
                </div>
              );
            })()}

            <div className="Single-post-content">
              <p className="Single-post-caption">{post.content}</p>
              <p className="Single-post-meta">
                Posted by <strong>{post.username || post.userId}</strong> on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
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
                onClick={() => {
                  const authed = localStorage.getItem('token');
                  if (authed) {
                    openComments(post.id);
                  } else {
                    setShowLoginPopup(true);
                  }
                }}
              >
                <i className="far fa-comment"></i> Comment ({getCommentCount(post.id)})
              </button>
            </div>
          </div>
        </div>
      </div>
      {activeCommentPostId && (
        <CommentPopup
          postId={activeCommentPostId}
          isOpen={activeCommentPostId !== null}
          onClose={closeComments}
        />
      )}
      {!localStorage.getItem('token') && showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup-content">
            <Login onClose={() => setShowLoginPopup(false)} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SinglePostView;