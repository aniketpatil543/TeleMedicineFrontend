import React, { useState } from 'react';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';

const Header = ({ userData, onToggleSidebar, sidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-purple-900">
              Welcome back, {userData?.name || 'Patient'}!
            </h1>
            <p className="text-purple-600 mt-1">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors relative"
            >
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
              <p className="text-xs text-purple-600">Patient</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;