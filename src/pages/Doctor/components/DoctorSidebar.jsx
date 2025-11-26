// components/DoctorSidebar.jsx
import React from 'react';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaUserInjured, 
  FaPills, 
  FaFileMedical, 
  FaBell, 
  FaVideo,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';

const DoctorSidebar = ({ 
  activeSection, 
  setActiveSection, 
  sidebarOpen, 
  mobileMenuOpen, 
  toggleSidebar, 
  toggleMobileMenu,
  notificationCount 
}) => {
  const menuItems = [
    { id: 'overview', icon: FaUserMd, label: 'Overview' },
    { id: 'appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { id: 'patients', icon: FaUserInjured, label: 'Patients' },
    { id: 'medical-records', icon: FaFileMedical, label: 'Medical Records' },
    { id: 'prescriptions', icon: FaPills, label: 'Prescriptions' },
    { id: 'consultation', icon: FaVideo, label: 'Consultation Room' },
    { id: 'notifications', icon: FaBell, label: 'Notifications' },
    { id: 'profile', icon: FaUserCircle, label: 'Profile' }
  ];

  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-40
      bg-gradient-to-b from-purple-700 to-purple-800 text-white 
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo Section in Sidebar */}
      <div className="p-2 border-b border-purple-600 bg-white">
        <div className="flex items-center justify-center">
          <img 
            src="/Logo1.png" 
            alt="MediCare Pro" 
            className={`transition-all duration-300 object-cover ${
              sidebarOpen ? "w-40 h-[59px] " : "w-10 h-8"
            }`}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="pt-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              toggleMobileMenu();
            }}
            className={`w-full flex items-center px-4 py-3 transition-colors relative ${
              activeSection === item.id 
                ? 'bg-purple-600 border-r-4 border-white' 
                : 'hover:bg-purple-600'
            }`}
          >
            <item.icon className={`${sidebarOpen ? 'text-lg' : 'text-xl mx-auto'}`} />
            {(sidebarOpen || mobileMenuOpen) && (
              <span className="ml-3">{item.label}</span>
            )}
            {item.id === 'notifications' && notificationCount > 0 && (sidebarOpen || mobileMenuOpen) && (
              <span className="absolute right-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button className="w-full flex items-center px-4 py-3 text-red-200 hover:bg-purple-600 rounded-lg transition-colors">
          <FaSignOutAlt className={`${sidebarOpen ? 'text-lg' : 'text-xl mx-auto'}`} />
          {(sidebarOpen || mobileMenuOpen) && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar;