import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, CheckCircle, MessageCircle, Heart, BookOpen, User, Filter, ArrowLeft, MoreHorizontal, X } from 'lucide-react';
import '../../css/notification.css';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    mentions: true,
    courseReminders: true,
    replies: true,
    allEmail: true,
    allMobile: true
  });

  const username = localStorage.getItem('username') || 'Anonymous';
  const navigate = useNavigate();

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/notifications/${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await res.json();
        // Sort notifications by createdAt in descending order (newest first)
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedData.map(notification => {
          // Remove the username from the content string
          const contentWithoutUsername = notification.content.replace(
            new RegExp(`^${notification.commenterUsername}\\s+`, 'i'), ''
          );
          return {
            id: notification.id,
            type: notification.type,
            content: contentWithoutUsername, // Use the modified content
            time: formatTime(notification.createdAt),
            read: notification.read,
            user: {
              name: notification.commenterUsername,
              avatar: '/api/placeholder/40/40'
            },
            postId: notification.postId // For navigation
          };
        }));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [username]);

  // Helper function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Helper function to get user initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/notifications/mark-read/${id}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/notifications/mark-all-read/${encodeURIComponent(username)}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle clicking a comment, like, or reply notification
  const handleNotificationClick = (notification) => {
    if ((notification.type === 'comment' || notification.type === 'like' || notification.type === 'reply') && notification.postId) {
      markAsRead(notification.id); // Mark as read on click
      navigate(`/post/${notification.postId}`); // Navigate to post
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <Heart size={20} className="text-red-500 notification-icon-like" />;
      case 'comment': return <MessageCircle size={20} className="text-purple-500 notification-icon-comment" />;
      case 'reply': return <MessageCircle size={20} className="text-blue-500 notification-icon-reply" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg overflow-hidden notification-container">
      {/* Header */}
      <div className="notification-header">
        <div className="flex items-center">
          <h1>Notifications</h1>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-counter">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={markAllAsRead} 
            className="mark-all-read-btn"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 flex overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('like')}
          className={`filter-btn ${filter === 'like' ? 'active' : ''}`}
        >
          Likes
        </button>
        <button
          onClick={() => setFilter('comment')}
          className={`filter-btn ${filter === 'comment' ? 'active' : ''}`}
        >
          Comments
        </button>
        <button
          onClick={() => setFilter('reply')}
          className={`filter-btn ${filter === 'reply' ? 'active' : ''}`}
        >
          Replies
        </button>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-gray-200">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'notification-unread' : ''} ${notification.type === 'comment' || notification.type === 'like' || notification.type === 'reply' ? 'notification-clickable' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              {notification.user ? (
                <div 
                  className="user-avatar" 
                  data-initials={getInitials(notification.user.name)}
                >
                  {/* Placeholder for avatar - CSS will handle initials */}
                </div>
              ) : (
                <div className="course-icon-container">
                  <BookOpen size={20} className="notification-icon-course" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      {notification.user && <strong>{notification.user.name}</strong>} {notification.content}
                    </p>
                    <p className="text-xs">{notification.time}</p>
                  </div>
                  <div className="flex items-center">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking mark as read
                          markAsRead(notification.id);
                        }}
                        className="p-1 text-purple-600 hover:text-purple-800"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      className="p-1 text-gray-500 hover:text-gray-700"
                      onClick={(e) => e.stopPropagation()} // Prevent navigation
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
              {getNotificationIcon(notification.type)}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 notification-empty">
            No notifications match your current filter.
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Notification Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Notification Types</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart size={16} className="text-red-500 mr-2" />
                    <span className="text-sm text-gray-800">Likes on your posts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.likes}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        likes: !notificationSettings.likes
                      })}
                    />
                    <div className="toggle-switch-bg w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle size={16} className="text-purple-500 mr-2" />
                    <span className="text-sm text-gray-800">Comments on your posts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.comments}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        comments: !notificationSettings.comments
                      })}
                    />
                    <div className="toggle-switch-bg w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User size={16} className="text-purple-600 mr-2" />
                    <span className="text-sm text-gray-800">Mentions in comments</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.mentions}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        mentions: !notificationSettings.mentions
                      })}
                    />
                    <div className="toggle-switch-bg w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-800">Course reminders</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.courseReminders}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        courseReminders: !notificationSettings.courseReminders
                      })}
                    />
                    <div className="toggle-switch-bg w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-800">Replies to your comments</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificationSettings.replies}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        replies: !notificationSettings.replies
                      })}
                    />
                    <div className="toggle-switch-bg w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}