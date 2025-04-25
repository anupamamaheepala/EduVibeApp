import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/userheader.css';
import logo from '../images/logo.png';
import userLogo from '../images/user.png';

const UserHeader = () => {
  const navigate = useNavigate();

  // Assume username is stored in localStorage after login
  const username = localStorage.getItem('username') || 'User';

  const handleUserLogoClick = () => {
    navigate('/dashboard');
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
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/posts"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/resources"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Resources
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="user-info">
          <img
            src={userLogo}
            alt="User Logo"
            className="user-logo"
            onClick={handleUserLogoClick}
          />
          <span className="username">{username}</span>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;