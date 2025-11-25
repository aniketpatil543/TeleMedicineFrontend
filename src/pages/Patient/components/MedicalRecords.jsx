// components/MedicalRecords.jsx
import React from 'react';

const MedicalRecords = () => {
  const records = [
    { id: 1, name: 'Blood Test Results', date: '2024-01-15', type: 'Lab Report', doctor: 'Dr. Smith' },
    { id: 2, name: 'X-Ray Chest', date: '2024-01-10', type: 'Radiology', doctor: 'Dr. Johnson' },
    { id: 3, name: 'Annual Physical Exam', date: '2024-01-05', type: 'Checkup', doctor: 'Dr. Smith' },
    { id: 4, name: 'MRI Scan Report', date: '2023-12-20', type: 'Radiology', doctor: 'Dr. Brown' },
    { id: 5, name: 'Vaccination Record', date: '2023-12-15', type: 'Immunization', doctor: 'Dr. Wilson' },
    { id: 6, name: 'Cardiology Consultation', date: '2023-12-10', type: 'Specialist', doctor: 'Dr. Davis' }
  ];

  const getTypeColor = (type) => {
    const colors = {
      'Lab Report': 'bg-[#E8F5E8] text-[#4CAF50]',
      'Radiology': 'bg-[#E3F2FD] text-[#2196F3]',
      'Checkup': 'bg-[#F4F0FF] text-[#6D48C5]',
      'Immunization': 'bg-[#FFF8E1] text-[#FFA000]',
      'Specialist': 'bg-[#FFEBEE] text-[#F44336]'
    };
    return colors[type] || 'bg-[#F4F0FF] text-[#8B5FBF]';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6D48C5]">Medical Records</h2>
        <button className="bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm">
          Download All Records
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map(record => (
          <div key={record.id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8E0FF] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📄</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(record.type)}`}>
                {record.type}
              </span>
            </div>
            <h3 className="font-semibold text-[#6D48C5] mb-2">{record.name}</h3>
            <p className="text-[#8B5FBF] text-sm mb-1">Date: {record.date}</p>
            <p className="text-[#8B5FBF] text-sm mb-4">Doctor: {record.doctor}</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-gradient-to-r from-[#8B5FBF] to-[#6D48C5] hover:from-[#7A4FA8] hover:to-[#5D3AA8] text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm">
                View
              </button>
              <button className="flex-1 bg-[#F4F0FF] hover:bg-[#E8E0FF] text-[#6D48C5] py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-[#E8E0FF]">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords;