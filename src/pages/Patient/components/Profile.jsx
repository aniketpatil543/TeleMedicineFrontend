// components/Profile.jsx
import React from 'react';

const Profile = ({ userData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#6D48C5]">Profile</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Full Name</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.name}</p>
              </div>
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Email</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.email}</p>
              </div>
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Phone</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.phone}</p>
              </div>
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Age</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.age} years</p>
              </div>
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Blood Type</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.bloodType}</p>
              </div>
              <div>
                <label className="block text-[#8B5FBF] text-sm font-medium mb-1">Last Checkup</label>
                <p className="text-[#6D48C5] font-semibold">{userData?.lastCheckup}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Emergency Contacts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                <div>
                  <p className="font-semibold text-[#6D48C5]">Jane Doe</p>
                  <p className="text-[#8B5FBF] text-sm">Spouse</p>
                  <p className="text-[#8B5FBF] text-sm">+1 (555) 987-6543</p>
                </div>
                <button className="text-[#6D48C5] hover:text-[#8B5FBF] font-medium">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                <div>
                  <p className="font-semibold text-[#6D48C5]">Robert Wilson</p>
                  <p className="text-[#8B5FBF] text-sm">Brother</p>
                  <p className="text-[#8B5FBF] text-sm">+1 (555) 456-7890</p>
                </div>
                <button className="text-[#6D48C5] hover:text-[#8B5FBF] font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Medical Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                <span className="text-[#8B5FBF]">Allergies</span>
                <span className="bg-[#FFEBEE] text-[#F44336] px-2 py-1 rounded text-sm font-medium">Penicillin</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                <span className="text-[#8B5FBF]">Conditions</span>
                <span className="bg-[#E8F5E8] text-[#4CAF50] px-2 py-1 rounded text-sm font-medium">Hypertension</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                <span className="text-[#8B5FBF]">Last Update</span>
                <span className="text-[#6D48C5] font-medium">2024-01-15</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm text-left">
                Edit Profile Information
              </button>
              <button className="w-full bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-4 rounded-lg font-medium transition-colors border border-[#E8E0FF] text-left">
                Change Password
              </button>
              <button className="w-full bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-4 rounded-lg font-medium transition-colors border border-[#E8E0FF] text-left">
                Privacy Settings
              </button>
              <button className="w-full bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-4 rounded-lg font-medium transition-colors border border-[#E8E0FF] text-left">
                Download Medical Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;