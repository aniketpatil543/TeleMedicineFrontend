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
  FiAlertTriangle
} from 'react-icons/fi';
import { 
  TbStethoscope,
  TbCertificate,
  TbLanguage
} from 'react-icons/tb';

const DoctorProfile = ({ doctorData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileProgress, setProfileProgress] = useState(0);
  
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      languages: []
    },
    professionalInfo: {
      specialization: '',
      licenseNumber: '',
      yearsOfExperience: '',
      education: [
        { degree: '', institution: '', year: '' }
      ],
      certifications: []
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '16:00' }
      },
      appointmentDuration: 30,
      maxPatientsPerDay: 20
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      privacy: {
        profileVisible: true,
        schedulePublic: true
      }
    }
  });

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('doctorProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  // Calculate profile completion percentage
  useEffect(() => {
    calculateProgress();
  }, [profileData]);

  const calculateProgress = () => {
    const requiredFields = [
      profileData.personalInfo.firstName,
      profileData.personalInfo.lastName,
      profileData.personalInfo.email,
      profileData.personalInfo.phone,
      profileData.professionalInfo.specialization,
      profileData.professionalInfo.licenseNumber,
      profileData.professionalInfo.yearsOfExperience
    ];

    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;

    const progress = Math.round((completedFields / requiredFields.length) * 100);
    setProfileProgress(progress);
  };

  const handleSave = () => {
    setIsEditing(false);
    
    // Save to localStorage
    localStorage.setItem('doctorProfile', JSON.stringify(profileData));
    
    // Check if profile is complete enough and trigger completion
    if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
      onProfileComplete(profileData);
    }
  };

  const updateField = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: <FiUser /> },
    { id: 'professional', label: 'Professional', icon: <TbStethoscope /> },
    { id: 'availability', label: 'Availability', icon: <FiCalendar /> },
    { id: 'settings', label: 'Settings', icon: <FiShield /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInfoTab data={profileData.personalInfo} isEditing={isEditing} onChange={updateField} />;
      case 'professional':
        return <ProfessionalInfoTab data={profileData.professionalInfo} isEditing={isEditing} onChange={updateField} />;
      case 'availability':
        return <AvailabilityTab data={profileData.availability} isEditing={isEditing} onChange={updateField} />;
      case 'settings':
        return <SettingsTab data={profileData.settings} isEditing={isEditing} onChange={updateField} />;
      default:
        return <PersonalInfoTab data={profileData.personalInfo} isEditing={isEditing} onChange={updateField} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress Indicator */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiUser className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
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
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="text-lg" />
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
                {profileData.personalInfo.firstName?.charAt(0) || 'D'}
                {profileData.personalInfo.lastName?.charAt(0) || 'R'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {profileData.personalInfo.firstName || 'Doctor'} {profileData.personalInfo.lastName || 'Name'}
              </h3>
              <p className="text-blue-600 font-medium">{profileData.professionalInfo.specialization || 'Specialization'}</p>
              <p className="text-gray-500 text-sm mt-1">
                {profileData.professionalInfo.yearsOfExperience || '0'} years experience
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">License</span>
                <span className="text-sm font-medium text-blue-900">
                  {profileData.professionalInfo.licenseNumber || 'Not set'}
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

// Tab Components (keep the same as your original)
const PersonalInfoTab = ({ data, isEditing, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
        {isEditing ? (
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => onChange('personalInfo', 'firstName', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.firstName || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
        {isEditing ? (
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => onChange('personalInfo', 'lastName', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.lastName || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiMail className="text-gray-400" />
          Email *
        </label>
        {isEditing ? (
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('personalInfo', 'email', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.email || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiPhone className="text-gray-400" />
          Phone *
        </label>
        {isEditing ? (
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange('personalInfo', 'phone', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.phone || 'Not set'}</p>
        )}
      </div>

      {/* Rest of the PersonalInfoTab remains the same */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiMapPin className="text-gray-400" />
          Address
        </label>
        {isEditing ? (
          <textarea
            value={data.address || ''}
            onChange={(e) => onChange('personalInfo', 'address', e.target.value)}
            rows="2"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your address"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.address || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          Date of Birth
        </label>
        {isEditing ? (
          <input
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => onChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 font-medium">
            {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'Not set'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        {isEditing ? (
          <input
            type="text"
            value={data.languages?.join(', ') || ''}
            onChange={(e) => onChange('personalInfo', 'languages', e.target.value.split(', '))}
            placeholder="English, Spanish, French"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.languages?.map((lang, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <TbLanguage className="inline mr-1" />
                {lang}
              </span>
            )) || 'Not set'}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ProfessionalInfoTab, AvailabilityTab, and SettingsTab components remain the same as your original
// ... (include them with similar required field indicators)

const ProfessionalInfoTab = ({ data, isEditing, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
        {isEditing ? (
          <input
            type="text"
            value={data.specialization || ''}
            onChange={(e) => onChange('professionalInfo', 'specialization', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your specialization"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.specialization || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
        {isEditing ? (
          <input
            type="text"
            value={data.licenseNumber || ''}
            onChange={(e) => onChange('professionalInfo', 'licenseNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your license number"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.licenseNumber || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
        {isEditing ? (
          <input
            type="number"
            value={data.yearsOfExperience || ''}
            onChange={(e) => onChange('professionalInfo', 'yearsOfExperience', parseInt(e.target.value) || '')}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter years of experience"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.yearsOfExperience ? `${data.yearsOfExperience} years` : 'Not set'}</p>
        )}
      </div>
    </div>

    {/* Education and Certifications sections remain the same */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiBook className="text-blue-600" />
        Education
      </h3>
      <div className="space-y-3">
        {data.education?.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{edu.degree || 'Degree not set'}</p>
                <p className="text-gray-600 text-sm">{edu.institution || 'Institution not set'}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.year || 'Year not set'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TbCertificate className="text-green-600" />
        Certifications
      </h3>
      <div className="space-y-2">
        {data.certifications?.map((cert, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
            <FiAward className="text-green-600" />
            <span className="text-green-800 font-medium">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// AvailabilityTab and SettingsTab remain the same as your original
const AvailabilityTab = ({ data, isEditing, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Duration</label>
        {isEditing ? (
          <select
            value={data.appointmentDuration}
            onChange={(e) => onChange('availability', 'appointmentDuration', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        ) : (
          <p className="text-gray-900 font-medium">{data.appointmentDuration} minutes</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Patients Per Day</label>
        {isEditing ? (
          <input
            type="number"
            value={data.maxPatientsPerDay}
            onChange={(e) => onChange('availability', 'maxPatientsPerDay', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 font-medium">{data.maxPatientsPerDay} patients</p>
        )}
      </div>
    </div>

    {/* Working Hours */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
      <div className="space-y-3">
        {Object.entries(data.workingHours).map(([day, hours]) => (
          <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <span className="font-medium text-gray-900 capitalize">{day}</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={hours.start}
                  onChange={(e) => onChange('availability', 'workingHours', {
                    ...data.workingHours,
                    [day]: { ...hours, start: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={hours.end}
                  onChange={(e) => onChange('availability', 'workingHours', {
                    ...data.workingHours,
                    [day]: { ...hours, end: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <span className="text-gray-600">
                {hours.start} - {hours.end}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsTab = ({ data, isEditing, onChange }) => (
  <div className="space-y-6">
    {/* Notifications */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiBell className="text-blue-600" />
        Notification Preferences
      </h3>
      <div className="space-y-3">
        {Object.entries(data.notifications).map(([type, enabled]) => (
          <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="font-medium text-gray-900 capitalize">{type} Notifications</p>
              <p className="text-gray-600 text-sm">Receive {type} notifications</p>
            </div>
            {isEditing ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onChange('settings', 'notifications', {
                    ...data.notifications,
                    [type]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            ) : (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Privacy Settings */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiShield className="text-green-600" />
        Privacy Settings
      </h3>
      <div className="space-y-3">
        {Object.entries(data.privacy).map(([setting, enabled]) => (
          <div key={setting} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">
                {setting === 'profileVisible' ? 'Profile Visibility' : 'Schedule Public'}
              </p>
              <p className="text-gray-600 text-sm">
                {setting === 'profileVisible' 
                  ? 'Make your profile visible to patients' 
                  : 'Show your schedule to patients'
                }
              </p>
            </div>
            {isEditing ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onChange('settings', 'privacy', {
                    ...data.privacy,
                    [setting]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            ) : (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {enabled ? 'Public' : 'Private'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DoctorProfile;