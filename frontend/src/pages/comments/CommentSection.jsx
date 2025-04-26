import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import '../../css/CommentSection.css';

const CommentSection = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/comments/post/${postId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      postId,
      userId,
      username: username || 'Anonymous',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      const addedComment = await res.json();
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id); // Using id
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText }),
      });

      if (res.ok) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, text: editingText } : comment
          )
        );
        setEditingCommentId(null);
        setEditingText('');
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <div className="comments-list">
          {comments.map((c, index) => (
            <div key={index} className="comment">
              <span className="comment-username">{c.username}:</span>

              {editingCommentId === c.id ? ( // Using id here
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="comment-edit-input"
                  />
                  <div className="comment-actions">
                    <button onClick={() => handleSaveEdit(c.id)}>Save</button> {/* Using id here */}
                  </div>
                </>
              ) : (
                <>
                  <span className="comment-text">{c.text}</span>
                  {c.userId === userId && (
                    <div className="comment-actions">
                      <button onClick={() => handleEditClick(c)}>Edit</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="comment-input-box">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment} disabled={!newComment.trim()}>
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
