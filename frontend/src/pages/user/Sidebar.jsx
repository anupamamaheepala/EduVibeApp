import React from 'react';
import { NavLink } from 'react-router-dom';
import './../../css/user/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation">
        <ul>
          <li>
            <NavLink
              to="/mycourses"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              My Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/learning-plan"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              My Learning Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/groups"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;