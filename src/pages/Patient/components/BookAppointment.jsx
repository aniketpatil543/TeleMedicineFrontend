import React, { useState } from 'react';
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
  FiCheck
} from 'react-icons/fi';

const BookAppointment = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data for doctors
  const doctors = [
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
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      experience: '8 years',
      rating: 4.7,
      reviews: 156,
      fee: '$120',
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      image: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      location: 'Skin Clinic, Floor 1',
      bio: 'Specialized in skin diseases and cosmetic dermatology.'
    },
    {
      id: 4,
      name: 'Dr. Robert Kim',
      specialty: 'Orthopedic',
      experience: '18 years',
      rating: 4.9,
      reviews: 203,
      fee: '$200',
      availability: ['Mon', 'Wed', 'Fri'],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      location: 'Bone & Joint Center, Floor 4',
      bio: 'Expert in orthopedic surgery and sports medicine.'
    }
  ];

  const specialties = ['all', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist'];
  
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = () => {
    // In a real app, you would send this data to your backend
    console.log({
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason: appointmentReason
    });
    setShowConfirmation(true);
  };

  const resetBooking = () => {
    setActiveStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentReason('');
    setShowConfirmation(false);
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

      {/* Doctors Grid */}
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

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-[#F4F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-[#8B5FBF] text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-[#6D48C5] mb-2">No doctors found</h3>
          <p className="text-[#8B5FBF]">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Next Button */}
      {selectedDoctor && (
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
        <p className="text-[#8B5FBF] text-lg">Choose date and time for your consultation</p>
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

      {/* Date Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
        <h3 className="font-semibold text-[#6D48C5] text-lg mb-4 flex items-center">
          <FiCalendar className="mr-2" />
          Select Date
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-[#E8E0FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent"
        />
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0FF]">
          <h3 className="font-semibold text-[#6D48C5] text-lg mb-4 flex items-center">
            <FiClock className="mr-2" />
            Available Time Slots
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedTime === time
                    ? 'border-[#6D48C5] bg-[#F4F0FF] text-[#6D48C5] font-semibold'
                    : 'border-[#E8E0FF] text-[#8B5FBF] hover:border-[#8B5FBF]'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Reason */}
      {selectedTime && (
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
        
        {selectedDate && selectedTime && (
          <button
            onClick={() => setActiveStep(3)}
            className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center space-x-2"
          >
            <span>Review Booking</span>
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#6D48C5] mb-4">Review Your Appointment</h2>
        <p className="text-[#8B5FBF] text-lg">Please confirm your appointment details</p>
      </div>

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
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
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
                <p className="font-semibold text-[#6D48C5]">{selectedTime}</p>
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
          onClick={handleBookAppointment}
          className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center space-x-2"
        >
          <FiCheck />
          <span>Confirm Booking</span>
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
        {new Date(selectedDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} at {selectedTime}
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