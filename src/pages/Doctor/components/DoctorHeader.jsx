import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const DoctorHeader = ({ doctorData, toggleMobileMenu }) => {

  // Safe access to redux
  const userAuthState = useSelector((state) => state?.auth || {});

  const user = userAuthState?.user || {};

  const firstName = user?.firstName || "Doctor";
  const department = user?.department || user?.specialization || "Specialist";

  // Safe initial letter
  const initial = firstName?.charAt(0)?.toUpperCase() || "D";

  // Avatar fallback
  const avatar = doctorData?.avatar || null;

  return (
    <header className="bg-white shadow-sm border-b border-purple-200">
      <div className="flex items-center justify-between p-4">
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-purple-50"
        >
          <FaBars className="text-lg" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">

            {/* Avatar */}
            {avatar ? (
              <img 
                src={avatar}
                alt={firstName}
                className="w-10 h-10 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                {initial}
              </div>
            )}

            {/* Name + department */}
            <div className="text-right">
              <div className="font-semibold text-gray-800">{firstName}</div>
              <div className="text-sm text-gray-600">{department}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default DoctorHeader;
