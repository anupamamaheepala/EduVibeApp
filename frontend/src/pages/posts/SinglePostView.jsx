import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/SinglePostView.css'; // reuse your existing styles
import userLogo from '../../images/user.png';
import CommentPopup from '../comments/CommentPopup';
import CommentSection from '../comments/CommentSection';

const SinglePostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/api/view-posts/${postId}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Post not found');
        setLoading(false);
      });
  }, [postId]);

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
    setActiveCommentPostId(null);
    // Refresh comment count for the current post
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
              Posted by <strong>{post.username || post.userId}</strong> on {new Date(post.createdAt).toLocaleDateString()}
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
      </div>
    </div>
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

export default SinglePostView;
