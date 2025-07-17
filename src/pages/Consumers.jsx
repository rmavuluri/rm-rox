import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsumers } from '../hooks/useConsumers';

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
  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <td className="py-3 px-4 font-normal text-gray-900 align-top">{consumer.lobName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{consumer.domain}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{consumer.onboardType}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{consumer.subDomain}</td>
        <td className="py-3 px-4 text-gray-700 font-mono text-sm align-top">{consumer.topicName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{consumer.contactEmails}</td>
        <td className="py-3 px-4 text-gray-600 align-top">{new Date(consumer.createdAt).toLocaleDateString()}</td>
        <td className="py-3 px-4 align-top">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(consumer)} 
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(consumer.id)} 
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Delete
            </button>
            <button 
              onClick={() => onToggleDetails(consumer.id)} 
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
            >
              Details
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={columns.length} className="py-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">LOB Name:</span> {consumer.lobName}</div>
                  <div><span className="font-medium">Domain:</span> {consumer.domain}</div>
                  <div><span className="font-medium">Sub-Domain:</span> {consumer.subDomain}</div>
                  <div><span className="font-medium">Onboard Type:</span> {consumer.onboardType}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Volume of Events:</span> {consumer.volumeOfEvents}</div>
                  <div><span className="font-medium">Schema Name:</span> {consumer.schemaName}</div>
                  <div><span className="font-medium">Topic Name:</span> {consumer.topicName}</div>
                  <div><span className="font-medium">Tentative PROD Date:</span> {consumer.tentativeProdDate}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Can Perform PT:</span> {consumer.canPerformPT ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Notification Email:</span> {consumer.notificationEmail}</div>
                  <div><span className="font-medium">Contact Emails:</span> {consumer.contactEmails}</div>
                  <div><span className="font-medium">Created:</span> {new Date(consumer.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-2">Environment ARNs</h4>
                <div className="bg-gray-100 p-3 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{consumer.allEnvARNs}</pre>
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
    navigate('/onboard', { state: { editData: consumer } });
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
    <div className="min-h-screen bg-transparent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Consumers</h1>
        <p className="text-gray-600">Manage your data consumers and configurations</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by LOB Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors duration-200"
        />
        <div className="flex gap-3">
          <button 
            onClick={refresh} 
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 font-semibold"
          >
            Refresh
          </button>
          <button 
            onClick={handleAddNew} 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
          >
            Add Consumer
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-900">
              {columns.map(col => (
                <th key={col.key} className="py-3 px-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : consumers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-lg font-medium">No consumers found</p>
                    <p className="text-sm">Add your first consumer to get started</p>
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
  );
};

export default Consumers; 