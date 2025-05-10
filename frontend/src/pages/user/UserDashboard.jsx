import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../../css/user/UserDashboard.css';
import defaultProfilePic from '../../images/user.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const UserDashboard = () => {
  const { userId, username, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setEditedUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err.response?.data || err.message);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchFollowers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}/followers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowers(response.data);
    } catch (err) {
      console.error('Failed to fetch followers:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load followers.'
      });
    }
  }, [userId]);

  const fetchFollowing = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}/following`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowing(response.data);
    } catch (err) {
      console.error('Failed to fetch following:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load following.'
      });
    }
  }, [userId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/search?username=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSearchResults(response.data.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to search users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to search users.'
      });
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/auth/user/${userId}/follow/${targetUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchUserData();
      await fetchFollowing();
      handleSearch();
      Swal.fire({
        icon: 'success',
        title: 'Followed',
        text: 'You are now following this user.'
      });
    } catch (err) {
      console.error('Failed to follow user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data || 'Failed to follow user.'
      });
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/auth/user/${userId}/unfollow/${targetUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchUserData();
      await fetchFollowing();
      handleSearch();
      Swal.fire({
        icon: 'success',
        title: 'Unfollowed',
        text: 'You have unfollowed this user.'
      });
    } catch (err) {
      console.error('Failed to unfollow user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data || 'Failed to unfollow user.'
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      console.error('Failed to upload profile picture to Firebase:', err);
      throw new Error('Failed to upload profile picture.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let updatedUser = editedUser;

      if (profilePicFile) {
        const profilePicURL = await uploadProfilePicToFirebase(profilePicFile);
        updatedUser = { ...updatedUser, profilePicture: profilePicURL };
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/auth/user/${userId}`,
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      setEditedUser(response.data);
      setIsEditing(false);
      setProfilePicFile(null);
      setProfilePicPreview(null);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes have been saved successfully.'
      });
    } catch (err) {
      console.error('Failed to update user:', err.response?.data || err.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const handleDeleteProfile = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Deleting your profile is permanent and cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#773beb',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await logout();
        Swal.fire({
          icon: 'success',
          title: 'Profile Deleted',
          text: 'Your profile has been successfully deleted.',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/login');
      } catch (err) {
        console.error('Failed to delete profile:', err.response?.data || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: err.response?.data?.message || 'Failed to delete profile. Please try again.'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="user-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-dashboard">
        <div className="error-message">
          <p>{error || 'No user data available. Please try again.'}</p>
          <button onClick={fetchUserData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div >
        <div className="dashboard-content">
          <h1 className="dashboard-title">Your Profile</h1>

          <div className="user-profile">
            <label className="profile-picture-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: 'none' }}
                disabled={!isEditing}
              />
              <img
                src={profilePicPreview || user.profilePicture || defaultProfilePic}
                alt="Profile"
                className="profile-picture"
              />
              {isEditing && (
                <div className="profile-picture-edit">Change Photo</div>
              )}
            </label>

            <div className="follow-stats">
              <div className="follow-stat" onClick={() => { setShowFollowers(true); fetchFollowers(); }}>
                <span className="count">{user.followers?.length || 0}</span>
                <span>Followers</span>
              </div>
              <div className="follow-stat" onClick={() => { setShowFollowing(true); fetchFollowing(); }}>
                <span className="count">{user.following?.length || 0}</span>
                <span>Following</span>
              </div>
            </div>

            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search users by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            {searchResults.length > 0 && (
              <div className="user-list">
                {searchResults.map((u) => (
                  <div key={u.id} className="user-item">
                    <img src={u.profilePicture || defaultProfilePic} alt={u.username} />
                    <span>{u.username}</span>
                    {user.following?.includes(u.id) ? (
                      <button
                        className="unfollow-button"
                        onClick={() => handleUnfollow(u.id)}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="follow-button"
                        onClick={() => handleFollow(u.id)}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showFollowers && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <span className="popup-close" onClick={() => setShowFollowers(false)}>&times;</span>
                  <h2 className="popup-title">Followers</h2>
                  <div className="user-list">
                    {followers.length > 0 ? (
                      followers.map((u) => (
                        <div key={u.id} className="user-item">
                          <img src={u.profilePicture || defaultProfilePic} alt={u.username} />
                          <span>{u.username}</span>
                        </div>
                      ))
                    ) : (
                      <p>No followers yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showFollowing && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <span className="popup-close" onClick={() => setShowFollowing(false)}>&times;</span>
                  <h2 className="popup-title">Following</h2>
                  <div className="user-list">
                    {following.length > 0 ? (
                      following.map((u) => (
                        <div key={u.id} className="user-item">
                          <img src={u.profilePicture || defaultProfilePic} alt={u.username} />
                          <span>{u.username}</span>
                          <button
                            className="unfollow-button"
                            onClick={() => handleUnfollow(u.id)}
                          >
                            Unfollow
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>Not following anyone yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-details">
              <div className="detail-row">
                <div className="detail-group">
                  <label className="detail-label">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editedUser.firstName || ''}
                      onChange={handleInputChange}
                      className="detail-value editable"
                    />
                  ) : (
                    <div className="detail-value">{user.firstName || 'Not provided'}</div>
                  )}
                </div>
                <div className="detail-group">
                  <label className="detail-label">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editedUser.lastName || ''}
                      onChange={handleInputChange}
                      className="detail-value editable"
                    />
                  ) : (
                    <div className="detail-value">{user.lastName || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <label className="detail-label">Username</label>
                <div className="detail-value">{username || 'Not provided'}</div>
              </div>

              <div className="detail-group">
                <label className="detail-label">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleInputChange}
                    className="detail-value editable"
                  />
                ) : (
                  <div className="detail-value">{user.email || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-group">
                <label className="detail-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedUser.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="detail-value editable"
                  />
                ) : (
                  <div className="detail-value">{user.phoneNumber || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-group">
                <label className="detail-label">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editedUser.address || ''}
                    onChange={handleInputChange}
                    className="detail-value editable"
                    rows="3"
                  />
                ) : (
                  <div className="detail-value address-value">
                    {user.address || 'No address provided'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="button-container">
                  <button type="submit" className="edit-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="edit-button cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>

            {!isEditing && (
              <div className="button-container">
                <button
                  type="button"
                  className="edit-button"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="edit-button delete-button"
                  onClick={handleDeleteProfile}
                >
                  Delete Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;