// components/Overview.jsx
import React from 'react';

const Overview = ({ userData }) => {
  const healthMetrics = [
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: '❤️', color: 'bg-[#FF6B8B]' },
    { label: 'Blood Pressure', value: '120/80', status: 'normal', icon: '💓', color: 'bg-[#8B5FBF]' },
    { label: 'Blood Sugar', value: '98 mg/dL', status: 'normal', icon: '🩸', color: 'bg-[#6D48C5]' },
    { label: 'Weight', value: '75 kg', status: 'stable', icon: '⚖️', color: 'bg-[#4A90E2]' }
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Smith', date: 'Tomorrow, 2:00 PM', type: 'Regular Checkup' },
    { id: 2, doctor: 'Dr. Michael Brown', date: 'Jan 25, 10:30 AM', type: 'Cardiology' }
  ];

  const recentPrescriptions = [
    { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily', status: 'Active' },
    { id: 2, name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Good morning, {userData?.name}!</h2>
        <p className="text-[#E8E0FF]">Your health is looking great today. Keep up the good work!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Health Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="bg-[#F4F0FF] rounded-xl p-4 border border-[#E8E0FF]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{metric.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'normal' 
                        ? 'bg-[#E8F5E8] text-[#4CAF50]' 
                        : 'bg-[#E8E0FF] text-[#6D48C5]'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <p className="text-[#6D48C5] font-semibold text-lg">{metric.value}</p>
                  <p className="text-[#8B5FBF] text-sm">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#6D48C5]">Upcoming Appointments</h3>
              <button className="text-[#6D48C5] hover:text-[#8B5FBF] text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                  <div>
                    <p className="font-semibold text-[#6D48C5]">{appointment.doctor}</p>
                    <p className="text-[#8B5FBF] text-sm">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#6D48C5]">{appointment.date}</p>
                    <button className="text-[#6D48C5] hover:text-[#8B5FBF] text-sm">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[#8B5FBF] text-sm">Age</p>
                <p className="font-semibold text-[#6D48C5]">{userData?.age} years</p>
              </div>
              <div>
                <p className="text-[#8B5FBF] text-sm">Blood Type</p>
                <p className="font-semibold text-[#6D48C5]">{userData?.bloodType}</p>
              </div>
              <div>
                <p className="text-[#8B5FBF] text-sm">Last Checkup</p>
                <p className="font-semibold text-[#6D48C5]">{userData?.lastCheckup}</p>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Current Prescriptions</h3>
            <div className="space-y-3">
              {recentPrescriptions.map(prescription => (
                <div key={prescription.id} className="p-3 bg-[#F4F0FF] rounded-lg border border-[#E8E0FF]">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-[#6D48C5]">{prescription.name}</p>
                    <span className="bg-[#E8F5E8] text-[#4CAF50] text-xs px-2 py-1 rounded-full">
                      {prescription.status}
                    </span>
                  </div>
                  <p className="text-[#8B5FBF] text-sm">{prescription.dosage}</p>
                  <p className="text-[#8B5FBF] text-sm">{prescription.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm">
                Book Appointment
              </button>
              <button className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-[#E8E0FF]">
                Request Refill
              </button>
              <button className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-[#E8E0FF]">
                View Records
              </button>
              <button className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-[#E8E0FF]">
                Contact Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;