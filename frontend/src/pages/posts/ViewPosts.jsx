import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../css/ViewPosts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Error fetching posts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="page-container">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="posts-container">
        <div className="posts-header">
          <h1>Community Posts</h1>
          <a href="/add-post" className="create-post-button">Create Post</a>
        </div>

        {/* Posts Feed */}
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
                {post.mediaUrl && (
                  <div className="post-media">
                    {post.mediaType === 'image' ? (
                      <img src={post.mediaUrl} alt="Post media" />
                    ) : (
                      <video controls aria-label="Post video">
                        <source src={post.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
                <div className="post-content">
                  <p className="post-caption">{post.content}</p>
                  <p className="post-meta">
                    Posted by {post.userId} on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default Posts;