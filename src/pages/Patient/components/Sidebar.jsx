import React from 'react';
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiUser, 
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiLock
} from 'react-icons/fi';
import { 
  TbPill
} from 'react-icons/tb';
import { MdLogout } from "react-icons/md";

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  notificationCount, 
  sidebarOpen, 
  onToggleSidebar,
  userData,
  mobileMenuOpen,
  onToggleMobileMenu,
  onLogout,
  isProfileComplete // Add this prop
}) => {
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: <FiHome className="text-lg" />, 
      badge: null,
      requiresCompleteProfile: true 
    },
    { 
      id: 'appointments', 
      label: 'Appointments', 
      icon: <FiCalendar className="text-lg" />, 
      badge: null,
      requiresCompleteProfile: true 
    },
    { 
      id: 'medical-records', 
      label: 'Medical Records', 
      icon: <FiFileText className="text-lg" />, 
      badge: null,
      requiresCompleteProfile: true 
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: <TbPill className="text-lg" />, 
      badge: null,
      requiresCompleteProfile: true 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <FiBell className="text-lg" />, 
      badge: notificationCount,
      requiresCompleteProfile: false 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <FiUser className="text-lg" />, 
      badge: null,
      requiresCompleteProfile: false 
    },
  ];

  const handleMenuClick = (sectionId, requiresCompleteProfile) => {
    if (requiresCompleteProfile && !isProfileComplete) {
      return;
    }
    
    setActiveSection(sectionId);
    if (window.innerWidth < 1024) {
      onToggleMobileMenu();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (onLogout) {
        onLogout();
      }
      
      if (window.innerWidth < 1024) {
        onToggleMobileMenu();
      }
    }
  };

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
        bg-white shadow-xl border-r border-purple-100 transition-all duration-300 h-full z-40 flex flex-col overflow-y-auto
        ${sidebarOpen ? 'w-68' : 'w-20'}
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0' : 'fixed lg:relative -left-full lg:left-0'}
      `}>
        {/* Logo Section */}
        <div className="p-2 border-b border-gray-200 bg-white m-3 flex-shrink-0">
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

        {/* Profile Completion Status */}
        {!isProfileComplete && sidebarOpen && (
          <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FiLock className="text-amber-600 text-sm" />
              <span className="text-amber-800 text-sm font-medium">Complete Your Profile</span>
            </div>
            <p className="text-amber-700 text-xs">
              Finish profile setup to unlock all features
            </p>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isDisabled = item.requiresCompleteProfile && !isProfileComplete;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.requiresCompleteProfile)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed opacity-60'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
                disabled={isDisabled}
              >
                <div className={`flex-shrink-0 ${
                  isActive ? 'text-white' : 
                  isDisabled ? 'text-gray-400' : 
                  'text-purple-500'
                }`}>
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <>
                    <span className={`flex-1 text-left font-medium text-sm lg:text-base ${
                      isDisabled ? 'text-gray-400' : ''
                    }`}>
                      {item.label}
                    </span>
                    {item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? 'bg-white text-purple-600'
                          : isDisabled
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isDisabled && (
                      <FiLock className="text-gray-400 text-sm flex-shrink-0" />
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <div className={`
                    absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50
                    ${isDisabled ? 'bg-amber-900' : 'bg-gray-900'}
                  `}>
                    {item.label}
                    {isDisabled && (
                      <div className="text-xs text-amber-200 mt-1">
                        Complete profile to unlock
                      </div>
                    )}
                    {item.badge !== null && item.badge > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="flex-shrink-0 text-red-500">
              <MdLogout className="text-lg" />
            </div>
            {sidebarOpen && (
              <span className="flex-1 text-left font-medium text-sm lg:text-base">Logout</span>
            )}
            
            {/* Tooltip for collapsed sidebar */}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Toggle Sidebar Button - Desktop only */}
        <div className="p-4 flex-shrink-0 hidden lg:block">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        {/* Close button for mobile */}
        {mobileMenuOpen && (
          <div className="p-4 flex-shrink-0 lg:hidden">
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