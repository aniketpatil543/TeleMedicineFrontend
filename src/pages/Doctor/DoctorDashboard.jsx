// DoctorDashboard.jsx
import React, { useState } from 'react';
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
  FaSignOutAlt
} from 'react-icons/fa';
import DoctorSidebar from './components/DoctorSidebar';
import DoctorHeader from './components/DoctorHeader';
import TodayAppointments from './components/TodayAppointments';
import PatientList from './components/PatientList';
import MedicalRecords from './components/MedicalRecords';
import PrescriptionWriter from './components/PrescriptionWriter';
import ConsultationRoom from './components/ConsultationRoom';
import DoctorProfile from './components/DoctorProfile';
import Notification from './components/Notification';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {doctorData.name}</h1>
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
              {/* Today's Appointments */}
              <TodayAppointments />

              {/* Patient List */}
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
        return <DoctorProfile doctorData={doctorData} />;
      
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

      {/* Sidebar */}
      <DoctorSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        toggleSidebar={toggleSidebar}
        toggleMobileMenu={toggleMobileMenu}
        notificationCount={doctorData.notifications}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        {/* Header */}
        <DoctorHeader 
          doctorData={doctorData}
          toggleMobileMenu={toggleMobileMenu}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
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