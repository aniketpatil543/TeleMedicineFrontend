// Fetaure bracnh 
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiFileText,
  FiDownload,
  FiEye,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

import { TbMicroscope, TbReportMedical, TbVaccine } from "react-icons/tb";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch ALL documents (doctor access)
  useEffect(() => {
    axios
      .get("http://localhost:8087/api/files/doctor/all")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  // Doctor: View modal
  const handleView = async (record) => {
    try {
      const { data: url } = await axios.get(
        `http://localhost:8087/api/files/doctor/download-url?fileName=${record.fileName}`
      );

      setPreviewUrl(url);       // S3 preview URL
      setSelectedRecord(record); // Open modal
    } catch (error) {
      console.error("View error:", error);
    }
  };

  // Doctor: Download file in new tab
  const handleDownload = async (fileName) => {
    try {
      const { data: url } = await axios.get(
        `http://localhost:8087/api/files/doctor/download-url?fileName=${fileName}`
      );
      window.open(url, "_blank"); // open in new tab
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Icons based on file type
  const getIcon = (type) => {
    if (type === "Lab Report")
      return <TbMicroscope className="text-xl text-purple-600" />;
    if (type === "Prescription")
      return <TbVaccine className="text-xl text-green-600" />;
    return <FiFileText className="text-xl text-blue-600" />;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <TbReportMedical className="text-white text-2xl" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Patient Documents
          </h1>
          <p className="text-gray-600">Database Records</p>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-6 border-b bg-gray-50 text-lg font-semibold">
          Documents
        </div>

        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-6 border-b flex justify-between items-center hover:bg-gray-50 transition"
          >
            {/* File info */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                {getIcon(rec.documentType)}
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {rec.documentType}
                </h3>

                <p className="text-sm text-gray-600 flex gap-4">
                  <span className="flex items-center gap-1">
                    <FiCalendar /> {rec.recordDate}
                  </span>
                 
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  Patient ID:
                  <span className="font-medium">{rec.patientId}</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleView(rec)}
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() => handleDownload(rec.fileName)}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200"
              >
                <FiDownload />
              </button>
            </div>
          </div>
        ))}

        {/* No records */}
        {records.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No documents found.
          </p>
        )}
      </div>

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedRecord.fileName}
              </h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setSelectedRecord(null);
                  setPreviewUrl(null);
                }}
              >
                ✖
              </button>
            </div>

            {/* File Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <FiFileText className="text-gray-700 text-3xl" />
              </div>
            </div>

            {/* Document Type */}
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {selectedRecord.documentType}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-gray-700">
              <p><strong>Uploaded:</strong> {selectedRecord.uploadedAt}</p>
              <p><strong>Record Date:</strong> {selectedRecord.recordDate}</p>
              <p><strong>Patient ID:</strong> {selectedRecord.patientId}</p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Description:
              </label>
              <div className="p-3 border rounded-xl bg-gray-50 text-gray-700">
                {selectedRecord.description || "No description"}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(selectedRecord.fileName)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-blue-700"
            >
              <FiDownload /> Download Document
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
