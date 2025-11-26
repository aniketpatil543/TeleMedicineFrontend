import React from 'react';
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiUser, 
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { 
  TbPill
} from 'react-icons/tb';

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  notificationCount, 
  sidebarOpen, 
  onToggleSidebar,
  userData,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <FiHome className="text-lg" />, badge: null },
    { id: 'appointments', label: 'Appointments', icon: <FiCalendar className="text-lg" />, badge: null },
    { id: 'medical-records', label: 'Medical Records', icon: <FiFileText className="text-lg" />, badge: null },
    { id: 'prescriptions', label: 'Prescriptions', icon: <TbPill className="text-lg" />, badge: null },
    { id: 'notifications', label: 'Notifications', icon: <FiBell className="text-lg" />, badge: notificationCount },
    { id: 'profile', label: 'Profile', icon: <FiUser className="text-lg" />, badge: null },
  ];

  // Mobile sidebar overlay
  const MobileOverlay = () => (
    <div 
      className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onToggleMobileMenu}
    />
  );

  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Mobile Menu Button */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <div className={`
        bg-white shadow-xl border-r border-purple-100 transition-all duration-300 h-full z-40
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0' : 'fixed lg:relative -left-full lg:left-0'}
      `}>
        {/* Logo Section */}
            <div className="p-2 border-b border-gray-200 bg-white m-3">
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

        {/* User Profile Section */}
        {/* {sidebarOpen && userData && (
          <div className="p-4 border-b border-purple-100 ">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userData.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userData.name || 'User'}</p>
                <p className="text-xs text-purple-600">Patient</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                // Close mobile menu when item is clicked on mobile
                if (window.innerWidth < 1024) {
                  onToggleMobileMenu();
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <div className={`flex-shrink-0 ${activeSection === item.id ? 'text-white' : 'text-purple-500'}`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium text-sm lg:text-base">{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeSection === item.id
                        ? 'bg-white text-purple-600'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        {sidebarOpen && (
          <div className="p-4 mt-8 mx-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiActivity className="text-purple-600 text-xl" />
              </div>
              <p className="text-sm font-semibold text-purple-900">Active Now</p>
              <p className="text-2xl font-bold text-purple-600">{userData?.upcomingAppointments?.length || 0}</p>
              <p className="text-xs text-purple-500">Appointments</p>
            </div>
          </div>
        )}

        {/* Toggle Sidebar Button - Hidden on mobile */}
        <div className="absolute bottom-6 left-4 hidden lg:block">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        {/* Close button for mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute bottom-6 left-4">
            <button
              onClick={onToggleMobileMenu}
              className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
              <FiX />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;