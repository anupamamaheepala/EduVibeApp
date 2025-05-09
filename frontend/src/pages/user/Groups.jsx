import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import GroupPopup from './GroupPopup';
import '../../css/user/Groups.css';

const Groups = () => {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [following, setFollowing] = useState([]);
  const [showMemberPopup, setShowMemberPopup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchFollowing();
      fetchGroups();
    }
  }, [isLoggedIn, userId]);

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(response.data);
    } catch (err) {
      setError('Failed to fetch following list');
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/groups/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
    } catch (err) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/groups/create',
        { userId, groupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups([...groups, response.data]);
      setGroupName('');
      setShowMemberPopup(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const openGroupPopup = (group) => {
    setSelectedGroup(group);
  };

  const closeGroupPopup = () => {
    setSelectedGroup(null);
  };

  const handleGroupDeleted = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
    setSelectedGroup(null);
  };

  if (!isLoggedIn) {
    return <div>Please log in to view groups.</div>;
  }

  return (
    <div className="group-container">
      <h2 className="group-title">Groups</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      <div className="group-create-section">
        <input
          type="text"
          className="group-input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button className="group-button" onClick={handleCreateGroup} disabled={loading}>
          Create Group
        </button>
      </div>
      <div className="group-cards">
        {groups.map(group => (
          <div key={group.id} className="group-card" onClick={() => openGroupPopup(group)}>
            <span className="group-card-name">{group.name}</span>
          </div>
        ))}
      </div>
      {showMemberPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="popup-close" onClick={() => setShowMemberPopup(null)}>×</span>
            <h3 className="popup-title">Add Members to {showMemberPopup.name}</h3>
            <select
              multiple
              className="popup-select"
              onChange={(e) => {
                const options = e.target.options;
                const selected = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    selected.push(options[i].value);
                  }
                }
                selected.forEach(async memberId => {
                  try {
                    const token = localStorage.getItem('token');
                    await axios.post(
                      `http://localhost:8000/api/groups/${showMemberPopup.id}/add-member`,
                      { userId, memberId },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                  } catch (err) {
                    setError(err.response?.data || 'Failed to add member');
                  }
                });
              }}
            >
              {following.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <button
              className="popup-button"
              onClick={() => setShowMemberPopup(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
      {selectedGroup && (
        <GroupPopup
          group={selectedGroup}
          userId={userId}
          following={following}
          onClose={closeGroupPopup}
          onGroupDeleted={handleGroupDeleted}
        />
      )}
    </div>
  );
};

export default Groups;