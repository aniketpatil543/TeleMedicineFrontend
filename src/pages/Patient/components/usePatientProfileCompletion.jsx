import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const usePatientProfileCompletion = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  
  const { token , user } = useSelector((state) => state.auth);

  
  console.log("Thisss ==> " + isProfileComplete );
  console.log( user);
  
  

  const checkProfileCompletion = () => {
    const profileData = user ||  localStorage.getItem('userData').patientProfile;
    
    if (!profileData) {
      setIsProfileComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      const profile = JSON.parse(profileData);
      
      // Define required fields for patient profile completion
      const requiredFields = [
        'firstName',
        "lastName" ,
        'emailId',
        'phone',
        'age',
        'bloodGroup',
        'address',
        "weight",
        "gender",
        "profileComplete"
      ];

      const isComplete = requiredFields.every(field => {
        const value = profile[field];
        console.log("Value ==> " + value);
        
        return value !== undefined && value !== null && value !== '';
      });

      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setIsProfileComplete(false);
    }
    
    setIsLoading(false);
  };

   useEffect( () => {
    checkProfileCompletion();
  }, [user]);

  const markProfileAsComplete = (profileData) => {
    localStorage.setItem('patientProfile', JSON.stringify({
      ...profileData
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