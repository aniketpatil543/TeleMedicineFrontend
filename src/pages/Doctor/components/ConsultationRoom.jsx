import React, { useState } from 'react';
import { 
  FiVideo, 
  FiMic, 
  FiMicOff, 
  FiVideoOff,
  FiMessageSquare,
  FiFileText,
  FiUser,
  FiClock,
  FiSend,
  FiPaperclip
} from 'react-icons/fi';
import { 
  TbStethoscope,
  TbPill,
  TbReportMedical
} from 'react-icons/tb';

const ConsultationRoom = ({ patient }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('video');

  const consultationData = {
    patient: patient || {
      name: 'John Smith',
      age: 45,
      condition: 'Hypertension'
    },
    duration: '00:15:23',
    vitalSigns: {
      bp: '120/80',
      heartRate: '72',
      temperature: '98.6°F',
      oxygen: '98%'
    }
  };

  const messages = [
    { id: 1, sender: 'doctor', text: 'How are you feeling today?', time: '14:30' },
    { id: 2, sender: 'patient', text: 'Much better, thank you doctor.', time: '14:31' },
    { id: 3, sender: 'doctor', text: 'Any side effects from the medication?', time: '14:32' }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      // Handle message sending
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TbStethoscope className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Live Consultation</h1>
              <p className="text-gray-400 text-sm">
                With {consultationData.patient.name} • {consultationData.duration}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <FiClock className="text-lg" />
              <span className="font-mono">{consultationData.duration}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video/Audio Section */}
        <div className="flex-1 flex flex-col p-6">
          {/* Video Feed */}
          <div className="flex-1 bg-black rounded-2xl relative mb-4 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center text-gray-400">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-4xl text-gray-600" />
                </div>
                <p className="text-lg">{consultationData.patient.name}</p>
                <p className="text-sm text-gray-500">Video feed active</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <FiVideoOff className="text-6xl mx-auto mb-4 text-gray-600" />
                <p>Video is turned off</p>
              </div>
            )}
            
            {/* Vital Signs Overlay */}
            <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 rounded-xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-2">Vital Signs</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>BP: <span className="text-green-400">{consultationData.vitalSigns.bp}</span></div>
                <div>HR: <span className="text-green-400">{consultationData.vitalSigns.heartRate}</span></div>
                <div>Temp: <span className="text-green-400">{consultationData.vitalSigns.temperature}</span></div>
                <div>O2: <span className="text-green-400">{consultationData.vitalSigns.oxygen}</span></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isAudioOn 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isAudioOn ? <FiMic className="text-xl" /> : <FiMicOff className="text-xl" />}
            </button>
            
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isVideoOn 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isVideoOn ? <FiVideo className="text-xl" /> : <FiVideoOff className="text-xl" />}
            </button>
            
            <button className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white">
              <TbPill className="text-xl" />
            </button>
            
            <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white">
              <TbReportMedical className="text-xl" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:w-80 border-l border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FiMessageSquare className="text-lg" />
              Consultation Chat
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    msg.sender === 'doctor'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 transition-colors">
                <FiPaperclip className="text-lg" />
              </button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
              <FiFileText className="text-lg" />
              Add Clinical Notes
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
              <TbPill className="text-lg" />
              Prescribe Medication
            </button>
          </div>
          
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
            End Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;