import React, { useState } from 'react';
import { 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiClock, 
  FiMoreVertical,
  FiRefreshCw,
  FiX,
  FiPlus
} from 'react-icons/fi';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#E8F5E8] text-[#4CAF50]';
      case 'pending':
        return 'bg-[#FFF8E1] text-[#FFA000]';
      default:
        return 'bg-[#F4F0FF] text-[#8B5FBF]';
    }
  };

  const handleReschedule = (appointmentId) => {
    // Implement reschedule logic here
    console.log('Rescheduling appointment:', appointmentId);
    setActiveMenu(null);
    alert('Reschedule functionality will be implemented here');
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setActiveMenu(null);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
      setShowCancelModal(false);
      setSelectedAppointment(null);
    }
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const toggleMenu = (appointmentId) => {
    setActiveMenu(activeMenu === appointmentId ? null : appointmentId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Appointments</h2>
        <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center space-x-2">
          <FiPlus />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8E0FF]">
        <div className="p-6 border-b border-[#E8E0FF]">
          <h3 className="text-xl font-semibold text-[#6D48C5]">Upcoming Appointments</h3>
        </div>
        
        <div className="divide-y divide-[#F4F0FF]">
          {appointments.map(appointment => (
            <div key={appointment.id} className="p-6 hover:bg-[#F4F0FF] transition-colors relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] rounded-full flex items-center justify-center shadow-sm">
                    <FiUser className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#6D48C5]">{appointment.doctor}</h4>
                    <p className="text-[#8B5FBF] text-sm">{appointment.specialty}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-[#6D48C5]">
                    {formatDate(appointment.date)}
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
                  
                  {/* Three dots menu */}
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(appointment.id)}
                      className="text-[#6D48C5] hover:text-[#8B5FBF] p-2 rounded-lg hover:bg-[#F4F0FF] transition-colors"
                    >
                      <FiMoreVertical />
                    </button>
                    
                    {/* Dropdown menu */}
                    {activeMenu === appointment.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-[#E8E0FF] z-10 min-w-48">
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-[#6D48C5] hover:bg-[#F4F0FF] transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <FiRefreshCw className="text-[#8B5FBF]" />
                          <span>Reschedule</span>
                        </button>
                        <button
                          onClick={() => handleCancel(appointment)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <FiX className="text-red-600" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#E8E0FF]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiX className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#6D48C5] mb-2">Cancel Appointment</h3>
              <p className="text-[#8B5FBF]">Are you sure you want to cancel this appointment?</p>
            </div>
            
            <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-lg p-4 mb-6">
              <p className="font-semibold text-[#6D48C5] text-center">{selectedAppointment.doctor}</p>
              <p className="text-[#8B5FBF] text-sm text-center">{selectedAppointment.specialty}</p>
              <p className="text-[#8B5FBF] text-sm text-center">
                {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-3 px-4 rounded-2xl font-medium transition-colors border border-[#E8E0FF]"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center space-x"
              >
                <FiX />
                <span>Cancel Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default Appointments;