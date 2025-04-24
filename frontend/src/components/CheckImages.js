// src/components/CheckImages.js
import React, { useEffect, useState } from "react";

const CheckImages = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stored Posts from MongoDB</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>Content:</strong> {post.content}</p>
          <p><strong>Media Type:</strong> {post.mediaType}</p>
          {post.mediaType === "image" ? (
            <img src={post.mediaUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
          ) : (
            <video controls style={{ maxWidth: "100%" }}>
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckImages;
