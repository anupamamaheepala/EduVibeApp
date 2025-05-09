import { useState, useEffect } from 'react';
import { Bell, Settings, CheckCircle, MessageCircle, Heart, BookOpen, User, Filter, ArrowLeft, MoreHorizontal, X } from 'lucide-react';
import '../../css/notification.css';

export default function NotificationSystem() {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    mentions: true,
    courseReminders: true,
    allEmail: true,
    allMobile: true
  });

  // Helper function to get user initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Fetch notifications (simulated)
  useEffect(() => {
    // This would be an API call in a real application
    const mockNotifications = [
      {
        id: 1,
        type: 'like',
        content: 'liked your post "Introducing our new feature"',
        time: '2 hours ago',
        read: false,
        user: {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40'
        }
      },
      {
        id: 2,
        type: 'comment',
        content: 'commented on your post "Best practices for React components"',
        time: '5 hours ago',
        read: false,
        user: {
          name: 'Michael Brown',
          avatar: '/api/placeholder/40/40'
        }
      },
      {
        id: 3,
        type: 'mention',
        content: 'mentioned you in a comment',
        time: '1 day ago',
        read: true,
        user: {
          name: 'Alex Wilson',
          avatar: '/api/placeholder/40/40'
        }
      },
      {
        id: 4,
        type: 'course',
        content: 'Continue your course "Advanced React Patterns". You haven\'t made progress in a week!',
        time: '2 days ago',
        read: false,
        course: {
          name: 'Advanced React Patterns',
          progress: 60
        }
      },
      {
        id: 5,
        type: 'like',
        content: 'and 5 others liked your comment',
        time: '3 days ago',
        read: true,
        user: {
          name: 'Jennifer Lee',
          avatar: '/api/placeholder/40/40'
        }
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <Heart size={20} className="text-red-500 notification-icon-like" />;
      case 'comment': return <MessageCircle size={20} className="text-purple-500 notification-icon-comment" />;
      case 'mention': return <User size={20} className="text-purple-600 notification-icon-mention" />;
      case 'course': return <BookOpen size={20} className="text-green-500 notification-icon-course" />;
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
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Settings size={20} className="text-gray-600" />
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
          onClick={() => setFilter('mention')}
          className={`filter-btn ${filter === 'mention' ? 'active' : ''}`}
        >
          Mentions
        </button>
        <button
          onClick={() => setFilter('course')}
          className={`filter-btn ${filter === 'course' ? 'active' : ''}`}
        >
          Course Reminders
        </button>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-gray-200">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
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
                    {notification.type === 'course' && (
                      <div className="mt-2">
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${notification.course.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs">
                          {notification.course.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-purple-600 hover:text-purple-800"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
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
                
                {/* Other toggle switches remain the same */}
                {/* ... */}
                
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