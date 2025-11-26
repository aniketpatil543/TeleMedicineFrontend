import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const Profile = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    age: userData?.age || '',
    bloodType: userData?.bloodType || '',
    lastCheckup: userData?.lastCheckup || '',
    address: userData?.address || '',
    emergencyContacts: userData?.emergencyContacts || [
      { id: 1, name: 'Jane Doe', relationship: 'Spouse', phone: '+1 (555) 987-6543' },
      { id: 2, name: 'Robert Wilson', relationship: 'Brother', phone: '+1 (555) 456-7890' }
    ],
    allergies: userData?.allergies || ['Penicillin'],
    conditions: userData?.conditions || ['Hypertension']
  });

  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      age: userData?.age || '',
      bloodType: userData?.bloodType || '',
      lastCheckup: userData?.lastCheckup || '',
      address: userData?.address || '',
      emergencyContacts: userData?.emergencyContacts || [
        { id: 1, name: 'Jane Doe', relationship: 'Spouse', phone: '+1 (555) 987-6543' },
        { id: 2, name: 'Robert Wilson', relationship: 'Brother', phone: '+1 (555) 456-7890' }
      ],
      allergies: userData?.allergies || ['Penicillin'],
      conditions: userData?.conditions || ['Hypertension']
    });
    setIsEditing(false);
  };

  const addEmergencyContact = () => {
    if (newContact.name && newContact.relationship && newContact.phone) {
      setFormData(prev => ({
        ...prev,
        emergencyContacts: [
          ...prev.emergencyContacts,
          { id: Date.now(), ...newContact }
        ]
      }));
      setNewContact({ name: '', relationship: '', phone: '' });
    }
  };

  const removeEmergencyContact = (id) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const inputFields = [
    { key: 'name', label: 'Full Name', icon: <FiUser className="text-purple-500" />, type: 'text' },
    { key: 'email', label: 'Email Address', icon: <FiMail className="text-purple-500" />, type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone className="text-purple-500" />, type: 'tel' },
    { key: 'age', label: 'Age', icon: <FiCalendar className="text-purple-500" />, type: 'number' },
    { key: 'bloodType', label: 'Blood Type', icon: '🩸', type: 'text' },
    { key: 'lastCheckup', label: 'Last Checkup', icon: <FiCalendar className="text-purple-500" />, type: 'date' },
    { key: 'address', label: 'Address', icon: '🏠', type: 'text' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiEdit />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiX />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiSave />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center space-x-2">
              <FiUser className="text-purple-600" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-purple-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    {field.icon}
                    <span>{field.label}</span>
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-purple-900 font-semibold px-3 py-2 bg-purple-50 rounded-lg">
                      {formData[field.key] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-900 flex items-center space-x-2">
                <FiPhone className="text-purple-600" />
                <span>Emergency Contacts</span>
              </h3>
              {isEditing && (
                <span className="text-sm text-purple-600">{formData.emergencyContacts.length}/5</span>
              )}
            </div>
            
            <div className="space-y-4">
              {formData.emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => {
                            const updatedContacts = formData.emergencyContacts.map(c =>
                              c.id === contact.id ? { ...c, name: e.target.value } : c
                            );
                            setFormData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
                          }}
                          className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={contact.relationship}
                          onChange={(e) => {
                            const updatedContacts = formData.emergencyContacts.map(c =>
                              c.id === contact.id ? { ...c, relationship: e.target.value } : c
                            );
                            setFormData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
                          }}
                          className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Relationship"
                        />
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => {
                            const updatedContacts = formData.emergencyContacts.map(c =>
                              c.id === contact.id ? { ...c, phone: e.target.value } : c
                            );
                            setFormData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
                          }}
                          className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Phone"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-purple-900">{contact.name}</p>
                        <p className="text-purple-700 text-sm">{contact.relationship}</p>
                        <p className="text-purple-700 text-sm">{contact.phone}</p>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeEmergencyContact(contact.id)}
                      className="ml-4 text-red-500 hover:text-red-700 p-2"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && formData.emergencyContacts.length < 5 && (
                <div className="p-4 bg-purple-25 rounded-lg border-2 border-dashed border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Relationship"
                    />
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      className="px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Phone"
                    />
                  </div>
                  <button
                    onClick={addEmergencyContact}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <FiPlus />
                    <span>Add Emergency Contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information & Settings */}
        <div className="space-y-6">
          {/* Medical Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Medical Summary</h3>
            
            {/* Allergies */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-purple-800">Allergies</h4>
                {isEditing && (
                  <span className="text-sm text-purple-600">{formData.allergies.length}/10</span>
                )}
              </div>
              <div className="space-y-2">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                    {isEditing ? (
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => {
                          const updatedAllergies = [...formData.allergies];
                          updatedAllergies[index] = e.target.value;
                          setFormData(prev => ({ ...prev, allergies: updatedAllergies }));
                        }}
                        className="flex-1 bg-transparent outline-none text-red-800"
                      />
                    ) : (
                      <span className="text-red-800">{allergy}</span>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeAllergy(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && formData.allergies.length < 10 && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Add allergy"
                    />
                    <button
                      onClick={addAllergy}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-purple-800">Medical Conditions</h4>
                {isEditing && (
                  <span className="text-sm text-purple-600">{formData.conditions.length}/10</span>
                )}
              </div>
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                    {isEditing ? (
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => {
                          const updatedConditions = [...formData.conditions];
                          updatedConditions[index] = e.target.value;
                          setFormData(prev => ({ ...prev, conditions: updatedConditions }));
                        }}
                        className="flex-1 bg-transparent outline-none text-green-800"
                      />
                    ) : (
                      <span className="text-green-800">{condition}</span>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeCondition(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && formData.conditions.length < 10 && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Add condition"
                    />
                    <button
                      onClick={addCondition}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-left">
                Change Password
              </button>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 text-left">
                Privacy Settings
              </button>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 text-left">
                Download Medical Records
              </button>
              <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 px-4 rounded-lg font-medium transition-colors border border-red-200 text-left">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;