import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import '../../css/ViewPosts.css';
import { AuthContext } from '../AuthContext';
import userLogo from '../../images/user.png';
import CommentSection from '../comments/CommentSection';


function Posts() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
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
                    const images = post.mediaUrls.filter((url, idx) => (post.mediaTypes?.[idx] || url.endsWith('.mp4')) !== 'video');
                    const videos = post.mediaUrls.filter((url, idx) => (post.mediaTypes?.[idx] || url.endsWith('.mp4')) === 'video');
                    const mediaCount = post.mediaUrls.length;
                  
                    let mediaClass = 'media-gallery';
                  
                    if (mediaCount === 1) {
                      mediaClass += videos.length ? ' media-video-only' : ' media-1';
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

                {/*Comment system component */}
                <CommentSection postId={post.id} />

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Posts;
