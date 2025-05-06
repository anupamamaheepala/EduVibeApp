import React from 'react';
import Navbar from './Navbar';
import '../../css/user/UserDashboard.css'; // New CSS file for styling

const UserDashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar activePage="dashboard" />
      <div className="dashboard-content">
        <h1>My Dashboard</h1>
        <p>Welcome to your dashboard. Here you can view your enrolled courses and progress.</p>
        {/* Add dashboard content here */}
      </div>
    </div>
  );
};

export default UserDashboard;