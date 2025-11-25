// components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, notificationCount }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'medical-records', label: 'Medical Records', icon: '📋' },
    { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[#F4F0FF] to-[#E8E0FF] shadow-lg flex flex-col border-r border-[#E8E0FF]">
      {/* Header */}
      <div className="p-6 border-b border-[#E8E0FF]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#6D48C5]">HealthCare</h2>
            <p className="text-[#8B5FBF] text-sm">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === item.id 
                ? 'bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] text-white shadow-md' 
                : 'text-[#6D48C5] hover:bg-[#E8E0FF] hover:text-[#8B5FBF]'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium flex-1 text-left">{item.label}</span>
            {item.id === 'notifications' && notificationCount > 0 && (
              <span className="bg-[#FF6B8B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {notificationCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#E8E0FF]">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-[#E8E0FF]">
          <div className="w-10 h-10 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#6D48C5]">John Doe</p>
            <p className="text-xs text-[#8B5FBF]">Patient</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;