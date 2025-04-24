import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddPost() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    if (!fileType.startsWith('image') && !fileType.startsWith('video')) {
      setMessage("Only image or video files are allowed.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const fileRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const mediaType = file.type.startsWith('image') ? 'image' : 'video';

      const postData = {
        userId: "testUser",
        content,
        mediaUrl: downloadURL,
        mediaType,
        createdAt: new Date()
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        setMessage("✅ Post added successfully!");
        setContent('');
        setFile(null);
        setPreview(null);
      } else {
        setMessage("❌ Failed to add post.");
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Post</h2>

      <textarea
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <input type="file" onChange={handleFileChange} />

      {/* Media Preview */}
      {preview && (
        <div style={{ marginTop: '10px' }}>
          {file.type.startsWith('image') ? (
            <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          ) : (
            <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
              <source src={preview} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Post"}
      </button>

      <p>{message}</p>
    </div>
  );
}

export default AddPost;
