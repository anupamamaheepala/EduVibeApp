import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/header.css';
import logo from '../images/logo.png';
import { AuthContext } from './AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleProtectedNav = (e, path) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="EduLearn Logo" />
        </div>
        <nav className="navigation">
          <ul>
            <li>
              <NavLink to="/" 
              className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <a
                href="/courses"
                onClick={(e) => handleProtectedNav(e, '/courses')}
                className={window.location.pathname === '/courses' ? 'active' : ''}
              >
                Courses
              </a>
            </li>
            <li>
              <a
                href="/posts"
                onClick={(e) => handleProtectedNav(e, '/posts')}
                className={window.location.pathname === '/posts' ? 'active' : ''}
              >
                Posts
              </a>
            </li>
            <li>
              <NavLink to="/about" 
              className={({ isActive }) => (isActive ? 'active' : '')}
              >
                About
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/resources" 
              className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Resources
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/contactus" 
              className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
