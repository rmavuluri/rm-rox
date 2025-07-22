import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsumers } from '../hooks/useConsumers';
import { Pencil, Trash2, Info } from 'lucide-react';

const columns = [
  { key: 'lobName', label: 'LOB NAME' },
  { key: 'domain', label: 'DOMAIN' },
  { key: 'onboardType', label: 'ONBOARD TYPE' },
  { key: 'subDomain', label: 'SUB-DOMAIN' },
  { key: 'topicName', label: 'TOPIC NAME' },
  { key: 'contactEmails', label: 'CONTACT' },
  { key: 'createdAt', label: 'CREATED AT' },
  { key: 'actions', label: 'ACTIONS' },
];

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {columns.map((col) => (
        <td key={col.key} className="py-3 px-4 bg-gray-100 h-8"></td>
      ))}
    </tr>
  );
}

function ConsumerRow({ consumer, onEdit, onDelete, onToggleDetails, isExpanded }) {
  // Map backend fields to frontend display
  const lobName = consumer.lob_name || consumer.lobName || '';
  const domain = consumer.domain || '';
  const onboardType = consumer.onboard_type || consumer.onboardType || '';
  const subDomain = consumer.sub_domain || consumer.subDomain || '';
  let topicName = '';
  if (Array.isArray(consumer.topic_name)) {
    topicName = consumer.topic_name.join(', ');
  } else if (typeof consumer.topic_name === 'string') {
    const str = consumer.topic_name.trim();
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          topicName = parsed.join(', ');
        } else {
          topicName = str;
        }
      } catch {
        topicName = str.replace(/[\[\]{}'"\\]/g, '');
      }
    } else {
      topicName = str.replace(/[\[\]{}'"\\]/g, '');
    }
  } else if (consumer.topicName) {
    topicName = Array.isArray(consumer.topicName) ? consumer.topicName.join(', ') : consumer.topicName;
  }
  const contactEmails = consumer.contact_emails || consumer.contactEmails || '';
  const createdAt = consumer.created_at || consumer.createdAt;
  const allEnvARNs = consumer.allEnvARNs || (consumer.env_arns ? consumer.env_arns.map(e => `${e.env}: ${e.arn}`).join('\n') : '');

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <td className="py-3 px-4 font-normal text-gray-900 align-top">{lobName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{domain}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{onboardType}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{subDomain}</td>
        <td className="py-3 px-4 text-gray-700 font-mono text-sm align-top">{topicName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{contactEmails}</td>
        <td className="py-3 px-4 text-gray-600 align-top">{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</td>
        <td className="py-3 px-4 align-top">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(consumer)} 
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors duration-200 flex items-center justify-center shadow-sm"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => onDelete(consumer.id)} 
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors duration-200 flex items-center justify-center shadow-sm"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => onToggleDetails(consumer.id)} 
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200 flex items-center justify-center shadow-sm"
              title="Details"
            >
              <Info size={18} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-green-50">
          <td colSpan={columns.length} className="py-8 px-8">
            <div className="rounded-2xl shadow-lg bg-white/90 border border-green-100 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">LOB Name:</span> {lobName}</div>
                  <div><span className="font-medium">Domain:</span> {domain}</div>
                  <div><span className="font-medium">Sub-Domain:</span> {subDomain}</div>
                  <div><span className="font-medium">Onboard Type:</span> {onboardType}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Volume of Events:</span> {consumer.volume_of_events || consumer.volumeOfEvents || ''}</div>
                  <div><span className="font-medium">Schema Name:</span> {consumer.schema_name || consumer.schemaName || ''}</div>
                  <div><span className="font-medium">Topic Name:</span> {topicName}</div>
                  <div><span className="font-medium">Tentative PROD Date:</span> {consumer.tentative_prod_date || consumer.tentativeProdDate || ''}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Can Perform PT:</span> {(consumer.can_perform_pt ?? consumer.canPerformPT) ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Notification Email:</span> {consumer.notification_email || consumer.notificationEmail || ''}</div>
                  <div><span className="font-medium">Contact Emails:</span> {contactEmails}</div>
                  <div><span className="font-medium">Created:</span> {createdAt ? new Date(createdAt).toLocaleString() : ''}</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-2">Environment ARNs</h4>
                <div className="bg-gray-100 p-3 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{allEnvARNs}</pre>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const Consumers = () => {
  const navigate = useNavigate();
  const {
    consumers,
    loading,
    error,
    search,
    setSearch,
    refresh,
    deleteConsumer,
  } = useConsumers();

  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleEdit = (consumer) => {
    navigate('/onboard', { state: { editId: consumer.id } });
  };

  const handleAddNew = () => {
    navigate('/onboard');
  };

  const handleToggleDetails = (consumerId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(consumerId)) {
        newSet.delete(consumerId);
      } else {
        newSet.add(consumerId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto rounded-2xl shadow-2xl border border-blue-100 bg-white/90 p-6">
        <div className="mb-8">
          <h1 className="atlantic-heading">Consumers</h1>
          <p className="body-text">Manage your data consumers and configurations</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6 shadow-sm">
          <input
            type="text"
            placeholder="Search by LOB Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-blue-200 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 bg-white shadow-sm body-text"
          />
          <div className="flex gap-3">
            <button 
              onClick={refresh} 
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold shadow"
            >
              Refresh
            </button>
            <button 
              onClick={handleAddNew} 
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors duration-200 font-semibold shadow"
            >
              Add Consumer
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium body-text">{error}</span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 shadow-sm">
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 text-left table-heading text-base border-b border-green-200">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50 table-body">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : consumers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-green-400">
                      <div className="text-6xl mb-2">📊</div>
                      <p className="text-xl font-semibold body-text">No consumers found</p>
                      <p className="text-base text-green-500 mb-2 body-text">Add your first consumer to get started</p>
                      <button onClick={handleAddNew} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors duration-200 font-semibold shadow">Add Consumer</button>
                    </div>
                  </td>
                </tr>
              ) : (
                consumers.map(consumer => (
                  <ConsumerRow
                    key={consumer.id}
                    consumer={consumer}
                    onEdit={handleEdit}
                    onDelete={deleteConsumer}
                    onToggleDetails={handleToggleDetails}
                    isExpanded={expandedRows.has(consumer.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Consumers; 