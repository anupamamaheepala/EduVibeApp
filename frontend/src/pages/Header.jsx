import React from 'react';
import '../css/header.css';
import logo from '../images/logo.png'; // Import the logo image

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="EduLearn Logo" />
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="/" className="active">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/contact">Contact</a></li>
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