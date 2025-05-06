import React from 'react';
import Navbar from './Navbar';
import '../../css/user/Groups.css'; // New CSS file

const Groups = () => {
  return (
    <div className="groups-page">
      <Navbar activePage="groups" />
      <div className="groups-content">
        <h1>My Groups</h1>
        <p>Connect with other learners in your study groups.</p>
        {/* Add groups content here */}
      </div>
    </div>
  );
};

export default Groups;