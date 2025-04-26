import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../css/AddPosts.css';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase"; // your firebase.js file

function AddPost() {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let images = files.filter(file => file.type.startsWith('image'));
    let video = files.find(file => file.type.startsWith('video'));
    let newFiles = [...files];
    let newPreviews = [...previews];

    for (const file of selectedFiles) {
      const type = file.type;

      if (type.startsWith('image')) {
        if (images.length >= 3) {
          setMessage('You can only upload up to 3 images.');
          continue;
        }
        images.push(file);
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else if (type.startsWith('video')) {
        if (video) {
          setMessage('Only one video is allowed per post.');
          continue;
        }

        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          if (videoElement.duration > 30) {
            setMessage('Video must be 30 seconds or less.');
          } else {
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
            setFiles([...newFiles]);
            setPreviews([...newPreviews]);
            setMessage('');
          }
        };
        videoElement.src = URL.createObjectURL(file);
        return;
      } else {
        setMessage('Only images and videos are allowed.');
      }
    }

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const uploadFileAndGetURL = async (file) => {
    const storageRef = ref(storage, `posts/${file.name + Date.now()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!userId || !username) {
      setMessage('User not logged in.');
      return;
    }

    if (!content && files.length === 0) {
      setMessage('Please add a caption or media.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let mediaUrls = [];
      let mediaTypes = [];

      if (files.length > 0) {
        // Upload all files and get URLs
        mediaUrls = await Promise.all(
          files.map(async (file) => {
            const url = await uploadFileAndGetURL(file);
            return url;
          })
        );

        // Detect media types
        mediaTypes = files.map((file) =>
          file.type.startsWith('image') ? 'image' : 'video'
        );
      }

      const postData = {
        userId,
        username,
        content,
        mediaUrls,
        mediaTypes,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:8000/api/add-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to create post.');
      }

      setMessage('Post created successfully!');
      setContent('');
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      setMessage('Error: ' + error.message);
      console.error('Post creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <div className="add-post-container">
        <div className="add-post-form">
          <h2>Create a Post</h2>

          {previews.length > 0 && (
            <div className="media-preview">
              {previews.map((src, idx) => (
                <div key={idx} className="media-preview-item">
                  <button className="remove-button" onClick={() => handleRemoveFile(idx)}>✖</button>
                  {files[idx].type.startsWith('image') ? (
                    <img src={src} alt="Preview" />
                  ) : (
                    <video controls aria-label="Video preview">
                      <source src={src} type={files[idx].type} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="file-input-container">
            <label>Add Images or Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <div className="caption-container">
            <label>Caption</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="submit-button">
            {loading ? 'Posting...' : 'Post'}
          </button>

          {message && (
            <p className={`feedback-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddPost;
