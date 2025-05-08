import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/user/NotFound.css'; // New CSS file

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;