import React, { useState } from 'react';
import { FaClock, FaVideo, FaUserInjured, FaEllipsisV, FaEye, FaPhone, FaCalendarAlt, FaTimes, FaCheck } from 'react-icons/fa';

const TodayAppointments = ({ appointments = [], detailed = false }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [appointmentData, setAppointmentData] = useState(appointments && appointments.length > 0 ? appointments : [
    {
      id: 1,
      patientName: 'John Smith',
      time: '09:30 AM',
      duration: '30 mins',
      type: 'Follow-up',
      reason: 'Hypertension Check',
      status: 'confirmed',
      appointmentType: 'in-person',
      patientId: 'P001',
      age: 45,
      gender: 'Male',
      contact: '+1 (555) 123-4567',
      medicalHistory: ['Hypertension', 'High Cholesterol'],
      notes: 'Regular follow-up for medication adjustment'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      time: '10:15 AM',
      duration: '45 mins',
      type: 'New Patient',
      reason: 'Cardiac Consultation',
      status: 'confirmed',
      appointmentType: 'video',
      patientId: 'P002',
      age: 52,
      gender: 'Female',
      contact: '+1 (555) 234-5678',
      medicalHistory: ['Cardiac Arrhythmia'],
      notes: 'Initial consultation for cardiac symptoms'
    },
    {
      id: 3,
      patientName: 'Robert Chen',
      time: '11:00 AM',
      duration: '30 mins',
      type: 'Follow-up',
      reason: 'Medication Review',
      status: 'pending',
      appointmentType: 'in-person',
      patientId: 'P003',
      age: 38,
      gender: 'Male',
      contact: '+1 (555) 345-6789',
      medicalHistory: ['High Cholesterol', 'Diabetes'],
      notes: 'Reviewing statin medication effectiveness'
    }
  ]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    setShowOptionsMenu(null);
  };

  const handleJoinCall = (appointment) => {
    // Implement video call functionality
    console.log('Joining video call with:', appointment.patientName);
    alert(`Connecting to video call with ${appointment.patientName}`);
    setShowOptionsMenu(null);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    setShowOptionsMenu(null);
    // Set default reschedule date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(tomorrow.toISOString().split('T')[0]);
    setRescheduleTime('09:00');
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setShowOptionsMenu(null);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      console.log('Canceling appointment with:', selectedAppointment.patientName);
      setSuccessMessage(`Appointment with ${selectedAppointment.patientName} has been canceled`);
      
      // Remove the appointment from the list
      setAppointmentData(prevData => 
        prevData.filter(appointment => appointment.id !== selectedAppointment.id)
      );
      
      setShowCancelModal(false);
      setShowSuccessModal(true);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (selectedAppointment) {
      console.log('Rescheduling appointment:', {
        patient: selectedAppointment.patientName,
        newDate: rescheduleDate,
        newTime: rescheduleTime
      });
      setSuccessMessage(`Appointment with ${selectedAppointment.patientName} rescheduled to ${rescheduleDate} at ${rescheduleTime}`);
      setShowRescheduleModal(false);
      setShowSuccessModal(true);
    }
  };

  const toggleOptionsMenu = (appointmentId) => {
    setShowOptionsMenu(showOptionsMenu === appointmentId ? null : appointmentId);
  };

  const closeAllModals = () => {
    setShowDetailsModal(false);
    setShowRescheduleModal(false);
    setShowCancelModal(false);
    setShowSuccessModal(false);
    setSelectedAppointment(null);
    setShowOptionsMenu(null);
  };

  const AppointmentDetailsModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Appointment Details</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient Name</label>
                  <p className="text-lg font-semibold">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient ID</label>
                  <p className="text-lg">{selectedAppointment.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-lg">{selectedAppointment.time} ({selectedAppointment.duration})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-lg">{selectedAppointment.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Age/Gender</label>
                  <p className="text-lg">{selectedAppointment.age} / {selectedAppointment.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact</label>
                  <p className="text-lg">{selectedAppointment.contact}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Reason for Visit</label>
                <p className="text-lg">{selectedAppointment.reason}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Medical History</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAppointment.medicalHistory.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-lg text-gray-700">{selectedAppointment.notes}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleJoinCall(selectedAppointment)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <FaPhone className="mr-2" />
                  {selectedAppointment.appointmentType === 'video' ? 'Join Call' : 'Start Consultation'}
                </button>
                <button
                  onClick={() => handleReschedule(selectedAppointment)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RescheduleModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Reschedule Appointment</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                Reschedule appointment with <span className="font-semibold">{selectedAppointment.patientName}</span>
              </p>
              <p className="text-sm text-gray-500">
                Current: {selectedAppointment.time} - {selectedAppointment.date}
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Reschedule (Optional)
                  </label>
                  <textarea
                    placeholder="Enter reason for rescheduling..."
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const CancelModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Cancel Appointment</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-center">
                Are you sure you want to cancel the appointment with <span className="font-semibold">{selectedAppointment.patientName}</span>?
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeAllModals}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                No, Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            
            <button
              onClick={closeAllModals}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
     <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {detailed ? 'All Appointments' : "Today's Appointments"}
        </h2>
        <span className="text-sm text-gray-500">
          {detailed ? 'Manage all appointments' : 'Manage your daily schedule'}
        </span>
      </div>
    </div>
    
    <div className="space-y-4">
      {appointmentData.map(appointment => (
        <div key={appointment.id} className="flex items-center p-4 border border-purple-100 rounded-lg hover:shadow-md transition-shadow bg-purple-50/50">
          <div className="w-20 h-20 bg-purple-100 rounded-lg flex flex-col items-center justify-center mr-4 border border-purple-200">
            <span className="font-semibold text-gray-800">{appointment.time}</span>
            <span className="text-xs text-gray-500 flex items-center">
              <FaClock className="mr-1" />
              {appointment.duration}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">{appointment.patientName}</h4>
            </div>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : appointment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {appointment.status}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{appointment.type}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{appointment.patientId}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* View Details Button */}
            <button 
              onClick={() => handleViewDetails(appointment)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors border border-purple-700 text-sm flex items-center justify-center"
            >
              <FaEye className="mr-1" />
              Details
            </button>

            {/* Join Call Button - Now for ALL appointments */}
            <button 
              onClick={() => handleJoinCall(appointment)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors border border-green-700 text-sm flex items-center justify-center"
            >
              <FaVideo className="mr-1" />
              Join Call
            </button>

            {/* Three Dots Menu */}
            <div className="relative">
              <button 
                onClick={() => toggleOptionsMenu(appointment.id)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <FaEllipsisV />
              </button>

              {/* Dropdown Menu */}
              {showOptionsMenu === appointment.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-purple-100 z-10">
                  <button
                    onClick={() => handleReschedule(appointment)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 flex items-center transition-colors"
                  >
                    <FaCalendarAlt className="mr-3 text-blue-500" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(appointment)}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <FaTimes className="mr-3" />
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

      {!detailed && appointmentData.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-purple-600 hover:text-purple-800 font-medium">
            View All Appointments →
          </button>
        </div>
      )}

      {appointmentData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaUserInjured className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>No appointments scheduled for today</p>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && <AppointmentDetailsModal />}

      {/* Reschedule Modal */}
      {showRescheduleModal && <RescheduleModal />}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && <CancelModal />}

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}

      {/* Overlay to close dropdown when clicking outside */}
      {showOptionsMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowOptionsMenu(null)}
        />
      )}
    </div>
  );
};

export default TodayAppointments;