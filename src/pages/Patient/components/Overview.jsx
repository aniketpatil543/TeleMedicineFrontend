import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiClock, FiMapPin } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Overview = ({ userData }) => {
  const userAuthState = useSelector((state) => state.auth);
  const age = userAuthState.user?.age || 'Not specified';
  const bloodGroup = userAuthState.user?.bloodType || 'Not specified';
  const userId = userAuthState.user?.id;

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch upcoming appointments
  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await api.get(`/patients/visits/${userId}/upcoming`);
      
      // Transform API data
      const transformedAppointments = response.data.map(visit => ({
        id: visit.visitId,
        doctor: visit.doctorName || `Dr. ${visit.doctorId}`,
        specialization: 'General Physician',
        date: formatDate(visit.scheduledTime),
        time: formatTime(visit.scheduledTime),
        dateTime: visit.scheduledTime,
        status: mapStatus(visit.status),
        type: getAppointmentType(visit.status),
        location: 'Main Hospital',
        originalData: visit
      }));

      setUpcomingAppointments(transformedAppointments);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      // Fallback to mock data
      setUpcomingAppointments(getMockAppointments());
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const mapStatus = (status) => {
    const statusMap = {
      'SCHEDULED': 'Confirmed',
      'CONFIRMED': 'Confirmed',
      'PENDING': 'Pending',
      'RESCHEDULED': 'Rescheduled',
      'CANCELLED': 'Cancelled',
      'COMPLETED': 'Completed'
    };
    return statusMap[status] || 'Pending';
  };

  const getAppointmentType = (status) => {
    if (status === 'RESCHEDULED') return 'Rescheduled';
    if (status === 'FOLLOW_UP') return 'Follow-up';
    return 'Consultation';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilAppointment = (dateTimeString) => {
    const appointmentDate = new Date(dateTimeString);
    const today = new Date();
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `In ${diffDays} days`;
  };

  // Mock data fallback
  const getMockAppointments = () => [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      date: 'Jan 20, 2024',
      time: '2:00 PM',
      dateTime: '2024-01-20T14:00:00',
      status: 'Confirmed',
      type: 'Regular Checkup',
      location: 'Heart Center, Floor 3'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialization: 'Neurologist',
      date: 'Jan 25, 2024',
      time: '10:30 AM',
      dateTime: '2024-01-25T10:30:00',
      status: 'Confirmed',
      type: 'Consultation',
      location: 'Neuro Center, Floor 2'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments - Takes 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-900 flex items-center space-x-2">
              <FiCalendar className="text-purple-600" />
              <span>Upcoming Appointments</span>
            </h3>
            <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {upcomingAppointments.length} appointments
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors group">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                      <FiUser className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-purple-600 mb-1">{appointment.specialization}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="text-purple-500" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiClock className="text-purple-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMapPin className="text-purple-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-purple-600">
                      {getDaysUntilAppointment(appointment.dateTime)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">No upcoming appointments</h4>
              <p className="text-gray-600 text-sm">Schedule your first appointment to get started</p>
            </div>
          )}
        </div>

        {/* Patient Information - Takes 1/3 width */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-6 flex items-center space-x-2">
            <FiUser className="text-purple-600" />
            <span>Patient Information</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <p className="text-gray-600 text-sm font-medium">Age</p>
                <p className="font-semibold text-purple-700 text-lg">{age} years</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-purple-200">
                <span className="text-purple-600 font-semibold">A</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <p className="text-gray-600 text-sm font-medium">Blood Type</p>
                <p className="font-semibold text-purple-700 text-lg">{bloodGroup}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-purple-200">
                <span className="text-purple-600 font-semibold">B</span>
              </div>
            </div>
            
            
            
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;