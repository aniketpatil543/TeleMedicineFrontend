import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiStar,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiLoader
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BookAppointment = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState('');
  // Update selectedSlot to include availabilityId
  const [selectedSlot, setSelectedSlot] = useState({
    availabilityId: '',
    date: '',
    time: ''
  });

  const userAuthState = useSelector((state) => state.auth);
  const userId = userAuthState.user?.id;

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

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch availability when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAvailability(selectedDoctor.id);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/patients/appointment/doctors');
     
      // Transform API data to match frontend structure
      const transformedDoctors = response.data.map(doctor => ({
        id: doctor.doctorId,
        name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialty: doctor.specialization || 'General Practitioner',
        department: doctor.department || 'General',
        experience: `${doctor.experience || 0} years`,
        rating: 4.5, // Default rating
        reviews: 0, // Default
        fee: '$120', // Default fee
        availability: ['Mon', 'Wed', 'Fri'], // Default
        image: getDoctorImage(doctor.specialization),
        location: getDepartmentLocation(doctor.department),
        bio: getDoctorBio(doctor.specialization, doctor.experience),
        email: doctor.email,
        phone: doctor.phone,
        originalData: doctor
      }));

      setDoctors(transformedDoctors);

    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
      setDoctors(getMockDoctors()); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAvailability = async (doctorId) => {
    try {
      setLoadingAvailability(true);
     
      const response = await api.get(`/patients/appointment/${doctorId}/availability`);
     
      // Add unique ID to each availability slot if not present
      const availabilityWithIds = response.data.map((slot, index) => ({
        ...slot,
        availabilityId: slot.id || slot.availabilityId || `slot-${index}-${Date.now()}`
      }));
     
      setAvailability(availabilityWithIds);
      // Reset selected slot when availability changes
      setSelectedSlot({ availabilityId: '', date: '', time: '' });
      setSelectedDate('');
      setSelectedTime('');

    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load available time slots.');
      setAvailability([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const bookAppointment = async () => {
    try {
      setLoading(true);
     
      // Use selectedSlot state
      if (!selectedDoctor || !selectedSlot.date || !selectedSlot.time) {
        throw new Error('Please select doctor, date, and time');
      }

      // Find the selected availability slot
      const selectedAvailability = availability.find(
        slot => slot.availabilityId === selectedSlot.availabilityId
      );

      // Convert time to 24-hour format and create proper LocalDateTime
      const time24Hour = convertTo24Hour(selectedSlot.time);
      const scheduledDateTime = `${selectedSlot.date}T${time24Hour}:00`;
     
      console.log('Sending appointment data:', {
        patientId: userId,
        doctorId: selectedDoctor.id,
        scheduledTime: scheduledDateTime,
        reason: appointmentReason || null,
        availabilityId: selectedSlot.availabilityId
      });

      const appointmentData = {
        patientId: userId,
        doctorId: selectedDoctor.id,
        scheduledTime: scheduledDateTime,
        reason: appointmentReason || null
      };

      // Include availabilityId in the request if needed by backend
      if (selectedSlot.availabilityId) {
        appointmentData.availabilityId = selectedSlot.availabilityId;
      }

      const response = await api.post('/patients/visits/book', appointmentData);
     
      console.log('Appointment booked successfully:', response.data);
      setShowConfirmation(true);

    } catch (err) {
      console.error('Error booking appointment:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert hours to integer
    hours = parseInt(hours, 10);

    // Convert "12 AM" → 00
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // Convert PM except 12 PM
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    // Convert back to string before padStart()
    const hoursStr = hours.toString().padStart(2, "0");

    return `${hoursStr}:${minutes}`;
  };

  // Helper functions for doctor data transformation
  const getDoctorImage = (specialization) => {
    const imageMap = {
      'CARDIOLOGY': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      'NEUROLOGY': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      'DERMATOLOGY': 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      'ORTHOPEDICS': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      'PEDIATRICS': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      'PSYCHIATRY': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
    };
    return imageMap[specialization] || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80';
  };

  const getDepartmentLocation = (department) => {
    const locationMap = {
      'CARDIOLOGY': 'Heart Center, Floor 3',
      'NEUROLOGY': 'Neuro Center, Floor 2',
      'DERMATOLOGY': 'Skin Clinic, Floor 1',
      'ORTHOPEDICS': 'Bone & Joint Center, Floor 4',
      'PEDIATRICS': 'Children\'s Wing, Floor 1',
      'PSYCHIATRY': 'Mental Health Center, Floor 2'
    };
    return locationMap[department] || 'Main Building, Floor 1';
  };

  const getDoctorBio = (specialization, experience) => {
    const bioMap = {
      'CARDIOLOGY': `Specialized in cardiac care and preventive cardiology with ${experience} years of experience.`,
      'NEUROLOGY': `Expert in neurological disorders and treatment with ${experience} years of experience.`,
      'DERMATOLOGY': `Specialized in skin diseases and cosmetic dermatology with ${experience} years of experience.`,
      'ORTHOPEDICS': `Expert in orthopedic surgery and sports medicine with ${experience} years of experience.`,
      'PEDIATRICS': `Specialized in child healthcare and development with ${experience} years of experience.`,
      'PSYCHIATRY': `Expert in mental health and psychological disorders with ${experience} years of experience.`
    };
    return bioMap[specialization] || `Medical professional with ${experience} years of experience.`;
  };

  // Generate time slots from a single availability slot
  const generateTimeSlotsFromAvailability = (availabilitySlot) => {
    const slots = [];
    const start = new Date(`2000-01-01T${availabilitySlot.startTime}`);
    const end = new Date(`2000-01-01T${availabilitySlot.endTime}`);
   
    // Generate 30-minute slots
    let current = new Date(start);
    while (current < end) {
      const timeString = current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  // Mock data fallback
  const getMockDoctors = () => [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      experience: '12 years',
      rating: 4.8,
      reviews: 124,
      fee: '$150',
      availability: ['Mon', 'Wed', 'Fri'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      location: 'Heart Center, Floor 3',
      bio: 'Specialized in cardiac care and preventive cardiology.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 98,
      fee: '$180',
      availability: ['Tue', 'Thu', 'Sat'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      location: 'Neuro Center, Floor 2',
      bio: 'Expert in neurological disorders and treatment.'
    }
  ];

  // Get unique specialties from doctors
  const specialties = ['all', ...new Set(doctors.map(doctor => doctor.specialty))];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const resetBooking = () => {
    setActiveStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSlot({ availabilityId: '', date: '', time: '' });
    setAppointmentReason('');
    setShowConfirmation(false);
    setError('');
    setAvailability([]);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#6D48C5] mb-4">Find Your Doctor</h2>
        <p className="text-[#8B5FBF] text-lg">Choose from our expert medical professionals</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B5FBF]" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E8E0FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent"
            />
          </div>
         
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {specialties.map(specialty => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-[#6D48C5] text-white'
                    : 'bg-[#F4F0FF] text-[#6D48C5] hover:bg-[#E8E0FF]'
                }`}
              >
                {specialty === 'all' ? 'All Specialties' : specialty}
              </button>
            ))}
          </div>
        </div>
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
            onClick={fetchDoctors}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedDoctor?.id === doctor.id
                  ? 'border-[#6D48C5] bg-[#F4F0FF]'
                  : 'border-[#E8E0FF] hover:border-[#8B5FBF]'
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[#6D48C5] text-lg">{doctor.name}</h3>
                      <p className="text-[#8B5FBF]">{doctor.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#6D48C5] text-lg">{doctor.fee}</p>
                      <p className="text-sm text-[#8B5FBF]">Consultation</p>
                    </div>
                  </div>
                 
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="font-medium text-[#6D48C5]">{doctor.rating}</span>
                      <span className="text-[#8B5FBF] text-sm">({doctor.reviews} reviews)</span>
                    </div>
                    <span className="text-[#8B5FBF]">•</span>
                    <span className="text-[#8B5FBF] text-sm">{doctor.experience}</span>
                  </div>
                 
                  <div className="flex items-center space-x-2 mt-2 text-sm text-[#8B5FBF]">
                    <FiMapPin />
                    <span>{doctor.location}</span>
                  </div>
                 
                  <p className="text-[#8B5FBF] text-sm mt-2 line-clamp-2">{doctor.bio}</p>
                 
                  <div className="flex flex-wrap gap-1 mt-3">
                    {doctor.availability.map(day => (
                      <span
                        key={day}
                        className="px-2 py-1 bg-[#E8F5E8] text-[#4CAF50] text-xs rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-[#F4F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-[#8B5FBF] text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-[#6D48C5] mb-2">No doctors found</h3>
          <p className="text-[#8B5FBF]">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Next Button */}
      {selectedDoctor && !loading && !error && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setActiveStep(2)}
            className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center space-x-2"
          >
            <span>Continue to Schedule</span>
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#6D48C5] mb-4">Schedule Your Appointment</h2>
        <p className="text-[#8B5FBF] text-lg">Choose available time slot for your consultation</p>
      </div>

      {/* Selected Doctor Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
        <div className="flex items-center space-x-4">
          <img
            src={selectedDoctor.image}
            alt={selectedDoctor.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-[#6D48C5] text-lg">{selectedDoctor.name}</h3>
            <p className="text-[#8B5FBF]">{selectedDoctor.specialty}</p>
            <div className="flex items-center space-x-2 mt-1">
              <FiStar className="text-yellow-400 fill-current" />
              <span className="font-medium text-[#6D48C5]">{selectedDoctor.rating}</span>
              <span className="text-[#8B5FBF] text-sm">• {selectedDoctor.fee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
        <h3 className="font-semibold text-[#6D48C5] text-lg mb-4 flex items-center">
          <FiCalendar className="mr-2" />
          Available Time Slots
          {loadingAvailability && (
            <FiLoader className="ml-2 animate-spin text-[#8B5FBF]" />
          )}
        </h3>
       
        {loadingAvailability ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D48C5]"></div>
          </div>
        ) : availability.length > 0 ? (
          <div className="space-y-4">
            {availability.map((availSlot, index) => {
              const dateStr = availSlot.availableDate;
              const timeSlots = generateTimeSlotsFromAvailability(availSlot);
              const availabilityId = availSlot.availabilityId;
             
              return (
                <div key={availabilityId} className="border border-[#E8E0FF] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-[#6D48C5]">
                      {new Date(dateStr).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <span className="text-sm text-[#8B5FBF] bg-[#F4F0FF] px-3 py-1 rounded-full">
                      {availSlot.startTime} - {availSlot.endTime}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {timeSlots.map(time => {
                      const slotKey = `${availabilityId}-${dateStr}-${time}`;
                      const isSelected = selectedSlot.availabilityId === availabilityId &&
                                        selectedSlot.date === dateStr &&
                                        selectedSlot.time === time;
                     
                      return (
                        <button
                          key={slotKey}
                          onClick={() => {
                            // Set the complete slot information including availabilityId
                            setSelectedSlot({
                              availabilityId,
                              date: dateStr,
                              time
                            });
                            // Also update the old separate states for compatibility
                            setSelectedDate(dateStr);
                            setSelectedTime(time);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            isSelected
                              ? 'border-[#6D48C5] bg-[#F4F0FF] text-[#6D48C5] font-semibold'
                              : 'border-[#E8E0FF] text-[#8B5FBF] hover:border-[#8B5FBF]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#8B5FBF]">
            No available time slots for this doctor
          </div>
        )}
      </div>

      {/* Appointment Reason */}
      {selectedSlot.time && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
          <h3 className="font-semibold text-[#6D48C5] text-lg mb-4">Reason for Visit</h3>
          <textarea
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
            placeholder="Please describe your symptoms or reason for consultation..."
            rows="4"
            className="w-full p-3 border border-[#E8E0FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent resize-none"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setActiveStep(1)}
          className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
        >
          <FiChevronLeft />
          <span>Back</span>
        </button>
       
        {/* {selectedSlot.date && selectedSlot.time && ( */}
          <button
            onClick={() => setActiveStep(3)}
            className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center space-x-2"
          >
            <span>Review Booking</span>
            <FiChevronRight />
          </button>
        {/* )} */}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#6D48C5] mb-4">Review Your Appointment</h2>
        <p className="text-[#8B5FBF] text-lg">Please confirm your appointment details</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Appointment Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF] space-y-6">
        {/* Doctor Info */}
        <div className="flex items-center space-x-4 pb-4 border-b border-[#E8E0FF]">
          <img
            src={selectedDoctor.image}
            alt={selectedDoctor.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-[#6D48C5] text-xl">{selectedDoctor.name}</h3>
            <p className="text-[#8B5FBF] text-lg">{selectedDoctor.specialty}</p>
            <div className="flex items-center space-x-2 mt-1">
              <FiStar className="text-yellow-400 fill-current" />
              <span className="font-medium text-[#6D48C5]">{selectedDoctor.rating}</span>
              <span className="text-[#8B5FBF]">• {selectedDoctor.fee}</span>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-[#8B5FBF]" />
              <div>
                <p className="text-[#8B5FBF] text-sm">Date</p>
                <p className="font-semibold text-[#6D48C5]">
                  {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
           
            <div className="flex items-center space-x-3">
              <FiClock className="text-[#8B5FBF]" />
              <div>
                <p className="text-[#8B5FBF] text-sm">Time</p>
                <p className="font-semibold text-[#6D48C5]">{selectedSlot.time}</p>
              </div>
            </div>
          </div>
         
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiMapPin className="text-[#8B5FBF]" />
              <div>
                <p className="text-[#8B5FBF] text-sm">Location</p>
                <p className="font-semibold text-[#6D48C5]">{selectedDoctor.location}</p>
              </div>
            </div>
           
            <div className="flex items-center space-x-3">
              <FiUser className="text-[#8B5FBF]" />
              <div>
                <p className="text-[#8B5FBF] text-sm">Consultation Fee</p>
                <p className="font-semibold text-[#6D48C5]">{selectedDoctor.fee}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reason for Visit */}
        {appointmentReason && (
          <div className="pt-4 border-t border-[#E8E0FF]">
            <p className="text-[#8B5FBF] text-sm mb-2">Reason for Visit</p>
            <p className="text-[#6D48C5]">{appointmentReason}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setActiveStep(2)}
          className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
        >
          <FiChevronLeft />
          <span>Back</span>
        </button>
       
        <button
          onClick={bookAppointment}
          disabled={loading}
          className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <FiCheck />
          )}
          <span>{loading ? 'Booking...' : 'Confirm Booking'}</span>
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheck className="text-green-600 text-3xl" />
      </div>
     
      <h2 className="text-3xl font-bold text-[#6D48C5] mb-4">Appointment Booked!</h2>
      <p className="text-[#8B5FBF] text-lg mb-2">
        Your appointment with <span className="font-semibold text-[#6D48C5]">{selectedDoctor.name}</span> has been confirmed.
      </p>
      <p className="text-[#8B5FBF] mb-6">
        {new Date(selectedSlot.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} at {selectedSlot.time}
      </p>
     
      <div className="bg-[#F4F0FF] border border-[#E8E0FF] rounded-2xl p-6 max-w-md mx-auto mb-8">
        <p className="text-[#8B5FBF] text-sm mb-2">Appointment ID</p>
        <p className="font-mono font-bold text-[#6D48C5] text-lg">APT-{Date.now().toString().slice(-6)}</p>
      </div>
     
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={resetBooking}
          className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm"
        >
          Book Another Appointment
        </button>
        <button
          onClick={() => window.print()}
          className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] px-8 py-3 rounded-xl font-semibold transition-all duration-200 border border-[#E8E0FF]"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F4FF] to-[#E8E3FF] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        {!showConfirmation && (
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0FF]">
              <div className="flex items-center space-x-8">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      activeStep >= step
                        ? 'bg-[#6D48C5] text-white'
                        : 'bg-[#F4F0FF] text-[#8B5FBF]'
                    }`}>
                      {step}
                    </div>
                    <span className={`font-medium ${
                      activeStep >= step ? 'text-[#6D48C5]' : 'text-[#8B5FBF]'
                    }`}>
                      {step === 1 && 'Select Doctor'}
                      {step === 2 && 'Schedule'}
                      {step === 3 && 'Confirm'}
                    </span>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 ${
                        activeStep > step ? 'bg-[#6D48C5]' : 'bg-[#E8E0FF]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#E8E0FF] p-8">
          {showConfirmation ? renderConfirmation() : (
            <>
              {activeStep === 1 && renderStep1()}
              {activeStep === 2 && renderStep2()}
              {activeStep === 3 && renderStep3()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;