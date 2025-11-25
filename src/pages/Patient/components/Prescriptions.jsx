// components/Prescriptions.jsx
import React from 'react';

const Prescriptions = () => {
  const prescriptions = [
    { 
      id: 1, 
      name: 'Amoxicillin', 
      dosage: '500mg', 
      frequency: '3 times daily',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      doctor: 'Dr. Sarah Smith',
      status: 'Active',
      refills: 2
    },
    { 
      id: 2, 
      name: 'Vitamin D', 
      dosage: '1000 IU', 
      frequency: 'Once daily',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      doctor: 'Dr. Sarah Smith',
      status: 'Active',
      refills: 5
    },
    { 
      id: 3, 
      name: 'Lisinopril', 
      dosage: '10mg', 
      frequency: 'Once daily',
      startDate: '2024-01-05',
      endDate: '2024-07-05',
      doctor: 'Dr. Michael Brown',
      status: 'Active',
      refills: 3
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-[#E8F5E8] text-[#4CAF50]' 
      : 'bg-[#FFEBEE] text-[#F44336]';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Prescriptions</h2>
        <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm">
          Request Refill
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8E0FF]">
        <div className="p-6 border-b border-[#E8E0FF]">
          <h3 className="text-xl font-semibold text-[#6D48C5]">Current Medications</h3>
        </div>
        
        <div className="divide-y divide-[#F4F0FF]">
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="p-6 hover:bg-[#F4F0FF] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-[#6D48C5]">{prescription.name}</h4>
                  <p className="text-[#8B5FBF]">{prescription.dosage} • {prescription.frequency}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                  {prescription.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-[#8B5FBF]">Start Date</p>
                  <p className="font-medium text-[#6D48C5]">{prescription.startDate}</p>
                </div>
                <div>
                  <p className="text-[#8B5FBF]">End Date</p>
                  <p className="font-medium text-[#6D48C5]">{prescription.endDate}</p>
                </div>
                <div>
                  <p className="text-[#8B5FBF]">Prescribed By</p>
                  <p className="font-medium text-[#6D48C5]">{prescription.doctor}</p>
                </div>
                <div>
                  <p className="text-[#8B5FBF]">Refills Left</p>
                  <p className="font-medium text-[#6D48C5]">{prescription.refills}</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm">
                  Request Refill
                </button>
                <button className="bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#E8E0FF]">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;