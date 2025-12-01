import { useState, useEffect } from 'react';

export const usePatientProfileCompletion = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem('userData').patientProfile;
    
    if (!profileData) {
      setIsProfileComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      const profile = JSON.parse(profileData);
      
      // Define required fields for patient profile completion
      const requiredFields = [
        'name',
        'email',
        'phone',
        'age',
        'bloodType',
        'address'
      ];

      const isComplete = requiredFields.every(field => {
        const value = profile[field];
        return value !== undefined && value !== null && value !== '';
      });

      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setIsProfileComplete(false);
    }
    
    setIsLoading(false);
  };

  const markProfileAsComplete = (profileData) => {
    localStorage.setItem('patientProfile', JSON.stringify({
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