import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserPosts.css';
import DeleteUserPost from './DeleteUserPosts';
import { AuthContext } from '../AuthContext';
import userLogo from '../../images/user.png';
import ShareModal from './PostShareModal';

function UserPosts() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [sharingPostId, setSharingPostId] = useState(null);
  const currentUserId = localStorage.getItem('userId'); // ✅ Get logged-in userId
  const [openImage, setOpenImage] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
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
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUserId]);

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const toggleDropdown = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleEdit = (postId) => {
    navigate(`/EditUserPosts/${postId}`);
    setOpenDropdown(null);
  };

  const handleShare = (postId) => {
    setSharingPostId(postId);  // Open the modal
    setOpenDropdown(null);     // Close the dropdown
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedId));
    setOpenDropdown(null);
  };

  

  return (
    <div className="user-page-container">
      {/* {isLoggedIn ? <UserHeader /> : <Header />} */}
      <div className="user-posts-container">  
      <div className="header-actions">   
        <h2>My Posts</h2>
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
                  <div className="post-header">
                                    <div className="post-user">
                                      <img className="post-user-avatar" src={userLogo} alt="User avatar" />
                                      <span className="post-username">{post.username || post.userId}</span>
                                    </div>
                  
                                    <div className="post-right">
                                     
                                    </div>
                                  </div>
                  <div className="dropdown-container">
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

                {/* 🔥 Correct media display block */}
                {/* {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="media-gallery">
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
                )} */
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
                          >Your browser does not support the video tag.
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
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
          {/* ✅ PLACE THIS AFTER posts.map, BUT INSIDE THE RETURN */}
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
      <ShareModal
        postId={sharingPostId}
        onClose={() => setSharingPostId(null)}
      />
    )}
      {/* <Footer /> */}
    </div>
  );
}

export default UserPosts;
