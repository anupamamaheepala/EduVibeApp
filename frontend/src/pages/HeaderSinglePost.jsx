import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/header.css';
import logo from '../images/logo.png';
import { AuthContext } from './AuthContext'; // ✅ Import context

const Header = ({ openPopup }) => {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="EduVibe Logo" />
        </div>

        <nav className="navigation">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
            <li><NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : '')}>Courses</NavLink></li>
            <li><NavLink to="/posts" className={({ isActive }) => (isActive ? 'active' : '')}>Posts</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink></li>
            <li><NavLink to="/resources" className={({ isActive }) => (isActive ? 'active' : '')}>Resources</NavLink></li>
            <li><NavLink to="/contactus" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <span className="user-info"><i className="fas fa-user"></i> {username}</span>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={openPopup}>
                Log In
              </button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// ✅ This must be at the top level (not inside any block)
export default Header;
