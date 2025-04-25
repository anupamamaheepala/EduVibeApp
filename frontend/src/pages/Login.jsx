import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/login.css';
import Header from './Header';
import Footer from './Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    userIdentifier: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post('http://localhost:8000/api/auth/login', {
//       userIdentifier: formData.userIdentifier,
//       password: formData.password
//     });

//     const user = response.data;

//     // ✅ Save userId in localStorage for use in post creation
//     localStorage.setItem('userId', user.id); // or user._id if that's what's returned

//     console.log('Login successful:', user);
//     navigate('/');
//   } catch (error) {
//     console.error('Login error:', {
//       message: error.message,
//       response: error.response,
//       status: error.response?.status,
//       data: error.response?.data
//     });
//     alert(error.response?.data || 'Login failed. Please try again.');
//   }
// };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post('http://localhost:8000/api/auth/login', {
//       userIdentifier: formData.userIdentifier,
//       password: formData.password
//     });

//     const user = response.data;

//     // ✅ Save user info in localStorage
//     localStorage.setItem('userId', user.id);         // or user._id
//     localStorage.setItem('username', user.username); // ⬅️ added username here

//     console.log('Login successful:', user);
//     navigate('/');
//   } catch (error) {
//     console.error('Login error:', {
//       message: error.message,
//       response: error.response,
//       status: error.response?.status,
//       data: error.response?.data
//     });
//     alert(error.response?.data || 'Login failed. Please try again.');
//   }
// };


  const clearForm = () => {
    setFormData({
      userIdentifier: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/login', {
        userIdentifier: formData.userIdentifier,
        password: formData.password
      });
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in.'
      });
      navigate('/');
      clearForm();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password. Please try again.'
      });
      clearForm();
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
