import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import '../../css/EditUserPosts.css';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import { AuthContext } from '../AuthContext';
import Swal from 'sweetalert2';

function EditUserPost() {
  const { isLoggedIn } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [originalPost, setOriginalPost] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [removedIndexes, setRemovedIndexes] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/edit-post/${postId}`);
        setOriginalPost(response.data);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to load post: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    let images = selectedFiles.filter(file => file.type.startsWith('image'));
    let video = selectedFiles.find(file => file.type.startsWith('video'));
    let newFiles = [...selectedFiles];
    let newPreviews = [...previews];

    for (const file of selected) {
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
            setSelectedFiles([...newFiles]);
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

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const uploadFileAndGetURL = async (file) => {
    const storageRef = ref(storage, `posts/${file.name + Date.now()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUpdate = async () => {
    if (!originalPost) return;
    setSaving(true);
    setMessage('');
  
    try {
      let mediaUrls = originalPost.mediaUrls.filter((_, idx) => !removedIndexes.includes(idx));
      let mediaTypes = originalPost.mediaTypes.filter((_, idx) => !removedIndexes.includes(idx));

      if (selectedFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          selectedFiles.map(async (file) => {
            const url = await uploadFileAndGetURL(file);
            return url;
          })
        );

        const uploadedTypes = selectedFiles.map((file) =>
          file.type.startsWith('image') ? 'image' : 'video'
        );

        mediaUrls = [...mediaUrls, ...uploadedUrls];
        mediaTypes = [...mediaTypes, ...uploadedTypes];
      }

      const updatedPost = {
        content,
        mediaUrls,
        mediaTypes,
      };

      await axios.put(`http://localhost:8000/api/edit-post/${postId}`, updatedPost, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      

      Swal.fire({
        title: 'Success!',
        text: 'Post updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard/MyPosts');
      });
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update post: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="page-container">
      {isLoggedIn ? <UserHeader /> : <Header />}
      <div className="edit-post-container">
        <h2>Edit Your Post</h2>
        <div className="edit-post-form">
          <label htmlFor="content">Post Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
          ></textarea>

{(originalPost?.mediaUrls?.length > 0 || previews.length > 0) && (
  <div className="media-preview">
    {originalPost?.mediaUrls?.map((url, index) => {
      if (removedIndexes.includes(index)) return null; // Skip removed

      const type = originalPost.mediaTypes?.[index] || (url.endsWith('.mp4') ? 'video' : 'image');
      return (
        <div key={`existing-${index}`} className="media-preview-item">
          <button className="remove-button" onClick={() => setRemovedIndexes(prev => [...prev, index])}>✖</button>
          {type === 'image' ? (
            <img src={url} alt={`Media ${index}`} />
          ) : (
            <video controls>
              <source src={url} type="video/mp4" />
            </video>
          )}
        </div>
      );
    })}

    {previews.map((src, index) => (
      <div key={`new-${index}`} className="media-preview-item">
        <button className="remove-button" onClick={() => {
          const updatedFiles = [...selectedFiles];
          const updatedPreviews = [...previews];
          updatedFiles.splice(index, 1);
          updatedPreviews.splice(index, 1);
          setSelectedFiles(updatedFiles);
          setPreviews(updatedPreviews);
        }}>✖</button>
        {selectedFiles[index]?.type.startsWith('image') ? (
          <img src={src} alt={`New Media ${index}`} />
        ) : (
          <video controls>
            <source src={src} />
          </video>
        )}
      </div>
    ))}
  </div>
)}

          <label htmlFor="media">Change Media (Optional):</label>
          <input
            id="media"
            type="file"
            multiple
            onChange={handleFileChange}
          />

          <button onClick={handleUpdate} disabled={saving} className="update-button">
            {saving ? 'Updating...' : 'Update Post'}
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

export default EditUserPost;
