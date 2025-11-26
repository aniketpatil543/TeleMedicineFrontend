import React, { useState } from 'react';
import { 
  FiFileText, 
  FiDownload, 
  FiEye, 
  FiPlus,
  FiFilter,
  FiCalendar,
  FiUser,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';
import { 
  TbMicroscope,
  TbReportMedical,
  TbVaccine
} from 'react-icons/tb';

const MedicalRecords = ({ patient }) => {
  const [filter, setFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const medicalRecords = [
    {
      id: 1,
      type: 'Lab Report',
      title: 'Complete Blood Count',
      date: '2024-01-15',
      status: 'Completed',
      doctor: 'Dr. Sarah Johnson',
      fileSize: '2.4 MB',
      icon: <TbMicroscope className="text-xl text-purple-600" />
    },
    {
      id: 2,
      type: 'Diagnostic Report',
      title: 'Chest X-Ray Analysis',
      date: '2024-01-10',
      status: 'Reviewed',
      doctor: 'Dr. Michael Chen',
      fileSize: '1.8 MB',
      icon: <FiActivity className="text-xl text-blue-600" />
    },
    {
      id: 3,
      type: 'Prescription',
      title: 'Hypertension Medication',
      date: '2024-01-05',
      status: 'Active',
      doctor: 'Dr. Sarah Johnson',
      fileSize: '0.8 MB',
      icon: <TbVaccine className="text-xl text-green-600" />
    },
    {
      id: 4,
      type: 'Consultation Note',
      title: 'Follow-up Visit Notes',
      date: '2024-01-03',
      status: 'Completed',
      doctor: 'Dr. Sarah Johnson',
      fileSize: '0.5 MB',
      icon: <FiFileText className="text-xl text-orange-600" />
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Active': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const recordTypes = ['all', 'Lab Report', 'Diagnostic Report', 'Prescription', 'Consultation Note'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TbReportMedical className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">
              {patient ? `Viewing records for ${patient.name}` : 'Patient medical documents and reports'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {recordTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Records' : type}
              </option>
            ))}
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
            <FiPlus className="text-lg" />
            Add Record
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="text-blue-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lab Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TbMicroscope className="text-purple-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TbVaccine className="text-green-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="text-orange-600 text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <h2 className="text-xl font-semibold text-gray-900">Patient Medical Records</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {medicalRecords.map(record => (
            <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {record.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{record.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        <span>{record.doctor}</span>
                      </div>
                      
                      <span>•</span>
                      
                      <span className="text-gray-600">{record.fileSize}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                    <FiEye className="text-lg" />
                  </button>
                  
                  <button className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl flex items-center justify-center transition-colors">
                    <FiDownload className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;