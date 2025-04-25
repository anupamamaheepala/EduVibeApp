import React, { useState, useEffect } from 'react';
import '../../css/commentsystem.css';



// Mock data for testing until backend is implemented
const MOCK_COMMENTS = [
    {
      id: 1,
      username: 'johndoe',
      userAvatar: '/api/placeholder/40/40',
      text: 'This learning plan is really helpful! Thanks for sharing.',
      timestamp: '2025-04-21T15:30:00',
      likes: 5,
      isLiked: false,
      isOwner: false
    },
    {
      id: 2,
      username: 'currentUser',
      userAvatar: '/api/placeholder/40/40',
      text: 'I found this particularly useful for beginners.',
      timestamp: '2025-04-22T09:15:00',
      likes: 2,
      isLiked: true,
      isOwner: true
    }
  ];
  
  const CommentSystem = ({ 
    postId, 
    currentUser = 'currentUser', 
    isPostOwner = false,
    initialPostLikes = 24,
    initialPostLikeStatus = false
  }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [postLikes, setPostLikes] = useState(initialPostLikes);
    const [postLiked, setPostLiked] = useState(initialPostLikeStatus);
  
    useEffect(() => {
      // Simulate loading data from API
      const fetchComments = async () => {
        // This would be replaced with an actual API call
        setTimeout(() => {
          setComments(MOCK_COMMENTS);
          setIsLoading(false);
        }, 800);
      };
  
      fetchComments();
    }, [postId]);
  
    const handleTogglePostLike = () => {
      // In a real implementation, this would call an API
      if (postLiked) {
        setPostLikes(postLikes - 1);
      } else {
        setPostLikes(postLikes + 1);
      }
      setPostLiked(!postLiked);
    };
  
    const handleAddComment = (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
  
      // This would be an API call in the actual implementation
      const newCommentObj = {
        id: comments.length + 1,
        username: currentUser,
        userAvatar: '/api/placeholder/40/40',
        text: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        isOwner: true
      };
  
      setComments([...comments, newCommentObj]);
      setNewComment('');
    };
  
    const handleEditComment = (id) => {
      const comment = comments.find(c => c.id === id);
      if (comment) {
        setEditingComment(id);
        setEditText(comment.text);
      }
    };
  
    const handleSaveEdit = (id) => {
      setComments(comments.map(c => 
        c.id === id ? { ...c, text: editText } : c
      ));
      setEditingComment(null);
      setEditText('');
    };
  
    const handleDeleteComment = (id) => {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        setComments(comments.filter(c => c.id !== id));
      }
    };
  
    const handleLikeComment = (id) => {
      setComments(comments.map(c => {
        if (c.id === id) {
          const newLikeStatus = !c.isLiked;
          return { 
            ...c, 
            isLiked: newLikeStatus,
            likes: newLikeStatus ? c.likes + 1 : c.likes - 1
          };
        }
        return c;
      }));
    };
  
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    if (isLoading) {
      return <div className="comments-loading">Loading comments...</div>;
    }
  
    return (
      <div className="comment-system">
        {/* Post Likes Section */}
        <div className="post-engagement">
          <button 
            className={`like-button ${postLiked ? 'liked' : ''}`}
            onClick={handleTogglePostLike}
          >
            <svg className="like-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10V16H4V10H7ZM11.5 4C12.2 4 12.81 4.53 12.97 5.23L13.5 7.5H19C19.55 7.5 20 7.95 20 8.5V9.54L18.5 16.5H9.5V9L11.5 4Z" 
                fill={postLiked ? "#4a6cfa" : "none"} 
                stroke={postLiked ? "#4a6cfa" : "#555"} 
                strokeWidth="1.5" />
            </svg>
            <span>{postLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <div className="like-counter">
            <span className="like-count">{postLikes}</span> 
            <span className="like-label">likes</span>
          </div>
          
          <div className="comment-counter">
            <span className="comment-count">{comments.length}</span>
            <span className="comment-label">comments</span>
          </div>
        </div>
        
        <h3 className="comments-title">Comments</h3>
        
        <form className="comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </form>
  
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  <img src={comment.userAvatar} alt={`${comment.username}'s avatar`} />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-timestamp">{formatTimestamp(comment.timestamp)}</span>
                  </div>
  
                  {editingComment === comment.id ? (
                    <div className="comment-edit">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="comment-edit-input"
                      />
                      <div className="comment-edit-actions">
                        <button 
                          onClick={() => handleSaveEdit(comment.id)}
                          className="comment-save-btn"
                          disabled={!editText.trim()}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingComment(null)}
                          className="comment-cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-text">{comment.text}</p>
                  )}
  
                  <div className="comment-actions">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className={`comment-like-btn ${comment.isLiked ? 'liked' : ''}`}
                    >
                      {comment.isLiked ? 'Unlike' : 'Like'} • {comment.likes}
                    </button>
  
                    {(comment.username === currentUser) && (
                      <>
                        <button 
                          onClick={() => handleEditComment(comment.id)}
                          className="comment-edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="comment-delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    
                    {isPostOwner && !comment.isOwner && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="comment-delete-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default CommentSystem;