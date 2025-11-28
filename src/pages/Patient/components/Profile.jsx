// Profile.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiX, FiMapPin } from 'react-icons/fi';
import { FaWeight } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { useSelector,useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice';

const Profile = ({ userData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const userAuthState = useSelector((state) => state.auth);
  // userAuthState.user.id
  
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

  const dispatch=useDispatch();

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.jwtToken?.split(' ')[1]; 
      const userId = userData?.userId;

      if (!userId || !token) {
        console.error('User ID or token not found');
        throw new Error('Authentication required');
      }

      console.log("Fetching profile for userId:", userId);
      console.log("Using token:", token);

      // Call your patient service API
      const response = await fetch(
        `${import.meta.env.VITE_PATIENT_SERVICE_BASE_URL}/${userId}`,
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
        const data = await response.json();
        console.log('Profile data received:', data);
        
        // Map the backend DTO to your frontend formData structure
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.emailId || '', // Note: backend uses emailId, frontend uses email
          phone: data.phone || '',
          age: data.age || '',
          weight: data.weight || '',
          bloodType: data.bloodGroup || '', // Note: backend uses bloodGroup, frontend uses bloodType
          address: data.address || '',
          gender: data.gender || ''
        });

        dispatch(loginSuccess({
          emailId:data.emailId,
          user:{
            age:data.age,
            phone:data.phone,
            firstName:data.firstName,
            id:data.patientId,
            bloodType: data.bloodGroup
          },
          role:"PATIENT",
          token:token
        }))

        // Check if profile is complete and notify parent component
        const isComplete = checkProfileCompletion(data);
        if (onProfileComplete) {
          onProfileComplete(isComplete);
        }

      } else if (response.status === 404) {
        // Patient profile doesn't exist yet - this is normal for new users
        console.log('No existing profile found - starting with empty form');
        // Keep the default empty form data
        if (onProfileComplete) {
          onProfileComplete(false);
        }
      } else {
        console.error('Failed to fetch profile data:', response.status, response.statusText);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      
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

      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.jwtToken.split(" ")[1];
      const userId = userData?.userId;

      console.log("Updating profile for userId:", userId);

      const response = await fetch(
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update profile:", response.status, errorText);
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      // const updatedPatient = await response.json();
      // console.log("Profile updated successfully:", updatedPatient);

      // Save to localStorage as backup
      // localStorage.setItem('patientProfile', JSON.stringify(formData));
      
      // Check if profile is now complete
      // const isComplete = checkProfileCompletion({
      //   ...formData,
      //   emailId: formData.email,
      //   bloodGroup: formData.bloodType
      // });
      
      // Notify parent component
      if (onProfileComplete) {
        onProfileComplete(isComplete);
      }
      
      // Exit edit mode
      setIsEditing(false);

    } catch (err) {
      console.error("Error updating profile:", err);
      // You might want to show an error message to the user here
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
    { key: 'gender', label: 'Patient Gender', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-purple-500" />, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-purple-500" />, type: 'tel', required: true },
    { key: 'bloodType', label: 'Blood Group', icon: <MdBloodtype className='text-purple-500'/>, type: 'select', required: true },
    { key: 'age', label: 'Age', icon: <FiCalendar className="text-purple-500" />, type: 'number', required: true },
    { key: 'weight', label: 'Weight (kg)', icon: <FaWeight className='text-purple-500' />, type: 'number', required: true },
    { key: 'address', label: 'Address', icon: <FiMapPin className="text-purple-500" />, type: 'text', required: true }
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
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
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