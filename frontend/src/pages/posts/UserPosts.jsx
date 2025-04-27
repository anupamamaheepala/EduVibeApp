import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserPosts.css';
import DeleteUserPost from './DeleteUserPosts';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import { AuthContext } from '../AuthContext';

function UserPosts() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem('userId'); // ✅ Get logged-in userId

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
        setPosts(response.data);
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUserId]);

  const toggleDropdown = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleEdit = (postId) => {
    navigate(`/EditUserPosts/${postId}`);
    setOpenDropdown(null);
  };

  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post URL copied to clipboard!');
    });
    setOpenDropdown(null);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedId));
    setOpenDropdown(null);
  };

  return (
    <div className="page-container">
      {/* {isLoggedIn ? <UserHeader /> : <Header />} */}
      <div className="user-posts-container">     
        <h2>Your Posts</h2>
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
                  <div className="dropdown-container">
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
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default UserPosts;
