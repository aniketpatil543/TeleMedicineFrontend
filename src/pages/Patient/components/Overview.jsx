import React from 'react';
import { FiCalendar, FiFileText, FiUser, FiBell, FiBarChart2 } from 'react-icons/fi';
import { TbPill } from 'react-icons/tb';

const Overview = ({ userData }) => {
  const stats = [
    { 
      label: 'Upcoming Appointments', 
      value: userData?.upcomingAppointments?.length || 0, 
      icon: <FiCalendar className="text-2xl" />,
      color: 'bg-blue-500'
    },
    { 
      label: 'Active Prescriptions', 
      value: userData?.recentPrescriptions?.length || 0, 
      icon: <TbPill className="text-2xl" />,
      color: 'bg-green-500'
    },
    { 
      label: 'Medical Records', 
      value: '12', 
      icon: <FiFileText className="text-2xl" />,
      color: 'bg-purple-500'
    },
    { 
      label: 'Pending Alerts', 
      value: userData?.medicalAlerts?.length || 0, 
      icon: <FiBell className="text-2xl" />,
      color: 'bg-orange-500'
    }
  ];

  const upcomingAppointments = userData?.upcomingAppointments || [];

  const recentPrescriptions = userData?.recentPrescriptions || [];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {userData?.name}!</h2>
        <p className="text-purple-100 text-lg">Your health journey matters to us</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-900 flex items-center space-x-2">
              <FiCalendar />
              <span>Upcoming Appointments</span>
            </h3>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                    <p className="text-sm text-purple-600">{appointment.specialization}</p>
                    <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {appointment.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{appointment.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <FiUser />
              <span>Patient Information</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Age</p>
                <p className="font-semibold text-purple-700">{userData?.age} years</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Blood Type</p>
                <p className="font-semibold text-purple-700">{userData?.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Checkup</p>
                <p className="font-semibold text-purple-700">{userData?.lastCheckup}</p>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <TbPill />
              <span>Current Prescriptions</span>
            </h3>
            <div className="space-y-3">
              {recentPrescriptions.map(prescription => (
                <div key={prescription.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-purple-700">{prescription.medication}</p>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-purple-600 text-sm">{prescription.dosage}</p>
                  <p className="text-purple-600 text-sm">{prescription.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <FiBarChart2 />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                Book Appointment
              </button>
              <button className="p-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                Upload Records
              </button>
              <button className="p-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                Message Doctor
              </button>
              <button className="p-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;