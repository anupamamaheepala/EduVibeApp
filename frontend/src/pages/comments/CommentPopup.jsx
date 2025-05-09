import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../AuthContext';
import '../../css/CommentPopup.css';

const CommentPopup = ({ postId, isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const modalRef = useRef(null);

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
    if (isOpen) {
      fetchComments();
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [postId, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      const addedComment = await res.json();
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
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

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    const replyData = {
      userId,
      username: username || 'Anonymous',
      text: replyText,
      createdAt: new Date().toISOString(),
      parentCommentId: commentId,
    };

    try {
      const res = await fetch('http://localhost:8000/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData),
      });

      const addedReply = await res.json();

      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...(comment.replies || []), addedReply] } 
            : comment
        )
      );

      setReplyText('');
      setReplyingToCommentId(null);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  if (!isOpen) return null;

  return (
    <div className="comment-popup-overlay">
      <div className="comment-popup-container" ref={modalRef}>
        <div className="comment-popup-header">
          <h3>Comments ({comments.length})</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="comment-popup-body">
          {loading ? (
            <div className="loading-indicator">Loading comments...</div>
          ) : (
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((c, index) => (
                  <div key={index} className="comment">
                    <div className="comment-header">
                      <span className="comment-username">{c.username}</span>
                      <small className="comment-time">{formatDateTime(c.createdAt)}</small>
                    </div>

                    {editingCommentId === c.id ? (
                      <>
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="comment-edit-input"
                        />
                        <div className="comment-actions">
                          <button onClick={() => handleSaveEdit(c.id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="comment-text">{c.text}</span>

                        {c.userId === userId && (
                          <div className="comment-actions">
                            <button onClick={() => handleEditClick(c)}>Edit</button>
                            <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="replies-list">
                        {c.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} className="reply">
                            <div className="comment-header">
                              <span className="comment-username">{reply.username}</span>
                              <small className="comment-time">{formatDateTime(reply.createdAt)}</small>
                            </div>
                            <span className="comment-text">{reply.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingToCommentId === c.id ? (
                      <div className="reply-form">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={handleReplyChange}
                        />
                        <button onClick={() => handleReply(c.id)}>Reply</button>
                        <button onClick={() => setReplyingToCommentId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingToCommentId(c.id)}>Reply</button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

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
    </div>
  );
};

export default CommentPopup;