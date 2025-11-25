// components/Notifications.jsx
import React from 'react';

const Notifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-[#FF6B8B] bg-[#FFF0F3]';
      case 'medium':
        return 'border-l-[#FFA000] bg-[#FFF8E1]';
      default:
        return 'border-l-[#6D48C5] bg-[#F4F0FF]';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'prescription':
        return '💊';
      case 'test':
        return '🩺';
      default:
        return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Notifications</h2>
        <button 
          onClick={onMarkAllAsRead}
          className="text-[#6D48C5] hover:text-[#8B5FBF] font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8E0FF]">
        <div className="p-6 border-b border-[#E8E0FF]">
          <h3 className="text-xl font-semibold text-[#6D48C5]">Recent Alerts</h3>
        </div>
        
        <div className="divide-y divide-[#F4F0FF]">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-6 border-l-4 ${
                notification.read 
                  ? 'bg-white border-[#E8E0FF]' 
                  : getPriorityColor(notification.priority)
              } transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl mt-1">{getIcon(notification.type)}</span>
                  <div>
                    <p className={`font-medium ${
                      notification.read ? 'text-[#8B5FBF]' : 'text-[#6D48C5]'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-[#8B5FBF] text-sm mt-1">{notification.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {!notification.read && (
                    <button 
                      onClick={() => onMarkAsRead(notification.id)}
                      className="text-[#6D48C5] hover:text-[#8B5FBF] text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  {notification.priority === 'high' && !notification.read && (
                    <span className="w-2 h-2 bg-[#FF6B8B] rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;