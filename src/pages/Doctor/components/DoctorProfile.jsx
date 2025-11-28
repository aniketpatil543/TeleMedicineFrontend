// DoctorProfile.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiEdit2, 
  FiSave, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiCalendar,
  FiAward,
  FiBook,
  FiShield,
  FiBell,
  FiLock,
  FiAlertTriangle,
  FiX
} from 'react-icons/fi';
import { 
  TbStethoscope,
  TbCertificate,
  TbLanguage,
  TbBuildingHospital,
  TbId
} from 'react-icons/tb';

const DoctorProfile = ({ doctorData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    // Personal Info Section
    doctorId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    
    // Professional Info Section  
    specialization: '',
    department: '',
    experience: '',
    
    // Availability Section
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '16:00' },
        saturday: { start: '09:00', end: '12:00' },
        sunday: { start: '', end: '' }
      },
      appointmentDuration: 30
    }
  });

  // Load saved profile data from backend/API
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/doctor/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          doctorId: data.doctorId || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          specialization: data.specialization || '',
          department: data.department || '',
          experience: data.experience || '',
          availability: data.availability || {
            workingHours: {
              monday: { start: '09:00', end: '17:00' },
              tuesday: { start: '09:00', end: '17:00' },
              wednesday: { start: '09:00', end: '17:00' },
              thursday: { start: '09:00', end: '17:00' },
              friday: { start: '09:00', end: '16:00' },
              saturday: { start: '09:00', end: '12:00' },
              sunday: { start: '', end: '' }
            },
            appointmentDuration: 30
          }
        });
      } else {
        console.error('Failed to fetch profile data');
        // Fallback to localStorage if API fails
        const savedProfile = localStorage.getItem('doctorProfile');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(parsedProfile);
          } catch (error) {
            console.error('Error loading saved profile:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage if API fails
      const savedProfile = localStorage.getItem('doctorProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData(parsedProfile);
        } catch (error) {
          console.error('Error loading saved profile:', error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completion percentage
  useEffect(() => {
    calculateProgress();
  }, [profileData]);

  const calculateProgress = () => {
    const requiredFields = [
      profileData.doctorId,
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.phone,
      profileData.specialization,
      profileData.department,
      profileData.experience
    ];

    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;

    const progress = Math.round((completedFields / requiredFields.length) * 100);
    setProfileProgress(progress);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save to backend API
      const response = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem('doctorProfile', JSON.stringify(profileData));
        
        // Check if profile is complete enough and trigger completion
        if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
          onProfileComplete(profileData);
        }
        
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
        // Fallback to localStorage if API fails
        localStorage.setItem('doctorProfile', JSON.stringify(profileData));
        
        if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
          onProfileComplete(profileData);
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback to localStorage if API fails
      localStorage.setItem('doctorProfile', JSON.stringify(profileData));
      
      if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
        onProfileComplete(profileData);
      }
      
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchProfileData(); // Reload data from backend
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAvailabilityField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value
      }
    }));
  };

  const updateWorkingHours = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingHours: {
          ...prev.availability.workingHours,
          [day]: {
            ...prev.availability.workingHours[day],
            [field]: value
          }
        }
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: <FiUser /> },
    { id: 'professional', label: 'Professional', icon: <TbStethoscope /> },
    { id: 'availability', label: 'Availability', icon: <FiCalendar /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} />;
      case 'professional':
        return <ProfessionalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} />;
      case 'availability':
        return <AvailabilityTab data={profileData.availability} isEditing={isEditing} onChange={updateAvailabilityField} onWorkingHoursChange={updateWorkingHours} />;
      default:
        return <PersonalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress Indicator */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiUser className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {!isProfileComplete ? 'Complete Your Profile' : 'Doctor Profile'}
            </h1>
            <p className="text-gray-600">
              {!isProfileComplete 
                ? 'Finish setting up your profile to access all features' 
                : 'Manage your professional information and settings'
              }
            </p>
          </div>
        </div>
        
        {/* Progress Bar for Incomplete Profiles */}
        {/* {!isProfileComplete && (
          <div className="w-full lg:w-64">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Profile Completion</span>
              <span>{profileProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileProgress}%` }}
              ></div>
            </div>
          </div>
        )} */}
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !isEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="text-lg" />
                )}
                {!isProfileComplete ? 'Complete Profile' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiEdit2 className="text-lg" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Warning Banner for Incomplete Profile */}
      {!isProfileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-600 text-xl" />
            <div>
              <h4 className="font-semibold text-amber-800">Profile Setup Required</h4>
              <p className="text-amber-700 text-sm">
                Complete your profile to unlock all dashboard features and start seeing patients.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Profile Summary */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
                {profileData.firstName?.charAt(0) || 'D'}
                {profileData.lastName?.charAt(0) || 'R'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {profileData.firstName || 'Doctor'} {profileData.lastName || 'Name'}
              </h3>
              <p className="text-blue-600 font-medium">{profileData.specialization || 'Specialization'}</p>
              <p className="text-gray-500 text-sm mt-1">
                {profileData.experience || '0'} years experience
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Doctor ID</span>
                <span className="text-sm font-medium text-blue-900">
                  {profileData.doctorId || 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">Profile Complete</span>
                <span className="text-sm font-medium text-green-900">{profileProgress}%</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mt-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <div className={`${activeTab === tab.id ? 'text-white' : 'text-blue-500'}`}>
                    {tab.icon}
                  </div>
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {tabs.find(tab => tab.id === activeTab)?.icon}
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
            </div>
            
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ data, isEditing, onChange }) => {
  const personalFields = [
    { key: 'doctorId', label: 'Doctor ID', icon: <TbId className="text-blue-500" />, type: 'text', required: true },
    { key: 'firstName', label: 'First Name', icon: <FiUser className="text-blue-500" />, type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', icon: <FiUser className="text-blue-500" />, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-blue-500" />, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-blue-500" />, type: 'tel', required: true },
    { key: 'address', label: 'Address', icon: <FiMapPin className="text-blue-500" />, type: 'text', required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personalFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              {field.icon}
              <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
            </label>
            {isEditing ? (
              <input
                type={field.type}
                value={data[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                required={field.required}
              />
            ) : (
              <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                {data[field.key] || 'Not provided'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Professional Info Tab Component
const ProfessionalInfoTab = ({ data, isEditing, onChange }) => {
  const professionalFields = [
    { key: 'specialization', label: 'Specialization', icon: <TbStethoscope className="text-blue-500" />, type: 'text', required: true },
    { key: 'department', label: 'Department', icon: <TbBuildingHospital className="text-blue-500" />, type: 'text', required: true },
    { key: 'experience', label: 'Experience (Years)', icon: <FiAward className="text-blue-500" />, type: 'number', required: true }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionalFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              {field.icon}
              <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
            </label>
            {isEditing ? (
              <input
                type={field.type}
                value={data[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                required={field.required}
              />
            ) : (
              <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                {data[field.key] || 'Not provided'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Availability Tab Component
const AvailabilityTab = ({ data, isEditing, onChange, onWorkingHoursChange }) => {
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            Appointment Duration
          </label>
          {isEditing ? (
            <select
              value={data.appointmentDuration}
              onChange={(e) => onChange('appointmentDuration', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          ) : (
            <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              {data.appointmentDuration} minutes
            </p>
          )}
        </div>
      </div>

      {/* Working Hours */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="font-medium text-gray-900 capitalize">{day.label}</span>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={data.workingHours[day.key]?.start || ''}
                    onChange={(e) => onWorkingHoursChange(day.key, 'start', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={data.workingHours[day.key]?.end || ''}
                    onChange={(e) => onWorkingHoursChange(day.key, 'end', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <span className="text-gray-600">
                  {data.workingHours[day.key]?.start && data.workingHours[day.key]?.end 
                    ? `${data.workingHours[day.key].start} - ${data.workingHours[day.key].end}`
                    : 'Not available'
                  }
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;