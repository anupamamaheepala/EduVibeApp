import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/SharedPosts.css'; // Use same styles as ViewPosts
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
            return null; // skip if not found
          }
        }));
        
const validPosts = detailedPosts.filter(Boolean).sort(
  (a, b) => new Date(b.sharedAt) - new Date(a.sharedAt)
);
        setSharedData(validPosts);
        
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

  const openComments = (postId) => {
    setActiveCommentPostId(postId);
  };
  

  const closeComments = () => {
    if (activeCommentPostId) {
      fetchCommentCounts([{ id: activeCommentPostId }]);
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

              {/* Media section */}
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
                        </video>

                      );
                    })}
                  </div>
                );
              })()}

              <div className="post-content">
                <p className="post-caption">{post.content}</p>
                <p className="post-meta">
                  Originally posted by <strong>{post.username || post.userId}</strong> on {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="post-meta">
                  Shared with you by <strong>{fromName}</strong> on {new Date(sharedAt).toLocaleString()}
                </p>
                
              </div>
              {/* Post Actions - Like, Comment, etc. */}
              <div className="post-actions">
                  <button className="post-action-btn like-btn">
                    <i className="far fa-thumbs-up"></i> Like
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
       {/* Comment Popup */}
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


