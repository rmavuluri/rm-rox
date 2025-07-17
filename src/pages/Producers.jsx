import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducers } from '../hooks/useProducers';

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

function ProducerRow({ producer, onEdit, onDelete, onToggleDetails, isExpanded }) {
  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <td className="py-3 px-4 font-normal text-gray-900 align-top">{producer.lobName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{producer.domain}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{producer.onboardType}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{producer.subDomain}</td>
        <td className="py-3 px-4 text-gray-700 font-mono text-sm align-top">{producer.topicName}</td>
        <td className="py-3 px-4 text-gray-700 align-top">{producer.contactEmails}</td>
        <td className="py-3 px-4 text-gray-600 align-top">{new Date(producer.createdAt).toLocaleDateString()}</td>
        <td className="py-3 px-4 align-top">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(producer)} 
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(producer.id)} 
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Delete
            </button>
            <button 
              onClick={() => onToggleDetails(producer.id)} 
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
                  <div><span className="font-medium">LOB Name:</span> {producer.lobName}</div>
                  <div><span className="font-medium">Domain:</span> {producer.domain}</div>
                  <div><span className="font-medium">Sub-Domain:</span> {producer.subDomain}</div>
                  <div><span className="font-medium">Onboard Type:</span> {producer.onboardType}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Volume of Events:</span> {producer.volumeOfEvents}</div>
                  <div><span className="font-medium">Schema Name:</span> {producer.schemaName}</div>
                  <div><span className="font-medium">Topic Name:</span> {producer.topicName}</div>
                  <div><span className="font-medium">Tentative PROD Date:</span> {producer.tentativeProdDate}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Can Perform PT:</span> {producer.canPerformPT ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Notification Email:</span> {producer.notificationEmail}</div>
                  <div><span className="font-medium">Contact Emails:</span> {producer.contactEmails}</div>
                  <div><span className="font-medium">Created:</span> {new Date(producer.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-2">Environment ARNs</h4>
                <div className="bg-gray-100 p-3 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{producer.allEnvARNs}</pre>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const Producers = () => {
  const navigate = useNavigate();
  const {
    producers,
    loading,
    error,
    search,
    setSearch,
    refresh,
    deleteProducer,
  } = useProducers();

  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleEdit = (producer) => {
    navigate('/onboard', { state: { editData: producer } });
  };

  const handleAddNew = () => {
    navigate('/onboard');
  };

  const handleToggleDetails = (producerId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(producerId)) {
        newSet.delete(producerId);
      } else {
        newSet.add(producerId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Producers</h1>
        <p className="text-gray-600">Manage your data producers and configurations</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by LOB Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Add Producer
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
            ) : producers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-lg font-medium">No producers found</p>
                    <p className="text-sm">Add your first producer to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              producers.map(producer => (
                <ProducerRow
                  key={producer.id}
                  producer={producer}
                  onEdit={handleEdit}
                  onDelete={deleteProducer}
                  onToggleDetails={handleToggleDetails}
                  isExpanded={expandedRows.has(producer.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Producers; 