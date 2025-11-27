// components/Sidebar.jsx
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
  FaSignOutAlt,
  FaLock,
  FaHome,
  FaCalendarPlus
} from 'react-icons/fa';

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  sidebarOpen, 
  onToggleSidebar,
  userData,
  onLogout,
  isProfileComplete,
  notificationCount
}) => {
  const menuItems = [
    { 
      id: 'overview', 
      icon: FaHome, 
      label: 'Overview',
      requiresCompleteProfile: true 
    },
    { 
      id: 'appointments', 
      icon: FaCalendarAlt, 
      label: 'Appointments',
      requiresCompleteProfile: true 
    },
    { 
      id: 'book-appointment', 
      icon: FaCalendarPlus, 
      label: 'Book Appointment',
      requiresCompleteProfile: true 
    },
    { 
      id: 'medical-records', 
      icon: FaFileMedical, 
      label: 'Medical Records',
      requiresCompleteProfile: true 
    },
    { 
      id: 'prescriptions', 
      icon: FaPills, 
      label: 'Prescriptions',
      requiresCompleteProfile: true 
    },
    { 
      id: 'notifications', 
      icon: FaBell, 
      label: 'Notifications',
      requiresCompleteProfile: false 
    },
    { 
      id: 'profile', 
      icon: FaUserCircle, 
      label: 'Profile',
      requiresCompleteProfile: false 
    }
  ];

  const handleMenuClick = (sectionId, requiresCompleteProfile) => {
    if (requiresCompleteProfile && !isProfileComplete) {
      return;
    }
    setActiveSection(sectionId);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-40
      bg-gradient-to-b from-purple-700 to-purple-900 text-white 
      transition-all duration-300 ease-in-out
      flex flex-col overflow-y-auto
      ${sidebarOpen ? 'w-72' : 'w-20'}
    `}>
      {/* Logo Section */}
      <div className="p-2 border-b border-purple-600 bg-white">
        <div className="flex items-center justify-center">
          <img 
            src="/Logo1.png" 
            alt="MediCare Pro" 
            className={`transition-all duration-300 object-cover ${
              sidebarOpen ? "w-48 h-[65px]" : "w-10 h-8"
            }`}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 space-y-2 px-3">
        {menuItems.map(item => {
          const isDisabled = item.requiresCompleteProfile && !isProfileComplete;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.requiresCompleteProfile)}
              className={`
                w-full flex items-center px-4 py-3 rounded-xl
                transition-all duration-200 ease-in-out
                group relative
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : isDisabled
                  ? 'text-purple-400 cursor-not-allowed opacity-60'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white'
                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
              disabled={isDisabled}
            >
              <item.icon className={`
                transition-all duration-200
                ${isActive ? 'text-white scale-110' : isDisabled ? 'text-purple-400' : 'text-purple-200'}
                ${sidebarOpen ? 'text-lg' : 'text-xl'}
              `} />
              
              {/* Menu Label */}
              {sidebarOpen && (
                <span className={`
                  ml-4 font-medium transition-all duration-200
                  ${isActive ? 'text-white' : isDisabled ? 'text-purple-400' : 'text-purple-100'}
                `}>
                  {item.label}
                </span>
              )}
              
              {/* Notification Badge */}
              {item.id === 'notifications' && notificationCount > 0 && (
                <span className={`
                  absolute flex items-center justify-center
                  bg-red-500 text-white text-xs font-bold
                  rounded-full min-w-5 h-5
                  transition-all duration-200
                  ${sidebarOpen 
                    ? 'right-4 px-1' 
                    : 'right-1 top-1 w-2 h-2'
                  }
                  ${isActive ? 'bg-red-400' : 'bg-red-500'}
                `}>
                  {sidebarOpen && notificationCount}
                </span>
              )}

              {/* Lock Icon for disabled items */}
              {isDisabled && sidebarOpen && (
                <FaLock className="ml-auto text-xs text-purple-300" />
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
                  {item.id === 'notifications' && notificationCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                      {notificationCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Completion Status */}
      {!isProfileComplete && sidebarOpen && (
        <div className="px-3 py-2">
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaLock className="text-amber-300 text-sm" />
              <span className="text-amber-200 text-sm font-medium">Complete Profile</span>
            </div>
            <p className="text-amber-100 text-xs mt-1">
              Finish setup to unlock all features
            </p>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="py-4 px-3 border-t border-purple-600">
        <button 
          onClick={handleLogout}
          className={`
            w-full flex items-center px-4 py-3 rounded-xl
            transition-all duration-200 ease-in-out
            text-red-200 hover:bg-red-500/20 hover:text-white
            group relative
            ${!sidebarOpen ? 'justify-center' : ''}
          `}
        >
          <FaSignOutAlt className={`
            transition-all duration-200
            ${sidebarOpen ? 'text-lg' : 'text-xl'}
          `} />
          
          {sidebarOpen && (
            <span className="ml-4 font-medium">Logout</span>
          )}

          {/* Tooltip for collapsed sidebar */}
          {!sidebarOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;