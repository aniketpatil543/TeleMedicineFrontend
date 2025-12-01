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
  FiAlertTriangle,
  FiClock,
} from 'react-icons/fi';
import { 
  TbStethoscope,
  TbBuildingHospital,
} from 'react-icons/tb';
import { useSelector } from 'react-redux';

const DoctorProfile = ({ doctorData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilitySuccess, setAvailabilitySuccess] = useState('');
  
  const userAuthState = useSelector(state => state.auth);

  // Get API base URL with fallback
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_DOCTOR_SERVICE_BASE_URL) {
      return import.meta.env.VITE_DOCTOR_SERVICE_BASE_URL;
    }
    console.warn('VITE_DOCTOR_SERVICE_BASE_URL is not set, using default localhost');
    return 'http://localhost:8084'; // Changed to 8084 based on your logs
  };

  // Get user data
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userId = userData?.userId || userAuthState?.user?.id;
  const token = userData?.jwtToken || userAuthState?.token;

  // Gender options - UPDATED to match backend enum
  const genderOptions = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
  
  const departmentOptions = [
    'EMERGENCY',
    'CARDIOLOGY',
    'ORTHOPEDICS',
    'NEUROLOGY',
    'PEDIATRICS',
    'RADIOLOGY',
    'GENERAL_MEDICINE',
    'DERMATOLOGY',
    'GYNAECOLOGY'
  ];

  const specializationOptions = [
    'CARDIOLOGY',
    'DERMATOLOGY',
    'PEDIATRICS',
    'NEUROLOGY',
    'ORTHOPEDICS',
    'GENERAL_MEDICINE',
    'PSYCHIATRY',
    'GYNAECOLOGY'
  ];
  
  const [profileData, setProfileData] = useState({
    doctorId: userId || '',
    firstName: '',
    lastName: '',
    email: userAuthState?.emailId || '',
    phone: '',
    gender: '',
    address: '',
    specialization: '',
    department: '',
    experience: '',
  });

  const [availabilityData, setAvailabilityData] = useState({
    workingHours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '16:00', enabled: true },
      saturday: { start: '09:00', end: '12:00', enabled: false },
      sunday: { start: '', end: '', enabled: false }
    },
    appointmentDuration: 30
  });

  // Helper function to check if profile is complete
  const checkProfileCompletion = (profileData) => {
    const requiredFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.emailId || profileData.email,
      profileData.phone,
      profileData.gender,
      profileData.specialization,
      profileData.department,
      profileData.experience
    ];

    return requiredFields.every(field => 
      field !== undefined && field !== null && field !== ''
    );
  };

  // Load saved profile data from backend/API
  useEffect(() => {
    fetchProfileData();
  }, [userAuthState]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        console.error('User ID not found');
        throw new Error('User ID not found');
      }

      let authToken = token;
      if (authToken && authToken.startsWith('Bearer ')) {
        authToken = authToken.split(' ')[1];
      }
      
      if (!authToken) {
        console.error('Authentication token not found');
        throw new Error('Authentication required');
      }

      const apiBaseUrl = getApiBaseUrl();

      // Fetch profile data
      const profileResponse = await fetch(
        `${apiBaseUrl}/manage/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        console.log('Profile data received:', data);
        
        setProfileData({
          doctorId: data.doctorId || userId,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.emailId || userAuthState?.emailId || '',
          phone: data.phone || '',
          gender: data.gender || '',
          address: data.address || '',
          specialization: data.specialization || '',
          department: data.department || '',
          experience: data.experience || '',
        });

        // Fetch availability separately
        await fetchAvailability(authToken, apiBaseUrl);

        const isComplete = checkProfileCompletion(data);
        if (onProfileComplete) {
          onProfileComplete(isComplete ? data : false);
        }

      } else if (profileResponse.status === 404) {
        console.log('No existing profile found - starting with empty form');
        setProfileData(prev => ({
          ...prev,
          email: userAuthState?.emailId || ''
        }));
        
        if (onProfileComplete) {
          onProfileComplete(false);
        }
      } else {
        const errorText = await profileResponse.text();
        throw new Error(`Failed to fetch profile: ${profileResponse.status} - ${errorText}`);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      
      const savedProfile = localStorage.getItem('doctorProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData(parsedProfile);
          console.log('Loaded profile from localStorage fallback');
        } catch (parseError) {
          console.error('Error loading saved profile from localStorage:', parseError);
        }
      }
      
      if (onProfileComplete) {
        onProfileComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };

 const fetchAvailability = async (authToken, apiBaseUrl) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/availability/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const availabilityArray = await response.json();
      console.log('Availability data received:', availabilityArray);
      
      // Transform backend array data to frontend format
      // Assuming the array order is: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      const transformedWorkingHours = {};
      
      availabilityArray.forEach((slot, index) => {
        if (index < daysOfWeek.length) {
          const dayKey = daysOfWeek[index];
          
          // Extract time from "09:00:00" format to "09:00"
          const startTime = slot.startTime ? slot.startTime.substring(0, 5) : '';
          const endTime = slot.endTime ? slot.endTime.substring(0, 5) : '';
          
          transformedWorkingHours[dayKey] = {
            start: startTime,
            end: endTime,
            enabled: !!(startTime && endTime) // Enable if both times exist
          };
        }
      });
      
      console.log('Transformed working hours:', transformedWorkingHours);
      
      // Update the availability data state
      setAvailabilityData(prev => ({
        ...prev,
        workingHours: transformedWorkingHours
      }));
      
    } else if (response.status !== 404) {
      console.error('Failed to fetch availability:', response.status);
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
};

  // Calculate profile completion percentage
  useEffect(() => {
    calculateProgress();
  }, [profileData]);

  const calculateProgress = () => {
    const requiredFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.gender,
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

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      if (!token || !userId) {
        alert('Authentication required. Please log in again.');
        return;
      }

      let authToken = token;
      if (authToken && authToken.startsWith('Bearer ')) {
        authToken = authToken.split(' ')[1];
      }

      const apiBaseUrl = getApiBaseUrl();
      
      // Save basic doctor profile
      const profileResponse = await fetch(
        `${apiBaseUrl}/manage/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctorId: userId,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            emailId: profileData.email,
            phone: profileData.phone,
            gender: profileData.gender,
            address: profileData.address,
            specialization: profileData.specialization,
            department: profileData.department,
            experience: parseInt(profileData.experience) || 0,
          }),
        }
      );

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        throw new Error(`Failed to update profile: ${profileResponse.status} - ${errorText}`);
      }

      const updatedDoctor = await profileResponse.json();
      console.log('Profile updated successfully:', updatedDoctor);
      
      localStorage.setItem('doctorProfile', JSON.stringify(profileData));
      
      const isComplete = checkProfileCompletion({
        ...profileData,
        emailId: profileData.email
      });
      
      if (isComplete && onProfileComplete) {
        onProfileComplete(profileData);
      }
      
      setIsEditing(false);
      alert('Profile saved successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError('');
      setAvailabilitySuccess('');
      
      if (!token || !userId) {
        alert('Authentication required. Please log in again.');
        return;
      }

      let authToken = token;
      if (authToken && authToken.startsWith('Bearer ')) {
        authToken = authToken.split(' ')[1];
      }

      const apiBaseUrl = getApiBaseUrl();

      // Clear existing availability first
      try {
        const existingAvailability = await fetch(
          `${apiBaseUrl}/availability/${userId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (existingAvailability.ok) {
          const slots = await existingAvailability.json();
          for (const slot of slots) {
            await fetch(
              `${apiBaseUrl}/availability/${userId}/slot/${slot.id}`,
              {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                },
              }
            );
          }
        }
      } catch (error) {
        console.warn('Could not clear existing availability:', error);
      }

      // Save new availability for enabled days
      let savedCount = 0;
      for (const [day, schedule] of Object.entries(availabilityData.workingHours)) {
        if (schedule.enabled && schedule.start && schedule.end) {
          const availabilityDTO = {
            doctorId: parseInt(userId),
            availableDate: new Date().toISOString().split('T')[0], // Today's date
            startTime: schedule.start + ':00', // Add seconds
            endTime: schedule.end + ':00', // Add seconds
          };

          const response = await fetch(
            `${apiBaseUrl}/availability`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(availabilityDTO),
            }
          );
          
          if (response.ok) {
            savedCount++;
          } else {
            console.warn(`Failed to save availability for ${day}:`, response.status);
          }
        }
      }

      setAvailabilitySuccess(`Successfully saved ${savedCount} availability slots!`);
      setTimeout(() => setAvailabilitySuccess(''), 3000);

    } catch (error) {
      console.error('Error saving availability:', error);
      setAvailabilityError(`Failed to save availability: ${error.message}`);
      setTimeout(() => setAvailabilityError(''), 5000);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleCancel = () => {
    fetchProfileData();
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAvailabilityData = (field, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateWorkingHours = (day, field, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleDayEnabled = (day) => {
    setAvailabilityData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          enabled: !prev.workingHours[day].enabled,
          start: !prev.workingHours[day].enabled ? '09:00' : '',
          end: !prev.workingHours[day].enabled ? '17:00' : ''
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
        return <PersonalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} genderOptions={genderOptions} />;
      case 'professional':
        return <ProfessionalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} departmentOptions={departmentOptions} specializationOptions={specializationOptions} />;
      case 'availability':
        return (
          <AvailabilityTab 
            data={availabilityData} 
            isEditing={isEditing} 
            onChange={updateAvailabilityData} 
            onWorkingHoursChange={updateWorkingHours}
            onToggleDay={toggleDayEnabled}
            onSaveAvailability={handleSaveAvailability}
            loading={availabilityLoading}
            error={availabilityError}
            success={availabilitySuccess}
          />
        );
      default:
        return <PersonalInfoTab data={profileData} isEditing={isEditing} onChange={updateField} genderOptions={genderOptions} />;
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
        
        {!isProfileComplete && (
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
        )}
        
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
                onClick={handleSaveProfile}
                disabled={loading || !isEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="text-lg" />
                )}
                {!isProfileComplete ? 'Complete Profile' : 'Save Profile'}
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
                {profileData.department ? `${profileData.department} Department` : 'Department not set'}
              </p>
              <p className="text-gray-500 text-sm">
                {profileData.experience || '0'} years experience
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Doctor ID</span>
                <span className="text-sm font-medium text-blue-900">
                  {profileData.doctorId || userId || 'Not set'}
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
const PersonalInfoTab = ({ data, isEditing, onChange, genderOptions }) => {
  const personalFields = [
    { key: 'firstName', label: 'First Name', icon: <FiUser className="text-blue-500" />, type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', icon: <FiUser className="text-blue-500" />, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-blue-500" />, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-blue-500" />, type: 'tel', required: true },
    { key: 'gender', label: 'Gender', icon: <FiUser className="text-blue-500" />, type: 'select', required: true, options: genderOptions },
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
              field.type === 'select' ? (
                <select
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option === 'MALE' ? 'Male' : 
                       option === 'FEMALE' ? 'Female' : 
                       option === 'OTHER' ? 'Other' : 
                       'Prefer not to say'}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              )
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
const ProfessionalInfoTab = ({ data, isEditing, onChange, departmentOptions, specializationOptions }) => {
  const professionalFields = [
    { 
      key: 'specialization', 
      label: 'Specialization', 
      icon: <TbStethoscope className="text-blue-500" />, 
      type: 'select', 
      required: true,
      options: specializationOptions
    },
    { 
      key: 'department', 
      label: 'Department', 
      icon: <TbBuildingHospital className="text-blue-500" />, 
      type: 'select', 
      required: true,
      options: departmentOptions
    },
    { 
      key: 'experience', 
      label: 'Experience (Years)', 
      icon: <FiAward className="text-blue-500" />, 
      type: 'number', 
      required: true 
    }
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
              field.type === 'select' ? (
                <select
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              )
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

// Availability Tab Component - FIXED
const AvailabilityTab = ({ 
  data, 
  isEditing, 
  onChange, 
  onWorkingHoursChange, 
  onToggleDay,
  onSaveAvailability,
  loading,
  error,
  success
}) => {
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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-green-600 text-xl" />
            <div>
              <h4 className="font-semibold text-green-800">Success</h4>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
          {isEditing && (
            <button
              onClick={onSaveAvailability}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiSave className="text-lg" />
              )}
              Save Availability
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Set your regular working hours. Patients will be able to book appointments during these times.
        </p>
        <div className="space-y-3">
          {days.map((day) => {
            const dayData = data.workingHours[day.key];
            const hasSchedule = dayData?.start && dayData?.end && dayData.start !== '' && dayData.end !== '';
            const isEnabled = dayData?.enabled !== false; // Default to true if not specified
            
            return (
              <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => onToggleDay(day.key)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${isEnabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                    >
                      {isEnabled && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${hasSchedule ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  )}
                  <span className="font-medium text-gray-900 capitalize">{day.label}</span>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={dayData?.start || ''}
                      onChange={(e) => onWorkingHoursChange(day.key, 'start', e.target.value)}
                      disabled={!isEnabled}
                      className={`border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEnabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={dayData?.end || ''}
                      onChange={(e) => onWorkingHoursChange(day.key, 'end', e.target.value)}
                      disabled={!isEnabled}
                      className={`border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEnabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                    />
                  </div>
                ) : (
                  <span className="text-gray-600">
                    {hasSchedule 
                      ? `${dayData.start} - ${dayData.end}`
                      : 'Not available'
                    }
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
          <p className="font-medium">Note:</p>
          <p>Availability is saved separately from your profile. Click "Save Availability" button to save your working hours.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;