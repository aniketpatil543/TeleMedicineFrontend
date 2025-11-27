// Profile.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiAlertTriangle, FiHeart } from 'react-icons/fi';

const Profile = ({ userData, onProfileComplete, isProfileComplete }) => {
  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [profileProgress, setProfileProgress] = useState(0);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    age: userData?.age || '',
    bloodType: userData?.bloodType || '',
    lastCheckup: userData?.lastCheckup || '',
    address: userData?.address || '',
    allergies: userData?.allergies || ['Penicillin'],
    conditions: userData?.conditions || ['Hypertension']
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('patientProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setFormData(parsedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

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

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('patientProfile', JSON.stringify(formData));
    
    // Check if profile is complete enough and trigger completion
    if (profileProgress === 100 && !isProfileComplete && onProfileComplete) {
      onProfileComplete(formData);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedProfile = localStorage.getItem('patientProfile');
    if (savedProfile) {
      try {
        setFormData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    } else {
      setFormData({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        age: userData?.age || '',
        bloodType: userData?.bloodType || '',
        lastCheckup: userData?.lastCheckup || '',
        address: userData?.address || '',
        allergies: userData?.allergies || ['Penicillin'],
        conditions: userData?.conditions || ['Hypertension']
      });
    }
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const inputFields = [
    { key: 'firstName', label: 'First Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', icon: <FiUser className="text-purple-500" />, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-purple-500" />, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-purple-500" />, type: 'tel', required: true },
    { key: 'age', label: 'Age', icon: <FiCalendar className="text-purple-500" />, type: 'number', required: true },
    { key: 'bloodType', label: 'Blood Type', icon: '🩸', type: 'text', required: true },
    { key: 'lastCheckup', label: 'Last Checkup', icon: <FiCalendar className="text-purple-500" />, type: 'date', required: false },
    { key: 'address', label: 'Address', icon: '🏠', type: 'text', required: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Progress Indicator */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiUser className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-900">
              {!isProfileComplete ? 'Complete Your Profile' : 'Patient Profile'}
            </h1>
            <p className="text-purple-600">
              {!isProfileComplete 
                ? 'Finish setting up your profile to access all features' 
                : 'Manage your personal and medical information'
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
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="text-lg" />
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

      {/* Warning Banner for Incomplete Profile */}
      {!isProfileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-600 text-xl" />
            <div>
              <h4 className="font-semibold text-amber-800">Profile Setup Required</h4>
              <p className="text-amber-700 text-sm">
                Complete your profile to unlock all dashboard features like booking appointments, viewing medical records, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className=" max-w-5xl gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <FiUser className="text-purple-600" />
              <span>Personal Information {!isProfileComplete && <span className="text-red-500">*</span>}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-purple-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    {field.icon}
                    <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  ) : (
                    <p className="text-purple-900 font-semibold px-3 py-2 bg-purple-50 rounded-lg">
                      {formData[field.key] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Medical Information */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <FiHeart className="text-purple-600" />
              <span>Medical Information</span>
            </h3> */}
            
            {/* Allergies */}
            {/* <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-purple-800">Allergies</h4>
                {isEditing && (
                  <span className="text-sm text-purple-600">{formData.allergies.length}/10</span>
                )}
              </div>
              <div className="space-y-2">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                    {isEditing ? (
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => {
                          const updatedAllergies = [...formData.allergies];
                          updatedAllergies[index] = e.target.value;
                          setFormData(prev => ({ ...prev, allergies: updatedAllergies }));
                        }}
                        className="flex-1 bg-transparent outline-none text-red-800"
                      />
                    ) : (
                      <span className="text-red-800">{allergy}</span>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeAllergy(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && formData.allergies.length < 10 && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Add allergy"
                    />
                    <button
                      onClick={addAllergy}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
              </div>
            </div> */}

            {/* Medical Conditions */}
            {/* <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-purple-800">Medical Conditions</h4>
                {isEditing && (
                  <span className="text-sm text-purple-600">{formData.conditions.length}/10</span>
                )}
              </div>
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                    {isEditing ? (
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => {
                          const updatedConditions = [...formData.conditions];
                          updatedConditions[index] = e.target.value;
                          setFormData(prev => ({ ...prev, conditions: updatedConditions }));
                        }}
                        className="flex-1 bg-transparent outline-none text-green-800"
                      />
                    ) : (
                      <span className="text-green-800">{condition}</span>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeCondition(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && formData.conditions.length < 10 && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Add condition"
                    />
                    <button
                      onClick={addCondition}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          
        </div>

        {/* Medical Emergency Card */}
        {/* <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiHeart className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Medical Emergency Card</h3>
              <p className="text-red-100 text-sm">Show this to medical personnel in case of emergency</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-red-100 text-xs font-medium">Name</p>
                <p className="font-semibold text-lg">
                  {formData.firstName || 'First'} {formData.lastName || 'Last'}
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-red-100 text-xs font-medium">Blood Type</p>
                <p className="font-semibold text-lg">
                  {formData.bloodType || 'Not specified'}
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-red-100 text-xs font-medium">Age</p>
                <p className="font-semibold text-lg">
                  {formData.age || 'Not specified'} years
                </p>
              </div>
              
              {formData.allergies.length > 0 && (
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-red-100 text-xs font-medium">Allergies</p>
                  <p className="font-semibold text-sm">
                    {formData.allergies.join(', ')}
                  </p>
                </div>
              )}
              
              {formData.conditions.length > 0 && (
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-red-100 text-xs font-medium">Conditions</p>
                  <p className="font-semibold text-sm">
                    {formData.conditions.join(', ')}
                  </p>
                </div>
              )}
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-red-100 text-xs font-medium">Emergency Contact</p>
                <p className="font-semibold text-sm">
                  {formData.phone || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-red-100 text-xs">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          Quick Actions
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-left">
                Download Emergency Card
              </button>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 text-left">
                Share Medical Info
              </button>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 text-left">
                Print Medical Summary
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;