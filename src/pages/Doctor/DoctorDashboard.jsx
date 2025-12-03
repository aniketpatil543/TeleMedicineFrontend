// DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaUserInjured, 
  FaPills, 
  FaFileMedical, 
  FaBell, 
  FaSearch,
  FaPlus,
  FaBars,
  FaTimes,
  FaStethoscope,
  FaVideo,
  FaUserCircle,
  FaSignOutAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import DoctorSidebar from './components/DoctorSidebar';
import DoctorHeader from './components/DoctorHeader';
import TodayAppointments from './components/TodayAppointments';
import PatientList from './components/PatientList';
import MedicalRecords from './components/MedicalRecords';
import PrescriptionWriter from './components/PrescriptionWriter';
import ConsultationRoom from './components/ConsultationRoom';
import DoctorProfile from './components/DoctorProfile';
import Notification from './components/Notification';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import { useProfileCompletion } from './components/useProfileCompletion';
import { useSelector } from 'react-redux';

const DoctorDashboard = () => {
  const { token ,  user } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ isProfileComplete, setIsProfileComplete ] = useState(user.profileComplete) ;
  const [ isLoading, setIsLoading ] = useState(false) ;
  const navigate = useNavigate();

    useEffect(()=>{
    setIsProfileComplete( user.profileComplete ) ;
  },[user])
  
  // const { 
  //   isProfileComplete, 
  //   isLoading, 
  //   markProfileAsComplete 
  // } = useProfileCompletion();
   
  console.log("isProfileComplete in DoctorDashboard:", isProfileComplete );
  
  // Mock data
  const doctorData = {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    email: 'sarah.johnson@medicarepro.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
    notifications: 3
  };

  const stats = {
    totalPatients: 1247,
    todayAppointments: 8,
    pendingPrescriptions: 5
  };

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Enhanced section change handler with profile completion check
  const handleSectionChange = (section) => {
    if (!isProfileComplete && section !== 'profile') {
      toast.error('Please complete your profile first', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    setActiveSection(section);
  };

  // Enhanced logout function
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('doctorProfile');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    
    toast.success('You have been logged out successfully!', {
      duration: 3000,
      position: 'top-right',
      icon: '👋',
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        fontSize: '16px',
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
    // toast.success('Profile completed successfully!', {
    //   duration: 3000,
    //   position: 'top-right'
    // });
    // setActiveSection('overview');
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
    if (!isProfileComplete && activeSection !== 'profile') {
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
        return (
          <div className="space-y-6">
            {/* Welcome Section with Profile Completion Badge */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg relative">
              {!isProfileComplete && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Setup Incomplete
                </div>
              )}
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {doctorData.name}
                {isProfileComplete && (
                  <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </h1>
              <p className="text-purple-100">Search patients, records, appointments...</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <FaUserInjured className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalPatients}</h3>
                    <p className="text-gray-600">Total Patients</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <FaCalendarAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</h3>
                    <p className="text-gray-600">Today's Appointments</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <FaPills className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.pendingPrescriptions}</h3>
                    <p className="text-gray-600">Pending Prescriptions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TodayAppointments />
              <PatientList />
            </div>
          </div>
        );
      
      case 'appointments':
        return <TodayAppointments detailed={true} />;
      
      case 'patients':
        return <PatientList detailed={true} />;
      
      case 'medical-records':
        return <MedicalRecords />;
      
      case 'prescriptions':
        return <PrescriptionWriter />;
      
      case 'consultation':
        return <ConsultationRoom />;
      
      case 'notifications':
        return <Notification />;
      
      case 'profile':
        return (
          <DoctorProfile 
            doctorData={doctorData}
            onProfileComplete={handleProfileComplete}
            isProfileComplete={isProfileComplete}
          />
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-purple-100">
            <div className="text-purple-400 text-6xl mb-4">
              <FaFileMedical />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Section Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F0FF]">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

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

      {/* Sidebar */}
      <DoctorSidebar 
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        sidebarOpen={sidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        toggleSidebar={toggleSidebar}
        toggleMobileMenu={toggleMobileMenu}
        notificationCount={doctorData.notifications}
        onLogout={handleLogout}
        isProfileComplete={isProfileComplete}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        {/* Header */}
        <DoctorHeader 
          doctorData={doctorData}
          toggleMobileMenu={toggleMobileMenu}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          isProfileComplete={isProfileComplete}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;