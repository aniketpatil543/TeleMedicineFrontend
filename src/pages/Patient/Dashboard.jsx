// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Appointments from './components/Appointments';
import MedicalRecords from './components/MedicalRecords';
import Prescriptions from './components/Prescriptions';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import BookAppointment from "./components/BookAppointment";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import { usePatientProfileCompletion } from './components/usePatientProfileCompletion';
import { FaExclamationTriangle, FaUserCircle } from 'react-icons/fa';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const { 
    isProfileComplete, 
    isLoading, 
    markProfileAsComplete 
  } = usePatientProfileCompletion();

  useEffect(() => {
    // Load saved profile data first
    const savedProfile = localStorage.getItem('patientProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUserData(parsedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }

    // Mock data - replace with actual API calls
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 45,
      bloodType: 'O+',
      lastCheckup: '2024-01-15',
      phone: '+1 (555) 123-4567',
      memberSince: '2023-06-15',
      upcomingAppointments: [
        {
          id: 1,
          doctor: 'Dr. Sarah Wilson',
          specialization: 'Cardiologist',
          date: '2024-01-20',
          time: '10:00 AM',
          type: 'Video Consultation',
          status: 'confirmed'
        },
        {
          id: 2,
          doctor: 'Dr. Michael Chen',
          specialization: 'Dermatologist',
          date: '2024-01-25',
          time: '2:30 PM',
          type: 'In-Person',
          status: 'confirmed'
        }
      ],
      recentPrescriptions: [
        {
          id: 1,
          medication: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          prescribedBy: 'Dr. Sarah Wilson',
          date: '2024-01-15'
        }
      ],
      medicalAlerts: [
        'Annual physical due in 2 months',
        'Prescription refill available'
      ]
    };
    
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment',
        message: 'Upcoming appointment with Dr. Smith tomorrow at 2:00 PM',
        time: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'prescription',
        message: 'New prescription for Amoxicillin added',
        time: '1 day ago',
        read: true,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'test',
        message: 'Lab test results are now available',
        time: '3 days ago',
        read: true,
        priority: 'medium'
      }
    ];

    // Only set mock data if no saved profile exists
    if (!savedProfile) {
      setUserData(mockUserData);
    }
    setNotifications(mockNotifications);
  }, []);

  // Redirect to profile if not complete
  useEffect(() => {
    if (!isLoading && !isProfileComplete && activeSection !== 'profile') {
      setActiveSection('profile');
      toast.loading('Please complete your profile to access all features', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [isLoading, isProfileComplete, activeSection]);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Enhanced section change handler with profile completion check
  const handleSectionChange = (section) => {
    if (!isProfileComplete && section !== 'profile' && section !== 'notifications') {
      toast.error('Please complete your profile first', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('patientProfile');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    
    setUserData(null);
    setNotifications([]);
    
    toast.success('You have been logged out successfully!', {
      duration: 3000,
      position: 'top-right',
      icon: '👋',
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Handle profile completion
  const handleProfileComplete = (profileData) => {
    markProfileAsComplete(profileData);
    setUserData(profileData);
    toast.success('Profile completed successfully!', {
      duration: 3000,
      position: 'top-right'
    });
    setActiveSection('overview');
  };

  const renderSection = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    // Show profile completion warning for other sections
    if (!isProfileComplete && activeSection !== 'profile' && activeSection !== 'notifications') {
      return (
        <div className="space-y-6">
          {/* Profile Completion Required Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-amber-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Profile Completion Required
                </h3>
                <p className="text-amber-700">
                  Please complete your profile setup to access all dashboard features.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('profile')}
                className="ml-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>

          {/* Restricted Access Message */}
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
            <div className="text-amber-400 text-6xl mb-4">
              <FaUserCircle />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 mb-4">
              Complete your profile setup to unlock all features of your dashboard.
            </p>
            <button
              onClick={() => setActiveSection('profile')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            >
              Go to Profile Setup
            </button>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return <Overview userData={userData} isProfileComplete={isProfileComplete} />;
      case 'appointments':
        return <Appointments appointments={userData?.upcomingAppointments || []} 
         setActiveSection={setActiveSection}/>;
      case 'medical-records':
        return <MedicalRecords />;
      case "book-appointment":
        return <BookAppointment />;
      case 'prescriptions':
        return <Prescriptions prescriptions={userData?.recentPrescriptions || []} />;
      case 'notifications':
        return <Notifications 
          notifications={notifications} 
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />;
      case 'profile':
        return (
          <Profile 
            userData={userData} 
            onProfileComplete={handleProfileComplete}
            isProfileComplete={isProfileComplete}
          />
        );
      default:
        return <Overview userData={userData} isProfileComplete={isProfileComplete} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F0FF]">
      {/* Toast Container */}
      <Toaster 
        toastOptions={{
          duration: 3000,
          position: 'top-right',
          className: 'font-sans',
          success: {
            className: 'bg-green-50 text-green-800 border border-green-200 shadow-lg',
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          },
          error: {
            className: 'bg-red-50 text-red-800 border border-red-200 shadow-lg',
            style: {
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        notificationCount={notifications.filter(n => !n.read).length}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        userData={userData}
        onLogout={handleLogout}
        isProfileComplete={isProfileComplete}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-20'}`}>
        <Header 
          userData={userData} 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          isProfileComplete={isProfileComplete}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;