import React from 'react';
import Sidebar from './Sidebar';
import UserHeader from '../UserHeader';
import { Outlet } from 'react-router-dom';
import './../../css/user/UserDashboard.css'; // Reuse your existing CSS

const DashboardLayout = () => {
  return (
    <>
      <UserHeader />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet /> {/* This renders nested routes (UserDashboard, MyCourses, etc.) */}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;