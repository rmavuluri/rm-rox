import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const onboardTypes = [
  'Direct Producer',
  'Direct Consumer',
  'S3',
  'SF',
  'EB with Lambda',
];

const OnboardForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const [form, setForm] = useState({
    id: editData?.id || Math.random().toString(36).slice(2),
    lobName: editData?.lobName || '',
    domain: editData?.domain || '',
    onboardType: editData?.onboardType || '',
    subDomain: editData?.subDomain || '',
    volumeOfEvents: editData?.volumeOfEvents || '',
    schemaName: editData?.schemaName || '',
    topicName: editData?.topicName || '',
    tentativeProdDate: editData?.tentativeProdDate || '',
    canPerformPT: editData?.canPerformPT || false,
    allEnvARNs: editData?.allEnvARNs || '',
    notificationEmail: editData?.notificationEmail || '',
    contactEmails: editData?.contactEmails || '',
    createdAt: editData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic required validation
    if (!form.lobName || !form.domain || !form.onboardType || !form.subDomain || !form.volumeOfEvents || !form.schemaName || !form.topicName || !form.tentativeProdDate || !form.allEnvARNs || !form.notificationEmail || !form.contactEmails) {
      alert('Please fill all required fields.');
      return;
    }
    const isProducer = ['Direct Producer', 'EB with Lambda'].includes(form.onboardType);
    const storageKey = isProducer ? 'producers_data' : 'consumers_data';
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (isEditMode) {
      const updatedData = existingData.map((item) => (item.id === form.id ? form : item));
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    } else {
      existingData.unshift(form);
      localStorage.setItem(storageKey, JSON.stringify(existingData));
    }
    navigate(isProducer ? '/producers' : '/consumers');
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Onboarding' : 'Onboarding Form'}</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">LOB Name *</label>
              <input name="lobName" value={form.lobName} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Onboard Type *</label>
              <select name="onboardType" value={form.onboardType} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required>
                <option value="">Select Type</option>
                {onboardTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Domain *</label>
              <input name="domain" value={form.domain} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Sub-Domain *</label>
              <input name="subDomain" value={form.subDomain} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Volume of Events *</label>
              <input name="volumeOfEvents" value={form.volumeOfEvents} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Schema Name *</label>
              <input name="schemaName" value={form.schemaName} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Topic Name *</label>
              <input name="topicName" value={form.topicName} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Tentative PROD Date *</label>
              <input name="tentativeProdDate" type="date" value={form.tentativeProdDate} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div className="flex items-center mt-6">
              <input name="canPerformPT" type="checkbox" checked={form.canPerformPT} onChange={handleChange} className="mr-2" />
              <label>Able to perform PT?</label>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">All Env ARNs *</label>
              <textarea name="allEnvARNs" value={form.allEnvARNs} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Notification Email *</label>
              <input name="notificationEmail" type="email" value={form.notificationEmail} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
            <div>
              <label className="block mb-1">Contact Emails *</label>
              <textarea name="contactEmails" value={form.contactEmails} onChange={handleChange} className="w-full rounded p-2 bg-gray-700 text-white" required />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700">{isEditMode ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardForm; 