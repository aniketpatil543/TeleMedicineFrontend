import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Header = ({ userData, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Safe selector with fallback
  const userAuthState = useSelector((state) => state?.auth || {});

  const user = userAuthState?.user || null;

  const firstName = user?.firstName || "Patient";
  const profileInitial = firstName?.charAt(0).toUpperCase() || "U";

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>

          {/* Welcome Text */}
          <div>
            <h1 className="text-2xl font-bold text-purple-900">
              Welcome back, {firstName}!
            </h1>
            <p className="text-purple-600 mt-1">{currentDate}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {profileInitial}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{firstName}</p>
              <p className="text-xs text-purple-600">Patient</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
