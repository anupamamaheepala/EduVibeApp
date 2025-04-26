import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import '../../css/user/UserDashboard.css'; // Reuse your existing CSS
import defaultProfilePic from '../../images/user.png'; // Add a default image in your assets
import Swal from 'sweetalert2';

// const UserDashboard = () => {
//   const { username, isLoggedIn } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUser, setEditedUser] = useState({});
//   const [profilePic, setProfilePic] = useState(null);
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     if (isLoggedIn && userId) {
//       fetchUserData();
//     }
//   }, [isLoggedIn, userId]);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}`);
//       setUser(response.data);
//       setEditedUser(response.data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedUser(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePic(reader.result);
//         setEditedUser(prev => ({ ...prev, profilePicture: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://localhost:8000/api/auth/user/${userId}`,
//         editedUser
//       );
//       setUser(response.data);
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   if (!user) {
//     return <div className="user-dashboard">Loading...</div>;
//   }

//   return (
//     <div className="user-dashboard">
//       <div className="dashboard-container">
//         <div className="dashboard-content">
//           <h1 className="dashboard-title">Your Profile</h1>
          
//           <div className="user-profile">
//             <label className="profile-picture-container">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePicChange}
//                 style={{ display: 'none' }}
//                 disabled={!isEditing}
//               />
//               <img
//                 src={user.profilePicture || profilePic || defaultProfilePic}
//                 alt="Profile"
//                 className="profile-picture"
//               />
//               {isEditing && (
//                 <div className="profile-picture-edit">Change Photo</div>
//               )}
//             </label>

//             <form onSubmit={handleSubmit} className="profile-details">
//               <div className="detail-row">
//                 <div className="detail-group">
//                   <label className="detail-label">First Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={editedUser.firstName || ''}
//                       onChange={handleInputChange}
//                       className="detail-value"
//                       style={{ background: 'white' }}
//                     />
//                   ) : (
//                     <div className="detail-value">{user.firstName}</div>
//                   )}
//                 </div>
//                 <div className="detail-group">
//                   <label className="detail-label">Last Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={editedUser.lastName || ''}
//                       onChange={handleInputChange}
//                       className="detail-value"
//                       style={{ background: 'white' }}
//                     />
//                   ) : (
//                     <div className="detail-value">{user.lastName}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="detail-group">
//                 <label className="detail-label">Username</label>
//                 <div className="detail-value">{user.username}</div>
//               </div>

//               <div className="detail-group">
//                 <label className="detail-label">Email</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     name="email"
//                     value={editedUser.email || ''}
//                     onChange={handleInputChange}
//                     className="detail-value"
//                     style={{ background: 'white' }}
//                   />
//                 ) : (
//                   <div className="detail-value">{user.email}</div>
//                 )}
//               </div>

//               <div className="detail-group">
//                 <label className="detail-label">Phone Number</label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={editedUser.phoneNumber || ''}
//                     onChange={handleInputChange}
//                     className="detail-value"
//                     style={{ background: 'white' }}
//                   />
//                 ) : (
//                   <div className="detail-value">{user.phoneNumber}</div>
//                 )}
//               </div>

//               <div className="detail-group">
//                 <label className="detail-label">Address</label>
//                 {isEditing ? (
//                   <textarea
//                     name="address"
//                     value={editedUser.address || ''}
//                     onChange={handleInputChange}
//                     className="detail-value"
//                     style={{ background: 'white', minHeight: '80px' }}
//                   />
//                 ) : (
//                   <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
//                     {user.address}
//                   </div>
//                 )}
//               </div>

//               {isEditing ? (
//                 <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//                   <button type="submit" className="edit-button">
//                     Save Changes
//                   </button>
//                   <button
//                     type="button"
//                     className="edit-button"
//                     style={{ backgroundColor: 'var(--error-color)' }}
//                     onClick={() => {
//                       setIsEditing(false);
//                       setEditedUser(user);
//                       setProfilePic(null);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   className="edit-button"
//                   onClick={() => setIsEditing(true)}
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

const UserDashboard = () => {
  const { userId, username } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/user/${userId}`,
        editedUser
      );
      setUser(response.data);
      setIsEditing(false);
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
                    <div className="detail-value">{user?.firstName}</div>
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
                    <div className="detail-value">{user?.lastName}</div>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <label className="detail-label">Username</label>
                <div className="detail-value">{username}</div>
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
                  <div className="detail-value">{user?.email}</div>
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
                  <div className="detail-value">{user?.phoneNumber}</div>
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

              {isEditing ? (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button type="submit" className="edit-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="edit-button"
                    style={{ backgroundColor: 'var(--error-color)' }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser(user);
                      setProfilePic(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>                
              ) : (
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;