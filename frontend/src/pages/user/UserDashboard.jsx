import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../../css/user/UserDashboard.css';
import defaultProfilePic from '../../images/user.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { userId, username, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}`);
      setUser(response.data);
      setEditedUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setEditedUser(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called with editedUser:', editedUser);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/user/${userId}`,
        editedUser
      );
      setUser(response.data);
      setIsEditing(false);
      setProfilePic(null);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes have been saved successfully.'
      });
    } catch (err) {
      console.error('Failed to update user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    console.log('Edit Profile clicked, setting isEditing to true');
    setIsEditing(true);
  };

  const handleCancel = () => {
    console.log('Cancel clicked, resetting state');
    setIsEditing(false);
    setEditedUser(user);
    setProfilePic(null);
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
        await axios.delete(`http://localhost:8000/api/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
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
        console.error('Failed to delete profile:', err);
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

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUserData}>Retry</button>
        </div>
      </div>
    );
  }

  console.log('Rendering with isEditing:', isEditing);

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
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
                src={user?.profilePicture || profilePic || defaultProfilePic}
                alt="Profile"
                className="profile-picture"
              />
              {isEditing && (
                <div className="profile-picture-edit">Change Photo</div>
              )}
            </label>

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
                    <div className="detail-value">{user?.firstName || 'Not provided'}</div>
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
                    <div className="detail-value">{user?.lastName || 'Not provided'}</div>
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
                  <div className="detail-value">{user?.email || 'Not provided'}</div>
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
                  <div className="detail-value">{user?.phoneNumber || 'Not provided'}</div>
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
                    {user?.address || 'No address provided'}
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