import { useState, useEffect } from 'react';

export const useProfileCompletion = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem('doctorProfile');
    
    if (!profileData) {
      setIsProfileComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      const profile = JSON.parse(profileData);
      
      // Define required fields for profile completion
      const requiredFields = [
        'personalInfo.firstName',
        'personalInfo.lastName',
        'personalInfo.email',
        'personalInfo.phone',
        'professionalInfo.specialization',
        'professionalInfo.licenseNumber',
        'professionalInfo.yearsOfExperience'
      ];

      const isComplete = requiredFields.every(field => {
        const value = getNestedValue(profile, field);
        return value !== undefined && value !== null && value !== '';
      });

      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setIsProfileComplete(false);
    }
    
    setIsLoading(false);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const markProfileAsComplete = (profileData) => {
    localStorage.setItem('doctorProfile', JSON.stringify({
      ...profileData,
      isComplete: true,
      completedAt: new Date().toISOString()
    }));
    setIsProfileComplete(true);
  };

  return {
    isProfileComplete,
    isLoading,
    checkProfileCompletion,
    markProfileAsComplete
  };
};