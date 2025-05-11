import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext';
import '../../css/user/Settings.css';

const Settings = () => {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (formData.newPassword !== formData.confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'Please ensure the new password and confirmation match.',
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Password',
        text: 'New password must be at least 8 characters long.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/auth/reset-password',
        {
          userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your password has been successfully updated.',
      });
      clearForm();
    } catch (error) {
      console.error('Password reset error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-content">
          <h1 className="settings-title">Account Settings</h1>
          <div className="password-reset-section">
            <h2 className="password-reset-subtitle">Reset Password</h2>
            <form className="password-reset-form" onSubmit={handleSubmit}>
              <div className="password-reset-group">
                <label htmlFor="currentPassword" className="password-reset-label">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="password-reset-input"
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="password-reset-group">
                <label htmlFor="newPassword" className="password-reset-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="password-reset-input"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="password-reset-group">
                <label htmlFor="confirmNewPassword" className="password-reset-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  className="password-reset-input"
                  placeholder="Confirm your new password"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="password-reset-button-container">
                <button
                  type="submit"
                  className="password-reset-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;