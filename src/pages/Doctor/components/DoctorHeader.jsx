// components/DoctorHeader.jsx
import React from 'react';
import { FaSearch, FaBell, FaBars } from 'react-icons/fa';

const DoctorHeader = ({ doctorData, toggleMobileMenu, toggleSidebar, sidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-purple-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-purple-50"
          >
            <FaBars className="text-lg" />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search patients, records, appointments..."
              className="pl-10 pr-4 py-2 border border-purple-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
            <FaBell className="text-xl" />
            {doctorData.notifications > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 ">
            <img 
              src={doctorData.avatar} 
              alt={doctorData.name}
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
            <div className="text-right">
              <div className="font-semibold text-gray-800">{doctorData.name}</div>
              <div className="text-sm text-gray-600">{doctorData.specialty}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;