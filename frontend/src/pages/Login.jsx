import React, { useState } from 'react';
import '../css/login.css';
import Header from './Header';
import Footer from './Footer';
//import googleIcon from './google-icon.png'; // Make sure to have this icon in your project

const Login = () => {
  const [formData, setFormData] = useState({
    userIdentifier: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process login form submission
    console.log('Login form submitted:', formData);
    // Add your API call or other logic here
  };

//   const handleGoogleLogin = () => {
//     // Implement Google authentication logic
//     console.log('Login with Google clicked');
//   };

  return (
    <div className="login-page">
      <Header />
      
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Log in to continue your learning journey</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="userIdentifier" className="login-label">Username or Email</label>
              <input
                type="text"
                id="userIdentifier"
                name="userIdentifier"
                className="login-input"
                placeholder="Enter your username or email"
                value={formData.userIdentifier}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="login-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="login-options">
              <div className="login-remember">
                <input type="checkbox" id="remember" className="login-checkbox" />
                <label htmlFor="remember" className="login-checkbox-label">Remember me</label>
              </div>
              <a href="/forgot-password" className="login-forgot-link">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-button">Log In</button>
          </form>
          
          <div className="login-divider">
            <span className="login-divider-text">OR LOGIN WITH</span>
          </div>
          
          {/* <button className="login-google-button" onClick={handleGoogleLogin}>
            <img src={googleIcon} alt="Google" className="login-google-icon" />
            <span>Login with Google</span>
          </button> */}
          
          <p className="login-signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;