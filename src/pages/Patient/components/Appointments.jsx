import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiClock, 
  FiMoreVertical,
  FiRefreshCw,
  FiX,
  FiPlus,
  FiCheck,
  FiLoader,
  FiFileText,
  FiEye
} from 'react-icons/fi';
import BookAppointment from "./BookAppointment";
import { useSelector } from 'react-redux';
import axios from 'axios';

const Appointments = ({ setActiveSection }) => {
  const userAuthState = useSelector((state) => state.auth);
  const userId = userAuthState.user?.id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedVisitDetails, setSelectedVisitDetails] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get auth token
  const getAuthToken = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData?.jwtToken?.split(' ')[1];
  };

  // Axios instance with base configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/patients/visits/${userId}/upcoming`);
      
      // Transform API data to match frontend structure
      const transformedAppointments = response.data.map(visit => ({
        id: visit.visitId,
        doctor: visit.doctorName || `Doctor ${visit.doctorId}`,
        specialty: 'General Physician', // You might need to fetch this separately
        date: visit.scheduledTime.split('T')[0],
        time: formatTime(visit.scheduledTime),
        type: getAppointmentType(visit.status),
        status: mapStatus(visit.status),
        location: 'Main Hospital', // Default location
        originalData: visit
      }));

      setAppointments(transformedAppointments);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      // Fallback to mock data if API fails
      setAppointments(getMockAppointments());
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitDetails = async (visitId) => {
    try {
      const response = await api.get(`/patients/visits/${visitId}/details`);
      setSelectedVisitDetails(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching visit details:', err);
      setError('Failed to load visit details.');
    }
  };

  // Helper functions
  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const mapStatus = (status) => {
    const statusMap = {
      'SCHEDULED': 'confirmed',
      'CONFIRMED': 'confirmed',
      'PENDING': 'pending',
      'RESCHEDULED': 'rescheduled',
      'CANCELLED': 'cancelled',
      'COMPLETED': 'completed'
    };
    return statusMap[status] || 'pending';
  };

  const getAppointmentType = (status) => {
    if (status === 'RESCHEDULED') return 'Rescheduled';
    if (status === 'FOLLOW_UP') return 'Follow-up';
    return 'Consultation';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#E8F5E8] text-[#4CAF50]';
      case 'pending':
        return 'bg-[#FFF8E1] text-[#FFA000]';
      case 'rescheduled':
        return 'bg-[#E3F2FD] text-[#1976D2]';
      case 'completed':
        return 'bg-[#F3E5F5] text-[#7B1FA2]';
      case 'cancelled':
        return 'bg-[#FFEBEE] text-[#D32F2F]';
      default:
        return 'bg-[#F4F0FF] text-[#8B5FBF]';
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    setActiveMenu(null);
    
    // Set default reschedule date to current appointment date
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time.replace(' AM', '').replace(' PM', ''));
    setRescheduleReason('');
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      // Convert to 24-hour format for API
      const time24Hour = convertTo24Hour(rescheduleTime);
      const scheduledDateTime = `${rescheduleDate}T${time24Hour}:00`;

      // Note: You'll need to implement a reschedule API endpoint
      // For now, we'll update locally
      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { 
              ...apt, 
              date: rescheduleDate,
              time: rescheduleTime + (parseInt(rescheduleTime.split(':')[0]) >= 12 ? ' PM' : ' AM'),
              status: 'rescheduled'
            }
          : apt
      );
      
      setAppointments(updatedAppointments);
      setSuccessMessage(`Appointment with ${selectedAppointment.doctor} has been rescheduled to ${formatDate(rescheduleDate)} at ${rescheduleTime + (parseInt(rescheduleTime.split(':')[0]) >= 12 ? ' PM' : ' AM')}`);
      setShowRescheduleModal(false);
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError('Failed to reschedule appointment. Please try again.');
    }
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setActiveMenu(null);
  };

  const confirmCancel = async () => {
    try {
      // Note: You'll need to implement a cancel API endpoint
      // For now, we'll update locally
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setSuccessMessage(`Appointment with ${selectedAppointment.doctor} has been cancelled successfully`);
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const handleViewDetails = (appointment) => {
    fetchVisitDetails(appointment.id);
    setActiveMenu(null);
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setShowRescheduleModal(false);
    setShowSuccessModal(false);
    setShowDetailsModal(false);
    setSelectedAppointment(null);
    setSelectedVisitDetails(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleReason('');
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

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Get tomorrow's date for min date in reschedule
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Mock data fallback
  const getMockAppointments = () => [
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
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Appointments</h2>
        <button
          onClick={() => setActiveSection("book-appointment")}
          className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] 
          text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center space-x-2"
        >
          <FiPlus />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D48C5]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAppointments}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Appointments List */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8E0FF]">
          <div className="p-6 border-b border-[#E8E0FF]">
            <h3 className="text-xl font-semibold text-[#6D48C5]">Upcoming Appointments</h3>
          </div>
          
          {appointments.length > 0 ? (
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
                              onClick={() => handleViewDetails(appointment)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-[#6D48C5] hover:bg-[#F4F0FF] transition-colors first:rounded-t-lg"
                            >
                              <FiEye className="text-[#8B5FBF]" />
                              <span>View Details</span>
                            </button>
                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                              <>
                                <button
                                  onClick={() => handleReschedule(appointment)}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-[#6D48C5] hover:bg-[#F4F0FF] transition-colors"
                                >
                                  <FiRefreshCw className="text-[#8B5FBF]" />
                                  <span>Reschedule</span>
                                </button>
                                <button
                                  onClick={() => handleCancel(appointment)}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg"
                                >
                                  <FiX className="text-red-600" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-[#F4F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-[#8B5FBF] text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#6D48C5] mb-2">No upcoming appointments</h3>
              <p className="text-[#8B5FBF]">Book your first appointment to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#E8E0FF]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#6D48C5]">Reschedule Appointment</h3>
              <button
                onClick={closeModal}
                className="text-[#8B5FBF] hover:text-[#6D48C5] text-xl"
              >
                <FiX />
              </button>
            </div>

            <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-lg p-4 mb-6">
              <p className="font-semibold text-[#6D48C5] text-center">{selectedAppointment.doctor}</p>
              <p className="text-[#8B5FBF] text-sm text-center">{selectedAppointment.specialty}</p>
              <p className="text-[#8B5FBF] text-sm text-center">
                Current: {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#6D48C5] mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-3 border border-[#E8E0FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent"
                    required
                    min={getTomorrowDate()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6D48C5] mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-3 border border-[#E8E0FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6D48C5] mb-2">
                    Reason for Reschedule (Optional)
                  </label>
                  <textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    placeholder="Enter reason for rescheduling..."
                    className="w-full p-3 border border-[#E8E0FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-3 px-4 rounded-2xl font-medium transition-colors border border-[#E8E0FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#8B5FBF] hover:bg-[#7A4FA8] text-white py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FiRefreshCw />
                  <span>Confirm Reschedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <FiX />
                <span>Cancel Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visit Details Modal */}
      {showDetailsModal && selectedVisitDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-[#E8E0FF] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#6D48C5]">Appointment Details</h3>
              <button
                onClick={closeModal}
                className="text-[#8B5FBF] hover:text-[#6D48C5] text-xl"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-lg p-4">
                <h4 className="font-semibold text-[#6D48C5] mb-3">Appointment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8B5FBF]">Doctor</p>
                    <p className="font-medium text-[#6D48C5]">{selectedVisitDetails.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B5FBF]">Scheduled Time</p>
                    <p className="font-medium text-[#6D48C5]">{formatDateTime(selectedVisitDetails.scheduledTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B5FBF]">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mapStatus(selectedVisitDetails.status))}`}>
                      {selectedVisitDetails.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B5FBF]">Visit ID</p>
                    <p className="font-medium text-[#6D48C5]">{selectedVisitDetails.visitId}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              {selectedVisitDetails.consultationId && (
                <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-lg p-4">
                  <h4 className="font-semibold text-[#6D48C5] mb-3 flex items-center">
                    <FiFileText className="mr-2" />
                    Consultation Details
                  </h4>
                  <div className="space-y-3">
                    {selectedVisitDetails.notes && (
                      <div>
                        <p className="text-sm text-[#8B5FBF]">Notes</p>
                        <p className="text-[#6D48C5]">{selectedVisitDetails.notes}</p>
                      </div>
                    )}
                    {selectedVisitDetails.consultationTime && (
                      <div>
                        <p className="text-sm text-[#8B5FBF]">Consultation Time</p>
                        <p className="text-[#6D48C5]">{formatDateTime(selectedVisitDetails.consultationTime)}</p>
                      </div>
                    )}
                    {selectedVisitDetails.followUpDate && (
                      <div>
                        <p className="text-sm text-[#8B5FBF]">Follow-up Date</p>
                        <p className="text-[#6D48C5]">{formatDate(selectedVisitDetails.followUpDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Prescription Info */}
              {selectedVisitDetails.prescriptionId && (
                <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-lg p-4">
                  <h4 className="font-semibold text-[#6D48C5] mb-3">Prescription</h4>
                  <p className="text-[#6D48C5]">Prescription ID: {selectedVisitDetails.prescriptionId}</p>
                  <button className="mt-2 text-[#8B5FBF] hover:text-[#6D48C5] text-sm underline">
                    View Full Prescription
                  </button>
                </div>
              )}

              {!selectedVisitDetails.consultationId && !selectedVisitDetails.prescriptionId && (
                <div className="text-center py-8 text-[#8B5FBF]">
                  <FiFileText className="text-4xl mx-auto mb-3 opacity-50" />
                  <p>No additional details available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#E8E0FF]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#6D48C5] mb-2">Success!</h3>
              <p className="text-[#8B5FBF] mb-6">{successMessage}</p>
              <button
                onClick={closeModal}
                className="w-full bg-[#8B5FBF] hover:bg-[#7A4FA8] text-white py-3 px-4 rounded-2xl font-medium transition-colors"
              >
                OK
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