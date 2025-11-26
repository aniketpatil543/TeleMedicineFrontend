// components/PatientDetails.jsx
import React from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaNotesMedical, FaAllergies, FaPills, FaUserFriends } from 'react-icons/fa';

const PatientDetails = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
              <p className="text-gray-600">Patient ID: {patient.patientId || `P${patient.id.toString().padStart(3, '0')}`}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-purple-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.bloodType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPhone className="mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaPhone className="mr-3 text-blue-500" />
                    <span className="text-gray-700">{patient.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="mr-3 text-blue-500" />
                    <span className="text-gray-700">{patient.email}</span>
                  </div>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-3 text-blue-500 mt-1" />
                    <span className="text-gray-700">{patient.address}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUserFriends className="mr-2 text-red-600" />
                  Emergency Contact
                </h3>
                <p className="text-gray-700">{patient.emergencyContact || 'Not specified'}</p>
              </div>
            </div>

            {/* Right Column - Medical Information */}
            <div className="space-y-6">
              {/* Medical Condition */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-green-600" />
                  Medical Condition
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Condition:</span>
                    <span className="font-medium">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      patient.status === 'Stable' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : patient.status === 'Monitoring'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaAllergies className="mr-2 text-orange-600" />
                  Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No known allergies</span>
                  )}
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPills className="mr-2 text-indigo-600" />
                  Current Medications
                </h3>
                <div className="space-y-2">
                  {patient.medications && patient.medications.length > 0 ? (
                    patient.medications.map((medication, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{medication}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No current medications</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              View Full Medical History
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Appointment
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;