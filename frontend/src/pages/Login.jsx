import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/login.css';
import Header from './Header';
import Footer from './Footer';
import { AuthContext } from './AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [formData, setFormData] = useState({
    userIdentifier: '',
    password: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const clearForm = () => {
    setFormData({
      userIdentifier: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        userIdentifier: formData.userIdentifier,
        password: formData.password
      });

      const { token, username, userId } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);

      login(username, token, userId);
      
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in.'
      });
      navigate('/');
      clearForm();
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid username or password. Please try again.'
      });
      clearForm();
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded Google User:', decoded);

      const response = await axios.post('http://localhost:8000/api/auth/google-login', {
        googleId: decoded.sub,
        username: decoded.name || decoded.email,
        email: decoded.email,
        firstName: decoded.given_name || '',
        lastName: decoded.family_name || '',
        profilePicture: decoded.picture || ''
      });

      const { token, username, userId } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', decoded.email || '');
      localStorage.setItem('picture', decoded.picture || '');

      login(username, token, userId);

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        text: `Welcome ${username}!`
      });
      navigate('/');
    } catch (error) {
      console.error('Google Login error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.response?.data?.message || 'Please try again.'
      });
    }
  };

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
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Google Login Failed',
                  text: 'Please try again.'
                });
              }}
            />
          </div>

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