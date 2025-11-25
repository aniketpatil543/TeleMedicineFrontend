// components/Header.jsx
import React from 'react';

const Header = ({ userData }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-[#E8E0FF]">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-[#6D48C5]">
            Welcome back, {userData?.name || 'Patient'}!
          </h1>
          <p className="text-[#8B5FBF] mt-1">{currentDate}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-[#8B5FBF] hover:text-[#6D48C5] transition-colors rounded-lg hover:bg-[#F4F0FF]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          
          <div className="w-10 h-10 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;