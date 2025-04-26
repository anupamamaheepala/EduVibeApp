import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  // Check localStorage on mount to restore login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUsername && storedUserId) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserId(storedUserId); // Initialize userId
    }
  }, []);

  const login = (username, token, userId) => { // Add userId parameter
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId); // Store userId
    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      // Send a request to the backend to notify it of logout (optional)
      if (token) {
        await axios.post('http://localhost:8000/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in Authorization header
          },
        });
      }
      // Clear token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setUsername('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

