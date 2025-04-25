import React from 'react';
import Sidebar from './Sidebar';
import Header from '../Header';
import Footer from '../Footer';
import './../../css/user/UserDashboard.css';

const UserDashboard = () => {
  return (
    <>
      <Header/>
          <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <h1>User Dashboard</h1>
          <p>Welcome to your dashboard! This is a placeholder for your content.</p>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;