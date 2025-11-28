// Profile.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiX, FiMapPin } from 'react-icons/fi';
import { FaWeight } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { useSelector } from 'react-redux';

const Profile = ({ userData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const userAuthState = useSelector((state)=>state.auth)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email:userAuthState.emailId ||  '',
    phone: '',
    age: '',
    weight: '',
    bloodType: '',
    address: '',
    // Removed lastCheckup field
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load profile data from backend/API
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/patient/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age || '',
          weight: data.weight || '',
          bloodType: data.bloodType || '',
          address: data.address || '',
          // Removed lastCheckup field
        });
      } else {
        console.error('Failed to fetch profile data');
        // Fallback to localStorage if API fails
        const savedProfile = localStorage.getItem('patientProfile');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setFormData(parsedProfile);
          } catch (error) {
            console.error('Error loading saved profile:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage if API fails
      const savedProfile = localStorage.getItem('patientProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setFormData(parsedProfile);
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
  }, [formData]);

  const calculateProgress = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.age,
      formData.weight,
      formData.bloodType,
      formData.address
    ];

    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;

    const progress = Math.round((completedFields / requiredFields.length) * 100);
    setProfileProgress(progress);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      console.log("HANDLE SAVE CLICKED");
      
      
      // Save to backend API
      const response = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        
        // Also save to localStorage as backup
        localStorage.setItem('patientProfile', JSON.stringify(formData));
        
        // Check if profile is complete enough and trigger completion
        if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
          onProfileComplete(formData);
        }
        
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
        // Fallback to localStorage if API fails
        localStorage.setItem('patientProfile', JSON.stringify(formData));
        
        if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
          onProfileComplete(formData);
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback to localStorage if API fails
      localStorage.setItem('patientProfile', JSON.stringify(formData));
      
      if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
        onProfileComplete(formData);
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

  const inputFields = [
    { key: 'firstName', label: 'First Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-purple-500" />, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-purple-500" />, type: 'tel', required: true },
     { key: 'bloodType', label: 'Blood Group', icon:<MdBloodtype className='text-purple-500'/> , type: 'select', required: true },
    { key: 'age', label: 'Age', icon: <FiCalendar className="text-purple-500" />, type: 'number', required: true },
    { key: 'weight', label: 'Weight (kg)', icon: <FaWeight className='text-purple-500' />, type: 'number', required: true },
   
    { key: 'address', label: 'Address', icon: <FiMapPin className="text-purple-500" />, type: 'text', required: true }
    // Removed lastCheckup field
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Progress Indicator */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiUser className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-purple-900">
              {!isProfileComplete ? 'Complete Your Profile' : 'Patient Profile'}
            </h1>
            <p className="text-purple-600">
              {!isProfileComplete 
                ? 'Finish setting up your profile to access all features' 
                : 'Manage your personal information'
              }
            </p>
          </div>
        </div>
        
        {/* Progress Bar for Incomplete Profiles */}
        {!isProfileComplete && (
          <div className="w-full lg:w-64">
            <div className="flex justify-between text-sm text-purple-600 mb-2">
              <span>Profile Completion</span>
              <span>{profileProgress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
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
                onClick={handleSave}
                disabled={loading || !isEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiEdit className="text-lg" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-purple-900 flex items-center space-x-2">
            <FiUser className="text-purple-600" />
            <span>Personal Information {!isProfileComplete && <span className="text-red-500">*</span>}</span>
          </h3>
          {!isProfileComplete && profileProgress < 100 && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {7 - Math.round((profileProgress / 100) * 7)} fields remaining
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-purple-700 text-sm font-medium flex items-center space-x-2">
                {field.icon}
                <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
              </label>
              {isEditing ? (
                field.key === 'bloodType' ? (
                  <select
                    value={formData.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required={field.required}
                  >
                    <option value="">Select Blood Type</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                  />
                )
              ) : (
                <div className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-purple-900 font-semibold">
                    {field.key === 'bloodType' && !formData.bloodType ? 'Not selected' : 
                     formData[field.key] || 'Not provided'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile Completion Message */}
        {!isProfileComplete && profileProgress === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FiSave className="text-white text-sm" />
              </div>
              <div>
                <p className="text-green-800 font-medium">Profile ready to complete!</p>
                <p className="text-green-700 text-sm">Click "Complete Profile" to unlock all features</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;