import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './../../css/user/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Check if current route is a dashboard sub-route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Mock total notification count (replace with actual data from state or API)
  const totalNotifications = 10;

  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/notifications"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Notifications
              {totalNotifications > 0 && (
                <span className="notification-badge">{totalNotifications}</span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/mycourses"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              My Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/MyPosts"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              My Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/SharedWithMe"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Shared With Me
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/learning-plan"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              My Learning Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/groups"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
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