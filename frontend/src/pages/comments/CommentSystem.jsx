import React, { useState, useEffect } from 'react';
import '../../css/commentsystem.css';
import axios from 'axios';

const CommentSystem = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/comments/post/${postId}`);
        setComments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      postId: postId,
      userId: userId,      
      username: username, 
      text: newComment,
      createdAt: new Date(),
    };
    

    try {
      const response = await axios.post('http://localhost:8000/api/comments', newCommentObj);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-system">
      <h3 className="comments-title">Comments</h3>

      <form className="comment-form" onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
          Post
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar-circle">
                 {comment.username?.charAt(0).toUpperCase()}
              </div>

              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-timestamp">{formatTimestamp(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
