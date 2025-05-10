import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../../css/user/Groups.css';

const GroupPopup = ({ group, userId, following, onClose, onGroupDeleted }) => {
  const [view, setView] = useState('chat'); // 'chat' or 'members'
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/groups/${group.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch usernames for messages
      const messagesWithUsers = await Promise.all(
        response.data.map(async msg => {
          const user = await axios.get(`http://localhost:8000/api/auth/user/${msg.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { ...msg, username: user.data.username };
        })
      );
      setMessages(messagesWithUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    }
  }, [group.id, userId]);

  const fetchMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/groups/${group.id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members');
    }
  }, [group.id]);

  useEffect(() => {
    if (view === 'chat') {
      fetchMessages();
    } else {
      fetchMembers();
    }
  }, [view, group.id, fetchMessages, fetchMembers]);

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/groups/${group.id}/messages`,
        { userId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = await axios.get(`http://localhost:8000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([...messages, { ...response.data, username: user.data.username }]);
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleEditMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/groups/messages/${editMessageId}`,
        { userId, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = await axios.get(`http://localhost:8000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.map(msg =>
        msg.id === editMessageId ? { ...response.data, username: user.data.username } : msg
      ));
      setEditMessageId(null);
      setEditContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/groups/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/groups/${group.id}/add-member`,
        { userId, memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/groups/${group.id}/remove-member`,
        { userId, memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/groups/${group.id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });
      onGroupDeleted(group.id);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete group');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="popup-close" onClick={onClose}>×</span>
        <h3 className="popup-title">{group.name}</h3>
        <div>
          <button
            className="popup-button"
            onClick={() => setView('chat')}
            style={{ backgroundColor: view === 'chat' ? 'var(--primary-dark)' : 'var(--primary)' }}
          >
            Chat
          </button>
          <button
            className="popup-button"
            onClick={() => setView('members')}
            style={{ backgroundColor: view === 'members' ? 'var(--primary-dark)' : 'var(--primary)' }}
          >
            Members
          </button>
          {group.creatorId === userId && (
            <button
              className="group-delete-button"
              onClick={handleDeleteGroup}
            >
              Delete Group
            </button>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
        {view === 'chat' ? (
          <>
            <div className="chat-messages">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`chat-message ${message.userId === userId ? 'own' : ''}`}
                >
                  <div className="chat-message-header">
                    <span className="chat-message-username">{message.username}</span>
                    <span className="chat-message-timestamp">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="chat-message-content">{message.content}</div>
                  {message.userId === userId && (
                    <div className="chat-message-actions">
                      <button
                        className="chat-message-action"
                        onClick={() => {
                          setEditMessageId(message.id);
                          setEditContent(message.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="chat-message-action"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="chat-send-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="group-members">
            {members.map(member => (
              <div key={member.id} className="group-member">
                <img src={member.profilePicture || '/default-profile.png'} alt={member.username} />
                <span className="group-member-name">{member.username}</span>
                {group.creatorId === userId && member.id !== userId && (
                  <button
                    className="group-member-remove"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {group.creatorId === userId && (
              <select
                className="popup-select"
                onChange={(e) => handleAddMember(e.target.value)}
                value=""
              >
                <option value="">Add Member</option>
                {following
                  .filter(user => !members.some(m => m.id === user.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}
      </div>
      {editMessageId && (
        <div className="popup-overlay">
          <div className="edit-popup-content">
            <span className="popup-close" onClick={() => setEditMessageId(null)}>×</span>
            <h3 className="popup-title">Edit Message</h3>
            <input
              type="text"
              className="edit-input"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button className="popup-button" onClick={handleEditMessage}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPopup;