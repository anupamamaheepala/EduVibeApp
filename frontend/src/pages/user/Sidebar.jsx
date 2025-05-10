import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './../../css/user/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
  const username = localStorage.getItem('username') || 'Anonymous'; // Get username

  // Check if current route is a dashboard sub-route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/notifications/${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await res.json();
        // Count unread notifications
        const unread = data.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
        setUnreadCount(0); // Fallback to 0 on error
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 1000); // Changed from 30000 to 10000 (10 seconds)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [username]);

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
              to="/dashboard/Notifications"
              className={({ isActive }) => 
                isActive ? 'active' : ''
              }
            >
              Notifications
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
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