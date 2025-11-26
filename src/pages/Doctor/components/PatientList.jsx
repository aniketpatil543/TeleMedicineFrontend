// components/PatientList.jsx
import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import PatientDetails from './PatientDetails';

const PatientList = ({ patients = [], detailed = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  
  // Default patients data if none provided
  const defaultPatients = [
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      condition: 'Hypertension',
      status: 'Stable',
      lastVisit: '2024-01-15',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
      emergencyContact: 'Jane Smith (555) 123-4568'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      age: 52,
      gender: 'Female',
      condition: 'Cardiac Arrhythmia',
      status: 'Monitoring',
      lastVisit: '2024-01-10',
      phone: '+1 (555) 234-5678',
      email: 'maria.garcia@email.com',
      address: '456 Oak Ave, Los Angeles, CA',
      bloodType: 'A-',
      allergies: ['Latex'],
      medications: ['Metoprolol 25mg', 'Warfarin 5mg'],
      emergencyContact: 'Carlos Garcia (555) 234-5679'
    },
    {
      id: 3,
      name: 'Robert Chen',
      age: 38,
      gender: 'Male',
      condition: 'High Cholesterol',
      status: 'Improving',
      lastVisit: '2024-01-08',
      phone: '+1 (555) 345-6789',
      email: 'robert.chen@email.com',
      address: '789 Pine St, Chicago, IL',
      bloodType: 'B+',
      allergies: ['Aspirin'],
      medications: ['Atorvastatin 40mg', 'Aspirin 81mg'],
      emergencyContact: 'Lisa Chen (555) 345-6790'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      age: 29,
      gender: 'Female',
      condition: 'Asthma',
      status: 'Stable',
      lastVisit: '2024-01-12',
      phone: '+1 (555) 456-7890',
      email: 'sarah.johnson@email.com',
      address: '321 Elm St, Houston, TX',
      bloodType: 'AB+',
      allergies: ['Dust', 'Pollen'],
      medications: ['Albuterol Inhaler', 'Fluticasone Nasal Spray'],
      emergencyContact: 'Mike Johnson (555) 456-7891'
    }
  ];

  // Use provided patients or default data
  const patientData = patients && patients.length > 0 ? patients : defaultPatients;

  // Filter patients based on search term
  const filteredPatients = patientData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleCloseDetails = () => {
    setShowPatientDetails(false);
    setSelectedPatient(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {detailed ? 'Patient Directory' : 'Recent Patients'}
        </h2>
        <span className="text-sm text-gray-500">
          {detailed ? 'Manage your patient records' : 'Recently visited patients'}
        </span>
      </div>

      {/* Search Bar */}
      <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-100">
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-purple-200">
          <FaSearch className="text-purple-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search patients by name, condition, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-200">
              <th className="text-left py-3 text-gray-600 font-medium">PATIENT NAME</th>
              <th className="text-left py-3 text-gray-600 font-medium">AGE/GENDER</th>
              <th className="text-left py-3 text-gray-600 font-medium">CONDITION</th>
              <th className="text-left py-3 text-gray-600 font-medium">STATUS</th>
              <th className="text-left py-3 text-gray-600 font-medium">LAST VISIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr 
                key={patient.id} 
                className="border-b border-purple-100 hover:bg-purple-50/50 transition-colors cursor-pointer"
                onClick={() => handlePatientClick(patient)}
              >
                <td className="py-4">
                  <div className="font-medium text-gray-800">{patient.name}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="py-4 text-gray-600">
                  {patient.age} / {patient.gender}
                </td>
                <td className="py-4 text-gray-600">{patient.condition}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    patient.status === 'Stable' 
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : patient.status === 'Monitoring'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="py-4 text-gray-600">{patient.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No patients found matching your search criteria.
          </div>
        )}
      </div>

      {!detailed && filteredPatients.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-purple-600 hover:text-purple-800 font-medium">
            View All Patients →
          </button>
        </div>
      )}

      {/* Patient Details Dialog */}
      {showPatientDetails && selectedPatient && (
        <PatientDetails 
          patient={selectedPatient}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default PatientList;