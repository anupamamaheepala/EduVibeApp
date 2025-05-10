import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/userheader.css';
import logo from '../images/logo.png';
import userLogo from '../images/user.png';
import { AuthContext } from './AuthContext';
import Swal from 'sweetalert2';

const UserHeader = () => {
  const navigate = useNavigate();
  const { username, logout } = useContext(AuthContext);

  const handleUserLogoClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#773beb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  return (
    <header className="user-header">
      <div className="user-header-container">
        <div className="logo">
          <img src={logo} alt="EduLearn Logo" />
        </div>
        <nav className="navigation">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink to="/posts" className={({ isActive }) => (isActive ? 'active' : '')}>
                Posts
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                About
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/resources" className={({ isActive }) => (isActive ? 'active' : '')}>
                Resources
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/contactus" className={({ isActive }) => (isActive ? 'active' : '')}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="user-info">
          <img src={userLogo} alt="User Logo" className="user-logo" onClick={handleUserLogoClick} />
          <span className="username">{username || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

