import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/ViewPosts.css'; // reuse your existing styles
import userLogo from '../../images/user.png';
import CommentSection from '../comments/CommentSection';

const SinglePostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div className="posts-container">
      <div className="posts-feed">
        <div className="post-card">
          <div className="post-header">
            <div className="post-user">
              <img className="post-user-avatar" src={userLogo} alt="User avatar" />
              <span className="post-username">{post.username || post.userId}</span>
            </div>
            <span className="post-time">{getTimeAgo(post.createdAt)}</span>
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

          <div className="post-content">
            <p className="post-caption">{post.content}</p>
            <p className="post-meta">
              Posted by <strong>{post.username || post.userId}</strong> on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default SinglePostView;
