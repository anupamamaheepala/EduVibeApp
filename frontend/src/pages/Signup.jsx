import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css';
import Header from './Header';
import Footer from './Footer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password
      });
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      alert(error.response?.data || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <Header />
      
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join our learning community today</p>
          
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-row">
              <div className="signup-form-group">
                <label htmlFor="firstName" className="signup-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="signup-input"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="signup-form-group">
                <label htmlFor="lastName" className="signup-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="signup-input"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="username" className="signup-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="signup-input"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="email" className="signup-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="signup-input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="phoneNumber" className="signup-label">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="signup-input"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="address" className="signup-label">Address</label>
              <textarea
                id="address"
                name="address"
                className="signup-textarea"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            
            <div className="signup-form-row">
              <div className="signup-form-group">
                <label htmlFor="password" className="signup-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="signup-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="signup-form-group">
                <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="signup-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
          
          <div className="signup-divider">
            <span className="signup-divider-text">OR SIGN UP WITH</span>
          </div>
          
          <p className="signup-login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignUp;