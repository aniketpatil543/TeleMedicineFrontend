import React, { useState } from 'react';
import { 
  FiBell, 
  FiCheck, 
  FiCheckSquare, 
  FiAlertTriangle, 
  FiCalendar,
  FiUser,
  FiFileText,
  FiFilter,
  FiArchive,
  FiClock
} from 'react-icons/fi';
import { 
  TbPill,
  TbMicroscope,
  TbReport,
  TbStethoscope
} from 'react-icons/tb';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'New Appointment Request',
      message: 'Maria Garcia requested an appointment for cardiac consultation',
      time: '10 minutes ago',
      priority: 'high',
      read: false,
      patient: 'Maria Garcia',
      actionRequired: true
    },
    {
      id: 2,
      type: 'prescription',
      title: 'Prescription Renewal Request',
      message: 'John Smith requested renewal for Lisinopril medication',
      time: '1 hour ago',
      priority: 'medium',
      read: false,
      patient: 'John Smith',
      actionRequired: true
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab Results Available',
      message: 'Blood test results for Robert Wilson are now available for review',
      time: '2 hours ago',
      priority: 'high',
      read: false,
      patient: 'Robert Wilson',
      actionRequired: true
    },
    {
      id: 4,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance this weekend. Plan accordingly.',
      time: '5 hours ago',
      priority: 'low',
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'patient',
      title: 'Patient Message',
      message: 'Lisa Martinez sent you a new message regarding her treatment',
      time: '1 day ago',
      priority: 'medium',
      read: true,
      patient: 'Lisa Martinez',
      actionRequired: false
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <FiCalendar className="text-xl text-blue-600" />;
      case 'prescription':
        return <TbPill className="text-xl text-green-600" />;
      case 'lab':
        return <TbMicroscope className="text-xl text-purple-600" />;
      case 'patient':
        return <FiUser className="text-xl text-orange-600" />;
      case 'system':
        return <TbStethoscope className="text-xl text-gray-600" />;
      default:
        return <FiBell className="text-xl text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 text-blue-700';
      case 'prescription':
        return 'bg-green-50 text-green-700';
      case 'lab':
        return 'bg-purple-50 text-purple-700';
      case 'patient':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notification => 
        filter === 'unread' ? !notification.read : notification.type === filter
      );

  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    highPriority: notifications.filter(n => n.priority === 'high').length,
    actionRequired: notifications.filter(n => n.actionRequired).length
  };

  const notificationTypes = [
    { id: 'all', label: 'All Notifications', count: notificationStats.total },
    { id: 'unread', label: 'Unread', count: notificationStats.unread },
    { id: 'appointment', label: 'Appointments', count: notifications.filter(n => n.type === 'appointment').length },
    { id: 'prescription', label: 'Prescriptions', count: notifications.filter(n => n.type === 'prescription').length },
    { id: 'lab', label: 'Lab Results', count: notifications.filter(n => n.type === 'lab').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBell className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with practice alerts and patient requests</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={notificationStats.unread === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiCheckSquare className="text-lg" />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{notificationStats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBell className="text-blue-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Unread</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{notificationStats.unread}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-red-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">High Priority</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{notificationStats.highPriority}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TbReport className="text-orange-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Action Required</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{notificationStats.actionRequired}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiFileText className="text-purple-600 text-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFilter className="text-blue-600" />
              Filter By
            </h3>
            
            <nav className="space-y-2">
              {notificationTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    filter === type.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className="font-medium text-sm">{type.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    filter === type.id
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <FiArchive className="text-lg" />
                Archive All Read
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                <FiCalendar className="text-lg" />
                View Today's Schedule
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <TbPill className="text-lg" />
                Pending Prescriptions
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filter === 'all' ? 'All Notifications' : 
                   filter === 'unread' ? 'Unread Notifications' :
                   `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
                </h2>
                <span className="px-3 py-1 bg-white text-orange-600 rounded-full text-sm font-medium border border-orange-200">
                  {filteredNotifications.length} items
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FiBell className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">No notifications found</p>
                  <p className="text-gray-400 text-sm">
                    {filter === 'unread' ? 'You have no unread notifications' : 'No notifications match your filter'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-6 transition-all duration-200 hover:bg-gray-50 ${
                      !notification.read ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Notification Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          notification.read ? 'bg-gray-100' : 'bg-white shadow-sm'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${
                              notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                                {notification.priority} priority
                              </span>
                              
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiClock className="text-gray-400" />
                              <span>{notification.time}</span>
                            </div>
                            
                            {notification.patient && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <FiUser className="text-gray-400" />
                                  <span className="font-medium">{notification.patient}</span>
                                </div>
                              </>
                            )}
                            
                            {notification.actionRequired && !notification.read && (
                              <>
                                <span>•</span>
                                <span className="text-red-600 font-medium">Action Required</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl flex items-center justify-center transition-colors"
                            title="Mark as read"
                          >
                            <FiCheck className="text-lg" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => archiveNotification(notification.id)}
                          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
                          title="Archive notification"
                        >
                          <FiArchive className="text-lg" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons for Important Notifications */}
                    {notification.actionRequired && !notification.read && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        {notification.type === 'appointment' && (
                          <>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                              View Appointment
                            </button>
                            <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                              Reschedule
                            </button>
                          </>
                        )}
                        
                        {notification.type === 'prescription' && (
                          <>
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors">
                              Review Prescription
                            </button>
                            <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                              Contact Patient
                            </button>
                          </>
                        )}
                        
                        {notification.type === 'lab' && (
                          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors">
                            View Lab Results
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;