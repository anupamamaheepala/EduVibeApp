import React from 'react';
import Navbar from './Navbar';
import '../../css/user/Settings.css'; // New CSS file

const Settings = () => {
  return (
    <div className="settings-page">
      <Navbar activePage="settings" />
      <div className="settings-content">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
        {/* Add settings content here */}
      </div>
    </div>
  );
};

export default Settings;