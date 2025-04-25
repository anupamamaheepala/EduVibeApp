import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../css/EditUserPosts.css';

function EditPost() {
  const { id } = useParams(); // Get the post ID from URL
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  // Fetch the post on component mount
  useEffect(() => {
    console.log("Post ID:", id);
    console.log("API Call:", `/api/view-posts/${id}`);

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/view-posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await response.json();
        setPost(postData);
        setContent(postData.content || '');
        setPreview(postData.mediaUrl || null);
      } catch (err) {
        setMessage('Error fetching post: ' + err.message);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    if (!fileType.startsWith('image') && !fileType.startsWith('video')) {
      setMessage('Please upload an image or video.');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!content && !file && !post?.mediaUrl) {
      setMessage('Please add a caption or media.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const updatedPost = {
        userId: post.userId,
        content,
        mediaUrl: file ? 'mock-url' : post.mediaUrl,
        mediaType: file
          ? file.type.startsWith('image') ? 'image' : 'video'
          : post.mediaType,
        createdAt: post.createdAt,
      };

      const response = await fetch(`/api/edit-posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        setMessage('Post updated successfully!');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setMessage('Failed to update post.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <div className="edit-post-container">
        <div className="edit-post-form">
          <h2>Edit Post</h2>

          {/* Preview */}
          {preview && (
            <div className="media-preview">
              {post?.mediaType === 'image' || (file && file.type?.startsWith('image')) ? (
                <img src={preview} alt="Preview" />
              ) : (
                <video controls>
                  <source src={preview} type={file?.type || post?.mediaType} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* File Upload */}
          <div className="file-input-container">
            <label>Update Image or Video (Optional)</label>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          </div>

          {/* Caption */}
          <div className="caption-container">
            <label>Caption</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>

          {/* Feedback Message */}
          {message && (
            <p
              className={`feedback-message ${
                message.includes('successfully') ? 'success' : 'error'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditPost;
