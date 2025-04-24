import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import '../css/header.css';
import logo from '../images/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
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
        <div className="auth-buttons">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;