import React from 'react';
import { 
  FiBell,
  FiCalendar,
  FiActivity,
  FiCheckCircle,
  FiCheckSquare,
  FiAlertTriangle,
  FiInfo,
  FiClock,
  FiHeart
} from 'react-icons/fi';
import { 
  TbMicroscope,
  TbCircleCheck,
  TbPill
} from 'react-icons/tb';

const Notifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium':
        return 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-white';
      default:
        return 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-white';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FiAlertTriangle className="text-red-500 text-lg" />;
      case 'medium':
        return <FiInfo className="text-orange-500 text-lg" />;
      default:
        return <FiInfo className="text-purple-500 text-lg" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <FiCalendar className="text-blue-600 text-xl" />;
      case 'prescription':
        return <TbPill className="text-green-600 text-xl" />;
      case 'test':
        return <TbMicroscope className="text-purple-600 text-xl" />;
      case 'reminder':
        return <FiClock className="text-orange-600 text-xl" />;
      case 'health':
        return <FiHeart className="text-pink-600 text-xl" />;
      default:
        return <FiBell className="text-gray-600 text-xl" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'prescription':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'test':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'reminder':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'health':
        return 'bg-pink-100 text-pink-800 border border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBell className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-500 text-base mt-1">Stay updated with your health alerts</p>
          </div>
        </div>
        <button 
          onClick={onMarkAllAsRead}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FiCheckSquare className="text-xl" />
          Mark all as read
        </button>
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow duration-200">
          <FiActivity className="text-blue-500 text-3xl mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow duration-200">
          <FiAlertTriangle className="text-red-500 text-3xl mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium">High Priority</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notifications.filter(n => n.priority === 'high').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow duration-200">
          <FiCalendar className="text-green-500 text-3xl mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium">Appointments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notifications.filter(n => n.type === 'appointment').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition-shadow duration-200">
          <TbMicroscope className="text-purple-500 text-3xl mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium">Test Results</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notifications.filter(n => n.type === 'test').length}
          </p>
        </div>
      </div> */}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Recent Alerts</h3>
              <p className="text-gray-500 text-sm mt-1">Your latest health notifications</p>
            </div>
            <span className="px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-semibold border border-purple-200 shadow-sm">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <FiBell className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-medium">No notifications</p>
              <p className="text-gray-400 text-base mt-2">You're all caught up with your health updates!</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-8 border-l-4 transition-all duration-300 hover:shadow-sm ${
                  notification.read 
                    ? 'border-l-gray-300 bg-white' 
                    : getPriorityColor(notification.priority)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Notification Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                      notification.read ? 'bg-gray-100' : getTypeColor(notification.type).split(' ')[0]
                    }`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {!notification.read && getPriorityIcon(notification.priority)}
                        <p className={`font-semibold leading-relaxed ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        } text-lg`}>
                          {notification.message}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <FiClock className="text-gray-400" />
                          <span className="font-medium">{notification.time}</span>
                        </div>
                        
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          notification.read ? 'bg-gray-100 text-gray-600' : getTypeColor(notification.type)
                        }`}>
                          {notification.type}
                        </span>
                        
                        {notification.priority !== 'low' && (
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            notification.priority === 'high' 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}>
                            {notification.priority} priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3 ml-6">
                    {!notification.read && (
                      <button 
                        onClick={() => onMarkAsRead(notification.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Mark as read"
                      >
                        <TbCircleCheck className="text-base" />
                        <span>Mark read</span>
                      </button>
                    )}
                    
                    {notification.read && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        <FiCheckCircle className="text-lg" />
                        <span className="text-sm font-semibold">Read</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Additional Info */}
                {notification.additionalInfo && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.additionalInfo}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;