import React, { useState } from 'react';
import { 
  FiFileText, 
  FiSave, 
  FiPlus, 
  FiTrash2,
  FiUser,
  FiCalendar,
  FiSearch,
  FiPrinter
} from 'react-icons/fi';
import { 
  TbPill,
  TbMedicineSyrup,
  TbPrescription
} from 'react-icons/tb';

const PrescriptionWriter = ({ patient }) => {
  const [medications, setMedications] = useState([
    { id: 1, name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [notes, setNotes] = useState('');

  const medicationOptions = [
    'Lisinopril', 'Metoprolol', 'Atorvastatin', 'Metformin', 'Aspirin',
    'Amoxicillin', 'Ibuprofen', 'Omeprazole', 'Levothyroxine', 'Albuterol'
  ];

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: medications.length + 1, name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSave = () => {
    // Save prescription logic
    console.log('Saving prescription:', { medications, notes, patient });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TbPrescription className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Write Prescription</h1>
            <p className="text-gray-600">
              {patient ? `Prescribing for ${patient.name}` : 'Create new medication prescription'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors">
            <FiPrinter className="text-lg" />
            Print
          </button>
          
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiSave className="text-lg" />
            Save Prescription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Patient Information
            </h3>
            
            {patient ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium text-gray-900">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FiUser className="text-gray-300 text-3xl mx-auto mb-2" />
                <p className="text-gray-500">Select a patient to prescribe medication</p>
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-medium transition-colors">
                Hypertension Management
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-xl text-green-700 font-medium transition-colors">
                Diabetes Care
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700 font-medium transition-colors">
                Common Cold
              </button>
            </div>
          </div>
        </div>

        {/* Prescription Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TbPill className="text-green-600" />
              Medication Prescription
            </h3>

            {/* Medications List */}
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Medication #{medication.id}</h4>
                    {medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(medication.id)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medication Name
                      </label>
                      <select
                        value={medication.name}
                        onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select medication</option>
                        {medicationOptions.map(med => (
                          <option key={med} value={med}>{med}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                        placeholder="e.g., 10mg"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={medication.frequency}
                        onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select frequency</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                        placeholder="e.g., 30 days"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                        placeholder="Additional instructions for the patient..."
                        rows="2"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Medication Button */}
            <button
              onClick={addMedication}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-xl w-full mt-4 transition-colors"
            >
              <FiPlus className="text-lg" />
              Add Another Medication
            </button>

            {/* Additional Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes & Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional instructions, follow-up requirements, or special notes..."
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionWriter;