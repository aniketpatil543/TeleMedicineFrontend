import React, { useState } from 'react';

const Appointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Smith',
      specialty: 'General Physician',
      date: '2024-01-20',
      time: '2:00 PM',
      type: 'Regular Checkup',
      status: 'confirmed',
      location: 'Main Hospital, Room 304'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Brown',
      specialty: 'Cardiologist',
      date: '2024-01-25',
      time: '10:30 AM',
      type: 'Consultation',
      status: 'confirmed',
      location: 'Heart Center, Room 102'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Johnson',
      specialty: 'Dermatologist',
      date: '2024-02-01',
      time: '3:15 PM',
      type: 'Follow-up',
      status: 'pending',
      location: 'Skin Clinic, Room 205'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#E8F5E8] text-[#4CAF50]';
      case 'pending':
        return 'bg-[#FFF8E1] text-[#FFA000]';
      case 'cancelled':
        return 'bg-[#FFEBEE] text-[#F44336]';
      default:
        return 'bg-[#F4F0FF] text-[#8B5FBF]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Appointments</h2>
        <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm">
          Book New Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8E0FF]">
        <div className="p-6 border-b border-[#E8E0FF]">
          <h3 className="text-xl font-semibold text-[#6D48C5]">Upcoming Appointments</h3>
        </div>
        
        <div className="divide-y divide-[#F4F0FF]">
          {appointments.map(appointment => (
            <div key={appointment.id} className="p-6 hover:bg-[#F4F0FF] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {appointment.doctor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#6D48C5]">{appointment.doctor}</h4>
                    <p className="text-[#8B5FBF] text-sm">{appointment.specialty}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-[#6D48C5]">
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-[#8B5FBF] text-sm">{appointment.time}</p>
                </div>
                
                <div>
                  <p className="text-[#6D48C5] font-medium">{appointment.type}</p>
                  <p className="text-[#8B5FBF] text-sm">{appointment.location}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  <button className="text-[#6D48C5] hover:text-[#8B5FBF] font-medium">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;