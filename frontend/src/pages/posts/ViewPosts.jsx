import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import '../../css/ViewPosts.css';
import { AuthContext } from '../AuthContext';
import userLogo from '../../images/user.png';
import CommentPopup from '../comments/CommentPopup';


function Posts() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});


  const BACKEND_URL = 'http://localhost:8000/api/view-posts';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(BACKEND_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    // Refresh comment counts after closing
    fetchCommentCounts(posts);
  };
  
  const getCommentCount = (postId) => {
    return commentCounts[postId] || 0;
  };

  



  return (
    <div className="page-container">
      {isLoggedIn ? <UserHeader /> : <Header />}

      <div className="posts-container">
        <div className="posts-header">
          <h1>Community Posts</h1>
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
          <p className="no-posts">No posts available. Be the first to create one!</p>
        ) : (
          <div className="posts-feed">
            {posts.map((post) => (
              <div key={post.id} className="post-card">

                {/* Post Header */}
                <div className="post-header">
                 
                  <div className="post-user">
                    
                    <img
                      className="post-user-avatar"
                      src={userLogo}
                      alt="User avatar"
                    />
                    
                    <span className="post-username">{post.username || post.userId}</span>
                  </div>
                  <span className="post-time">{getTimeAgo(post.createdAt)}</span>
                </div>

                {/* Media Section */}
                {/* {post.mediaUrls && post.mediaUrls.length > 0 && (() => {
                  const mediaCount = post.mediaUrls.length;
                  const hasVideo = post.mediaUrls.some((url, idx) =>
                    (post.mediaTypes?.[idx] || url.endsWith('.mp4')) === 'video'
                  );

                  let mediaClass = 'media-gallery';

                  if (hasVideo && mediaCount === 1) {
                    mediaClass += ' media-video-only';
                  } else if (mediaCount === 4) {
                    mediaClass += ' media-4'; // new class for 4 media items
                  } else if (hasVideo) {
                    mediaClass += ' media-video-image';
                  } else {
                    mediaClass += ` media-${mediaCount}`;
                  }
                  

                  return (
                    <div className={mediaClass}>
                      {post.mediaUrls.map((url, index) => {
                        const type = post.mediaTypes?.[index] || (url.endsWith('.mp4') ? 'video' : 'image');
                        return type === 'image' ? (
                          <img key={index} src={url} alt={`Post media ${index}`} />
                        ) : (
                          <video key={index} controls aria-label={`Post video ${index}`}>
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      })}
                    </div>
                  );
                })()} */
                  post.mediaUrls && post.mediaUrls.length > 0 && (() => {
  const mediaCount = post.mediaUrls.length;

  let mediaClass = 'media-gallery';
  if (mediaCount === 1) {
    mediaClass += ' media-1';
  } else if (mediaCount === 2) {
    mediaClass += ' media-2';
  } else if (mediaCount === 3) {
    mediaClass += ' media-3';
  } else if (mediaCount === 4) {
    mediaClass += ' media-4';
  }

  return (
    <div className={mediaClass}>
      {post.mediaUrls.map((url, index) => {
        const type = post.mediaTypes?.[index] || (url.endsWith('.mp4') ? 'video' : 'image');
        return type === 'image' ? (
          <img key={index} src={url} alt={`Post media ${index}`} />
        ) : (
          <video key={index} controls aria-label={`Post video ${index}`}>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      })}
    </div>
  );
})()}

                  
                
                {/*<PostWithComments post={post} />*/}
                {/* Post Content */}
                <div className="post-content">
                  <p className="post-caption">{post.content}</p>
                  <p className="post-meta">
                    Posted by {post.username || post.userId} on {new Date(post.createdAt).toLocaleDateString()}
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
                  <button className="post-action-btn share-btn">
                    <i className="far fa-share-square"></i> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Popup */}
      {activeCommentPostId && (
        <CommentPopup 
          postId={activeCommentPostId} 
          isOpen={activeCommentPostId !== null} 
          onClose={closeComments} 
        />
      )}

      <Footer />
    </div>
  );
}

export default Posts;