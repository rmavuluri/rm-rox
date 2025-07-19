import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const onboardTypes = [
  'Direct Producer',
  'Direct Consumer',
  'S3',
  'SF',
  'EB with Lambda',
];

const ENVIRONMENTS = ['DEV', 'QA', 'CAP', 'PSP', 'PROD'];

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
    envARNs: editData?.envARNs || [],
    notificationEmail: editData?.notificationEmail || '',
    contactEmails: editData?.contactEmails || '',
    createdAt: editData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Compute topic names for each env
  const getTopicNames = () => {
    const domain = form.domain.trim();
    const subDomain = form.subDomain.trim();
    if (!domain || !subDomain) return '';
    // Only for envs selected
    return form.envARNs
      .filter(row => row.env)
      .map(row => `${domain}-${subDomain}-${row.env.toLowerCase()}`)
      .join('\n');
  };

  // Compute schema names for each env
  const getSchemaNames = () => {
    const domain = form.domain.trim();
    const subDomain = form.subDomain.trim();
    if (!domain || !subDomain) return '';
    // Only for envs selected
    return form.envARNs
      .filter(row => row.env)
      .map(row => `ebeh-ob-${row.env.toLowerCase()}-${domain}-${subDomain}-schema`)
      .join('\n');
  };

  // Ensure at least one row is present
  React.useEffect(() => {
    if (form.envARNs.length === 0) {
      setForm((prev) => ({ ...prev, envARNs: [{ env: '', arn: '' }] }));
    }
  }, []);

  // Handle env/arn changes
  const handleEnvArnChange = (idx, field, value) => {
    setForm((prev) => {
      const envARNs = prev.envARNs.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      );
      return { ...prev, envARNs };
    });
  };

  // Validate single field on blur
  const validateField = (name, value) => {
    if (!touched[name]) return; // Only validate if field has been touched
    
    const newErrors = { ...errors };
    if (!value || value.trim() === '') {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle env/arn blur for validation
  const handleEnvArnBlur = (idx) => {
    const row = form.envARNs[idx];
    const newErrors = { ...errors };
    
    // Mark as touched
    if (!touched[`envArn_${idx}`]) {
      setTouched(prev => ({ ...prev, [`envArn_${idx}`]: true }));
    }
    
    // Validate this row
    if (touched[`envArn_${idx}`]) {
      if (row.env && !row.arn) {
        if (!newErrors.envARNsRows) newErrors.envARNsRows = {};
        newErrors.envARNsRows[idx] = 'ARN is required for this environment.';
      } else if (!row.env && row.arn) {
        if (!newErrors.envARNsRows) newErrors.envARNsRows = {};
        newErrors.envARNsRows[idx] = 'Please select an environment.';
      } else {
        if (newErrors.envARNsRows) {
          delete newErrors.envARNsRows[idx];
        }
      }
    }
    
    setErrors(newErrors);
    
    // Add new row if both env and arn are filled
    if (row.env && row.arn && idx === form.envARNs.length - 1) {
      const usedEnvs = form.envARNs.map((r) => r.env).filter(Boolean);
      if (usedEnvs.length < ENVIRONMENTS.length) {
        setForm((prev) => ({
          ...prev,
          envARNs: [...prev.envARNs, { env: '', arn: '' }],
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Inline validation
    const newErrors = {};
    if (!form.lobName) newErrors.lobName = 'LOB Name is required.';
    if (!form.domain) newErrors.domain = 'Domain is required.';
    if (!form.onboardType) newErrors.onboardType = 'Onboard Type is required.';
    if (!form.subDomain) newErrors.subDomain = 'Sub-Domain is required.';
    if (!form.volumeOfEvents) newErrors.volumeOfEvents = 'Volume of Events is required.';
    if (!form.schemaName) newErrors.schemaName = 'Schema Name is required.';
    if (!form.tentativeProdDate) newErrors.tentativeProdDate = 'Tentative PROD Date is required.';
    if (!form.notificationEmail) newErrors.notificationEmail = 'Notification Email is required.';
    if (!form.contactEmails) newErrors.contactEmails = 'Contact Emails are required.';
    // Validate envARNs: at least one, all filled, no duplicate envs
    const filledEnvARNs = form.envARNs.filter((row) => row.env && row.arn);
    if (filledEnvARNs.length === 0) {
      newErrors.envARNs = 'Please enter at least one environment ARN.';
    } else {
      form.envARNs.forEach((row, idx) => {
        if (row.env && !row.arn) {
          if (!newErrors.envARNsRows) newErrors.envARNsRows = {};
          newErrors.envARNsRows[idx] = 'ARN is required for this environment.';
        }
        if (!row.env && row.arn) {
          if (!newErrors.envARNsRows) newErrors.envARNsRows = {};
          newErrors.envARNsRows[idx] = 'Please select an environment.';
        }
      });
    }
    // Duplicate env check
    const envSet = new Set();
    for (const row of filledEnvARNs) {
      if (envSet.has(row.env)) {
        newErrors.envARNs = 'Duplicate environment selected.';
        break;
      }
      envSet.add(row.env);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Save only filled envARNs
    form.envARNs = filledEnvARNs;

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
              <input name="lobName" value={form.lobName} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.lobName ? 'border border-red-500' : ''}`} />
              {errors.lobName && <div className="text-red-400 text-xs mt-1">{errors.lobName}</div>}
            </div>
            <div>
              <label className="block mb-1">Onboard Type *</label>
              <select name="onboardType" value={form.onboardType} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.onboardType ? 'border border-red-500' : ''}`}>
                <option value="">Select Type</option>
                {onboardTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.onboardType && <div className="text-red-400 text-xs mt-1">{errors.onboardType}</div>}
            </div>
            <div>
              <label className="block mb-1">Domain *</label>
              <input name="domain" value={form.domain} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.domain ? 'border border-red-500' : ''}`} />
              {errors.domain && <div className="text-red-400 text-xs mt-1">{errors.domain}</div>}
            </div>
            <div>
              <label className="block mb-1">Sub-Domain *</label>
              <input name="subDomain" value={form.subDomain} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.subDomain ? 'border border-red-500' : ''}`} />
              {errors.subDomain && <div className="text-red-400 text-xs mt-1">{errors.subDomain}</div>}
            </div>
            <div>
              <label className="block mb-1">Volume of Events *</label>
              <input name="volumeOfEvents" value={form.volumeOfEvents} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.volumeOfEvents ? 'border border-red-500' : ''}`} />
              {errors.volumeOfEvents && <div className="text-red-400 text-xs mt-1">{errors.volumeOfEvents}</div>}
            </div>
            <div>
              <label className="block mb-1">Schema Name</label>
              <textarea
                name="schemaName"
                value={getSchemaNames()}
                className="w-full rounded p-2 bg-gray-700 text-white"
                readOnly
                rows={Math.max(2, form.envARNs.filter(row => row.env).length)}
                placeholder="Schema name will be generated as ebeh-ob-env-domain-subdomain-schema for each environment"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Environment ARNs *</label>
              <div className="space-y-2 mb-4">
                {form.envARNs.map((row, idx) => {
                  // Used envs except for this row
                  const usedEnvs = form.envARNs.map((r, i) => i !== idx ? r.env : null).filter(Boolean);
                  const rowError = errors.envARNsRows && errors.envARNsRows[idx];
                  return (
                    <div key={idx} className="flex gap-2 mb-1 items-start">
                      <select
                        className={`rounded p-2 bg-gray-700 text-white min-w-[90px] ${rowError ? 'border border-red-500' : ''}`}
                        value={row.env}
                        onChange={e => handleEnvArnChange(idx, 'env', e.target.value)}
                        onBlur={() => handleEnvArnBlur(idx)}
                        required={idx === 0}
                        disabled={usedEnvs.length >= ENVIRONMENTS.length}
                      >
                        <option value="">Select Env</option>
                        {ENVIRONMENTS.map(env => (
                          <option key={env} value={env} disabled={usedEnvs.includes(env)}>{env}</option>
                        ))}
                      </select>
                      <div className="flex-1">
                        <input
                          className={`w-full rounded p-2 bg-gray-700 text-white ${rowError ? 'border border-red-500' : ''}`}
                          placeholder="Enter ARN"
                          value={row.arn}
                          onChange={e => handleEnvArnChange(idx, 'arn', e.target.value)}
                          onBlur={() => handleEnvArnBlur(idx)}
                          required={!!row.env}
                          disabled={!row.env}
                        />
                        {rowError && <div className="text-red-400 text-xs mt-1">{rowError}</div>}
                      </div>
                    </div>
                  );
                })}
                {errors.envARNs && <div className="text-red-400 text-xs mt-1">{errors.envARNs}</div>}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Topic Name</label>
              <textarea
                name="topicName"
                value={getTopicNames()}
                className="w-full rounded p-2 bg-gray-700 text-white"
                readOnly
                rows={Math.max(2, form.envARNs.filter(row => row.env).length)}
                placeholder="Topic name will be generated as domain-subdomain-env for each environment"
              />
            </div>
            <div>
              <label className="block mb-1">Tentative PROD Date *</label>
              <input name="tentativeProdDate" type="date" value={form.tentativeProdDate} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.tentativeProdDate ? 'border border-red-500' : ''}`} />
              {errors.tentativeProdDate && <div className="text-red-400 text-xs mt-1">{errors.tentativeProdDate}</div>}
            </div>
            <div className="flex items-center mt-6">
              <input name="canPerformPT" type="checkbox" checked={form.canPerformPT} onChange={handleChange} className="mr-2" />
              <label>Able to perform PT?</label>
            </div>
            <div>
              <label className="block mb-1">Notification Email *</label>
              <input name="notificationEmail" type="email" value={form.notificationEmail} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.notificationEmail ? 'border border-red-500' : ''}`} />
              {errors.notificationEmail && <div className="text-red-400 text-xs mt-1">{errors.notificationEmail}</div>}
            </div>
            <div>
              <label className="block mb-1">Contact Emails *</label>
              <textarea name="contactEmails" value={form.contactEmails} onChange={handleChange} onBlur={handleBlur} className={`w-full rounded p-2 bg-gray-700 text-white ${errors.contactEmails ? 'border border-red-500' : ''}`} />
              {errors.contactEmails && <div className="text-red-400 text-xs mt-1">{errors.contactEmails}</div>}
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