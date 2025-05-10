import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/SharedPosts.css';
import userLogo from '../../images/user.png';
import CommentPopup from '../comments/CommentPopup';

const SharedPosts = () => {
  const [sharedData, setSharedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const [openImage, setOpenImage] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/shared-posts/user/${userId}`);
        const sharedPosts = response.data;

        const detailedPosts = await Promise.all(sharedPosts.map(async (shared) => {
          try {
            const postRes = await axios.get(`http://localhost:8000/api/view-posts/${shared.postId}`);
            return {
              ...shared,
              post: postRes.data,
            };
          } catch (err) {
            console.warn(`Post with ID ${shared.postId} not found`);
            return null;
          }
        }));

        const validPosts = detailedPosts.filter(Boolean).sort(
          (a, b) => new Date(b.sharedAt) - new Date(a.sharedAt)
        );
        setSharedData(validPosts);
        fetchCommentCounts(validPosts);
        fetchLikeData(validPosts);
      } catch (err) {
        console.error('Error fetching shared post details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPosts();
  }, [userId]);

  const fetchCommentCounts = async (postsData) => {
    try {
      const counts = {};
      for (const { post } of postsData) {
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

 // Fetch likes data for posts
const fetchLikeData = async (postsData) => {
  try {
    const likeCountsTemp = {};
    const likedPostsTemp = {};
    
    for (const post of postsData) {
      // Fetch like count for each post
      const countResponse = await fetch(`http://localhost:8000/api/likes/count/${post.id}`);
      if (countResponse.ok) {
        likeCountsTemp[post.id] = await countResponse.json();
      }
      
      // Check if current user has liked each post
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

// Handle like/unlike action
const handleLike = async (postId) => {
  // Check if user is logged in
  if (!currentUserId) {
    alert('Please log in to like posts');
    return;
  }
  
  const username = localStorage.getItem('username') || 'Anonymous';
  
  try {
    // Show immediate feedback by updating UI optimistically
    const currentlyLiked = likedPosts[postId] || false;
    const currentCount = likeCounts[postId] || 0;
    
    // Update UI immediately (optimistic update)
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !currentlyLiked,
    }));
    
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: currentlyLiked ? currentCount - 1 : currentCount + 1,
    }));
    
    // Make API call to update server
    const response = await fetch('http://localhost:8000/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        postId,
        userId: currentUserId,
        username,
      }),
    });
    
    // If API call fails, revert the optimistic update
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
    // Revert optimistic update on error
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
  const openComments = (postId) => {
    setActiveCommentPostId(postId);
  };

  const closeComments = () => {
    if (activeCommentPostId) {
      fetchCommentCounts(sharedData);
    }
    setActiveCommentPostId(null);
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

  return (
    <div className="Share-posts-container">
      <h2>Posts Shared With Me</h2>
      {loading ? (
        <p>Loading shared posts...</p>
      ) : sharedData.length === 0 ? (
        <p>No shared posts found.</p>
      ) : (
        <div className="share-posts-feed">
          {sharedData.map(({ post, fromUserId, fromName, sharedAt, id }) => (
            <div key={id} className="share-post-card">
              <div className="post-header">
                <div className="post-user">
                  <img className="post-user-avatar" src={userLogo} alt="User avatar" />
                  <span className="post-username">{post.username || post.userId}</span>
                </div>
                <span className="post-time">{getTimeAgo(post.createdAt)}</span>
              </div>

              {post.mediaUrls && post.mediaUrls.length > 0 && (() => {
                const mediaCount = post.mediaUrls.length;
                let mediaClass = 'Share-media-gallery';
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
                  Originally posted by <strong>{post.username || post.userId}</strong> on{' '}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="post-meta">
                  Shared with you by <strong>{fromName}</strong> on {new Date(sharedAt).toLocaleString()}
                </p>
              </div>

              <div className="post-actions">
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
          ))}
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
};

export default SharedPosts;


