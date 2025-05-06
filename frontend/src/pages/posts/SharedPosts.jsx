// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const SharedPosts = () => {
//   const [sharedPosts, setSharedPosts] = useState([]);
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     axios.get(`http://localhost:8000/api/shared-posts/user/${userId}`)
//       .then(res => setSharedPosts(res.data))
//       .catch(err => console.error('Error fetching shared posts:', err));
//   }, [userId]);

//   return (
//     <div className="shared-posts-page">
//       <h2>Posts Shared With You</h2>
//       {sharedPosts.length === 0 ? (
//         <p>No shared posts yet.</p>
//       ) : (
//         sharedPosts.map(post => (
//           <div key={post.id} className="shared-post-card">
//             <p><strong>Post ID:</strong> {post.postId}</p>
//             <p><strong>From:</strong> {post.fromUserId}</p>
//             <p><strong>Shared at:</strong> {new Date(post.sharedAt).toLocaleString()}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SharedPosts;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/ViewPosts.css'; // Use same styles as ViewPosts
import userLogo from '../../images/user.png';

const SharedPosts = () => {
  const [sharedData, setSharedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/shared-posts/user/${userId}`);
        const sharedPosts = response.data;

        // Fetch full post data for each shared post
        const detailedPosts = await Promise.all(sharedPosts.map(async (shared) => {
          const postRes = await axios.get(`http://localhost:8000/api/view-posts/${shared.postId}`);
          return {
            ...shared,
            post: postRes.data,
          };
        }));

        setSharedData(detailedPosts);
      } catch (err) {
        console.error('Error fetching shared post details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPosts();
  }, [userId]);

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="posts-container">
      <h2>Posts Shared With You</h2>
      {loading ? (
        <p>Loading shared posts...</p>
      ) : sharedData.length === 0 ? (
        <p>No shared posts found.</p>
      ) : (
        <div className="posts-feed">
          {sharedData.map(({ post, fromUserId, sharedAt, id }) => (
            <div key={id} className="post-card">
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
                  Originally posted by <strong>{post.username || post.userId}</strong> on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="post-meta">
                  Shared with you by <strong>{fromUserId}</strong> on {new Date(sharedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedPosts;


