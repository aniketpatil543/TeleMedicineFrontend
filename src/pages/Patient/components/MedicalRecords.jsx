import React, { useState } from 'react';
import { 
  FaCloudUploadAlt, 
  FaFileMedical, 
  FaDownload, 
  FaEye, 
  FaTrash,
  FaFilePdf,
  FaFileImage,
  FaFilePrescription,
  FaCalendarAlt,
  FaFile,
  FaFileWord,
  FaTimes
} from 'react-icons/fa';

const MedicalRecords = () => {
  // Mock data for demonstration
  const [documents, setDocuments] = useState([
    {
      id: 1,
      filename: 'Blood_Test_Report.pdf',
      documentType: 'Lab Report',
      description: 'Complete blood count and lipid profile results from recent health checkup',
      uploadDate: '2024-01-15',
      recordDate: '2024-01-10',
      size: '2.4 MB'
    },
    {
      id: 2,
      filename: 'XRay_Chest_Scan.jpg',
      documentType: 'X-Ray',
      description: 'Chest X-Ray for routine annual checkup and lung assessment',
      uploadDate: '2024-01-10',
      recordDate: '2024-01-08',
      size: '1.8 MB'
    },
    {
      id: 3,
      filename: 'Doctor_Prescription_March.pdf',
      documentType: 'Prescription',
      description: 'Medication for blood pressure management and follow-up instructions',
      uploadDate: '2024-01-05',
      recordDate: '2024-01-05',
      size: '0.8 MB'
    }
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    file: null,
    documentType: '',
    description: '',
    recordDate: new Date().toISOString().split('T')[0]
  });

  const documentTypes = [
    'Lab Report',
    'Prescription',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Blood Test',
    'Doctor Note',
    'Insurance Document',
    'Vaccination Record',
    'Other'
  ];

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'text/plain'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, JPEG, PNG, or DOC files.');
        return;
      }

      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 10MB.');
        return;
      }

      setUploadForm(prev => ({ ...prev, file }));
      setError('');
    }
  };

  // Handle document upload
  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.documentType) {
      setError('Please select a file and document type');
      return;
    }

    const newDocument = {
      id: documents.length + 1,
      filename: uploadForm.file.name,
      documentType: uploadForm.documentType,
      description: uploadForm.description,
      uploadDate: new Date().toISOString().split('T')[0],
      recordDate: uploadForm.recordDate,
      size: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    setDocuments(prev => [newDocument, ...prev]);
    setSuccess('Document uploaded successfully!');
    setUploadDialogOpen(false);
    setUploadForm({
      file: null,
      documentType: '',
      description: '',
      recordDate: new Date().toISOString().split('T')[0]
    });
  };

  // Handle document download
  const handleDownload = (documentId, filename) => {
    setSuccess(`Downloading ${filename}...`);
    setTimeout(() => {
      setSuccess(`${filename} downloaded successfully!`);
    }, 1000);
  };

  // Handle document preview
  const handlePreview = (document) => {
    setSelectedDocument(document);
    setPreviewDialogOpen(true);
  };

  // Handle document deletion
  const handleDelete = (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSuccess('Document deleted successfully');
  };

  // Get document icon based on type and file extension
  const getDocumentIcon = (document) => {
    const filename = document.filename.toLowerCase();
    const type = document.documentType.toLowerCase();

    if (filename.endsWith('.pdf')) return <FaFilePdf className="text-lg" />;
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png')) 
      return <FaFileImage className="text-lg" />;
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) 
      return <FaFileWord className="text-lg" />;

    if (type.includes('report') || type.includes('lab')) 
      return <FaFileMedical className="text-lg" />;
    if (type.includes('prescription')) 
      return <FaFilePrescription className="text-lg" />;
    
    return <FaFile className="text-lg" />;
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-600">Manage your health documents and reports</p>
        </div>
        <button
          onClick={() => setUploadDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
        >
          <FaCloudUploadAlt className="text-lg" />
          Upload Document
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-lg">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 text-lg">
            ×
          </button>
        </div>
      )}

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-12 text-center">
          <FaFileMedical className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Medical Documents</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Upload your medical reports, test results, and health documents to keep them organized and accessible.
          </p>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg mx-auto"
          >
            <FaCloudUploadAlt className="text-lg" />
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 overflow-hidden group hover:border-gray-300"
            >
              {/* Card Header */}
              <div className="bg-zinc-300 border-b border-blue-00 p-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                    {getDocumentIcon(doc)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    {doc.documentType}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* File Name */}
                <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {doc.filename}
                </h3>

                {/* Description */}
                {doc.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <span className="font-medium">{doc.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePreview(doc)}
                    className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    <FaEye />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(doc.id, doc.filename)}
                    className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    <FaDownload />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 w-10 h-10 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog - Increased Width with Close Button */}
      {uploadDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header with Close Button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upload Medical Document</h2>
              <button
                onClick={() => setUploadDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* File Input */}
              <input
                type="file"
                id="document-upload"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                className="hidden"
              />
              <label htmlFor="document-upload" className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-all duration-200 bg-gray-50/50">
                  <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    {uploadForm.file ? uploadForm.file.name : 'Click to select file'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">PDF, JPEG, PNG, DOC (Max 10MB)</p>
                </div>
              </label>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Add any notes about this document..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Record Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Date
                </label>
                <input
                  type="date"
                  value={uploadForm.recordDate}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, recordDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setUploadDialogOpen(false)}
                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-xl transition-all duration-200 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadForm.file || !uploadForm.documentType}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog with Close Button */}
      {previewDialogOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Header with Close Button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {selectedDocument.filename}
              </h2>
              <button
                onClick={() => setPreviewDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-gray-200">
                  {getDocumentIcon(selectedDocument)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">{selectedDocument.filename}</h3>
                <span className="inline-block px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  {selectedDocument.documentType}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: 'Size', value: selectedDocument.size },
                  { label: 'Uploaded', value: new Date(selectedDocument.uploadDate).toLocaleDateString() },
                  { label: 'Record Date', value: new Date(selectedDocument.recordDate).toLocaleDateString() }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 font-medium">{item.label}:</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {selectedDocument.description && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedDocument.description}</p>
                </div>
              )}

              <button
                onClick={() => handleDownload(selectedDocument.id, selectedDocument.filename)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <FaDownload />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;