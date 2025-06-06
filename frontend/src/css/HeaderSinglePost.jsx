import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/header.css';
import logo from '../images/logo.png';
import { AuthContext } from './AuthContext'; // ✅ Add this

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext); // ✅ Get auth info

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="EduLearn Logo" />
        </div>

        <nav className="navigation">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink></li>
            <li><NavLink to="/posts" className={({ isActive }) => isActive ? 'active' : ''}>Posts</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
            <li><NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''}>Resources</NavLink></li>
            <li><NavLink to="/contactus" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
          </ul>
        </nav>

        {/* ✅ Conditional auth buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="user-name">
                <i className="fas fa-user"></i> {user?.username || 'User'}
              </span>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
