// Profile.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiMapPin } from 'react-icons/fi';
import { FaWeight } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice';

const Profile = ({ userData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  
  const userAuthState = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userAuthState.emailId || '',
    phone: '',
    age: '',
    weight: '',
    bloodType: '',
    address: '',
    gender: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Load profile data from backend/API
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Helper function to check if profile is complete
  const checkProfileCompletion = (profileData) => {
    const requiredFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.emailId || profileData.email,
      profileData.phone,
      profileData.age,
      profileData.weight,
      profileData.bloodGroup || profileData.bloodType,
      profileData.address,
      profileData.gender
    ];

    return requiredFields.every(field => 
      field !== undefined && field !== null && field !== ''
    );
  };

  // Helper function to check if profile exists in DB (based on firstName and lastName being null/empty)
  const checkIfProfileExists = (profileData) => {
    // If both firstName and lastName are null/empty, profile doesn't exist yet
    return !(!profileData.firstName && !profileData.lastName);
  };

  const dispatch = useDispatch();

const fetchProfileData = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = userData?.jwtToken?.split(' ')[1]; 
    const userId = userData?.userId;

    if (!userId || !token) {
      console.error('User ID or token not found');
      throw new Error('Authentication required');
    }

    console.log("Fetching profile for userId:", userId);

    // Use the check endpoint first
    const response = await fetch(
      `${import.meta.env.VITE_PATIENT_SERVICE_BASE_URL}/check/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.ok) {
      let data;
      const responseText = await response.text();
      
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        // If not JSON, handle as error or empty data
        console.log('Response is not JSON:', responseText);
        data = {};
      }
      
      console.log('Profile data received:', data);
      
      // Check if profile actually exists in DB (not just empty response)
      const exists = checkIfProfileExists(data);
      setProfileExists(exists);
      
      // Map the backend DTO to your frontend formData structure
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.emailId || userAuthState.emailId || '',
        phone: data.phone || '',
        age: data.age || '',
        weight: data.weight || '',
        bloodType: data.bloodGroup || '',
        address: data.address || '',
        gender: data.gender || ''
      });

      // Update auth state if profile exists
      if (exists) {
        dispatch(loginSuccess({
          emailId: data.emailId,
          user: {
            age: data.age,
            phone: data.phone,
            firstName: data.firstName,
            id: data.patientId,
            bloodType: data.bloodGroup
          },
          role: "PATIENT",
          token: token
        }));
      }

      // Check if profile is complete and notify parent component
      const isComplete = checkProfileCompletion(data);
      if (onProfileComplete) {
        onProfileComplete(isComplete);
      }

    } else {
      const errorText = await response.text();
      console.error('Failed to fetch profile data:', response.status, errorText);
      
      // Try to parse error as JSON
      let errorMessage = `Failed to load profile: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      setError(errorMessage);
      
      // Profile doesn't exist
      setProfileExists(false);
      if (onProfileComplete) {
        onProfileComplete(false);
      }
    }

  } catch (error) {
    console.error('Error fetching profile:', error);
    setError('Failed to load profile. Please try again.');
    
    // Profile doesn't exist on error
    setProfileExists(false);
    
    // Fallback to localStorage if API fails
    const savedProfile = localStorage.getItem('patientProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setFormData(parsedProfile);
        console.log('Loaded profile from localStorage fallback');
      } catch (parseError) {
        console.error('Error loading saved profile from localStorage:', parseError);
      }
    } else {
      // If no localStorage fallback, check if we have email from auth state
      if (userAuthState.emailId) {
        setFormData(prev => ({
          ...prev,
          email: userAuthState.emailId
        }));
      }
    }
    
    // Notify parent that profile is not complete due to error
    if (onProfileComplete) {
      onProfileComplete(false);
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
      formData.address,
      formData.gender
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
    setError('');
    setSuccess('');

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.jwtToken?.split(' ')[1];
    const userId = userData?.userId;

    if (!userId || !token) {
      setError('Authentication required. Please log in again.');
      return;
    }

    console.log("Saving profile for userId:", userId);
    console.log("Profile exists:", profileExists);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.phone) {
      setError('Please fill all required fields (First Name, Last Name, Gender, Phone)');
      return;
    }

    let apiResponse;
    let isCreate = !profileExists; // Use profileExists state to determine create vs update

    if (profileExists) {
      // Profile exists, use PUT to update
      console.log("Existing profile found, updating via PUT...");
      apiResponse = await fetch(
        `${import.meta.env.VITE_PATIENT_SERVICE_BASE_URL}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            patientId: userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailId: formData.email,
            phone: formData.phone,
            age: formData.age,
            weight: formData.weight,
            bloodGroup: formData.bloodType,
            address: formData.address,
            gender: formData.gender,
          }),
        }
      );
    } else {
      // Profile doesn't exist, use POST to create
      console.log("No existing profile found, creating via POST...");
      apiResponse = await fetch(
        `${import.meta.env.VITE_PATIENT_SERVICE_BASE_URL}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            patientId: userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailId: formData.email,
            phone: formData.phone,
            age: formData.age,
            weight: formData.weight,
            bloodGroup: formData.bloodType,
            address: formData.address,
            gender: formData.gender,
          }),
        }
      );
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Failed to save profile:", apiResponse.status, errorText);
      
      // Try to parse the error response as JSON, but handle text response too
      let errorMessage = `Failed to save profile: ${apiResponse.status}`;
      try {
        // First try to parse as JSON
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        // If not JSON, use the text as is (might be plain text like "Patient updated successfully")
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Handle response - try JSON first, then text
    let result;
    const responseText = await apiResponse.text();
    
    try {
      // Try to parse as JSON
      result = JSON.parse(responseText);
      console.log("Profile saved successfully (JSON):", result);
    } catch (e) {
      // If not JSON, treat as plain text success message
      result = { message: responseText };
      console.log("Profile saved successfully (text):", responseText);
    }
    
    // Update profileExists state after successful save
    setProfileExists(true);
    
    setSuccess(isCreate ? "Profile created successfully!" : "Profile updated successfully!");
    
    // Check if profile is now complete
    const isComplete = checkProfileCompletion({
      ...formData,
      emailId: formData.email,
      bloodGroup: formData.bloodType
    });
    
    // Notify parent component
    if (onProfileComplete) {
      onProfileComplete(isComplete);
    }
    
    // Refresh profile data after save
    await fetchProfileData();
    
    // Exit edit mode after a short delay
    setTimeout(() => {
      setIsEditing(false);
      setSuccess('');
    }, 2000);

  } catch (err) {
    console.error("Error saving profile:", err);
    setError(err.message || "Failed to save profile. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    fetchProfileData(); // Reload data from backend
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const inputFields = [
    { key: 'firstName', label: 'First Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'gender', label: 'Gender', icon: <FiUser className="text-purple-500" />, type: 'select', required: true, options: genderOptions },
    { 
      key: 'email', 
      label: 'Email Address', 
      icon: <FiMail className="text-purple-500" />, 
      type: 'email', 
      required: true,
      disabled: true 
    },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-purple-500" />, type: 'tel', required: true },
    { key: 'bloodType', label: 'Blood Group', icon: <MdBloodtype className='text-purple-500'/>, type: 'select', required: true, options: bloodGroups },
    { key: 'age', label: 'Age', icon: <FiCalendar className="text-purple-500" />, type: 'number', required: true },
    { key: 'weight', label: 'Weight (kg)', icon: <FaWeight className='text-purple-500' />, type: 'number', required: true },
    { key: 'address', label: 'Address', icon: <FiMapPin className="text-purple-500" />, type: 'text', required: true }
  ];

  if (loading && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FiSave className="text-white text-sm" />
            </div>
            <div>
              <p className="text-green-800 font-medium">Success</p>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

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
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="text-lg" />
                )}
                {!profileExists ? 'Create Profile' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiEdit className="text-lg" />
              {!profileExists ? 'Create Profile' : 'Edit Profile'}
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
              {9 - Math.round((profileProgress / 100) * 9)} fields remaining
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
                field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={`w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 ${field.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    required={field.required}
                    disabled={field.disabled || loading}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={`w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 ${field.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                    disabled={field.disabled || loading}
                  />
                )
              ) : (
                <div className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-purple-900 font-semibold">
                    {formData[field.key] || 'Not provided'}
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
                <p className="text-green-700 text-sm">Click "Create Profile" to save your information</p>
              </div>
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
};

export default Profile;