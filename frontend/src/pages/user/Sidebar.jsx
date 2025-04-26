import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './../../css/user/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Check if current route is a dashboard sub-route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation">
        <ul>
          <li>
            <NavLink
              to="/dashboard" // Updated to absolute path
              end // Highlights only on exact match
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/mycourses" // Absolute path
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              My Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/learning-plan" // Absolute path
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              My Learning Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/groups" // Absolute path
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings" // Absolute path
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
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