import React from 'react';

const ViewSinglePost = ({ post }) => {
  return (
    <div className="post-content">
      <p className="post-caption">{post.content}</p>
      <p className="post-meta">
        Posted by {post.userId} on {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ViewSinglePost;