
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Check localStorage on mount to restore login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (username, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    setUsername(username);
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
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

