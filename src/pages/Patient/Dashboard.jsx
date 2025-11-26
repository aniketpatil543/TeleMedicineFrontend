import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Appointments from './components/Appointments';
import MedicalRecords from './components/MedicalRecords';
import Prescriptions from './components/Prescriptions';
import Notifications from './components/Notifications';
import Profile from './components/Profile';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
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

    setUserData(mockUserData);
    setNotifications(mockNotifications);
  }, []);

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

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview userData={userData} />;
      case 'appointments':
        return <Appointments appointments={userData?.upcomingAppointments || []} />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'prescriptions':
        return <Prescriptions prescriptions={userData?.recentPrescriptions || []} />;
      case 'notifications':
        return <Notifications 
          notifications={notifications} 
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />;
      case 'profile':
        return <Profile userData={userData} />;
      default:
        return <Overview userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F0FF]">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        notificationCount={notifications.filter(n => !n.read).length}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        userData={userData}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-20'}`}>
        <Header 
          userData={userData} 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;