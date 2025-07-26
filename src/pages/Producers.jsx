import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducers } from '../hooks/useProducers';
import { useTheme } from '../hooks/ThemeContext';
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

function ProducerRow({ producer, onEdit, onDelete, onToggleDetails, isExpanded, isDarkMode }) {
  // Map backend fields to frontend display
  const lobName = producer.lob_name || producer.lobName || '';
  const domain = producer.domain || '';
  const onboardType = producer.onboard_type || producer.onboardType || '';
  const subDomain = producer.sub_domain || producer.subDomain || '';
  let topicName = '';
  if (Array.isArray(producer.topic_name)) {
    topicName = producer.topic_name.join(', ');
  } else if (typeof producer.topic_name === 'string') {
    const str = producer.topic_name.trim();
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
  } else if (producer.topicName) {
    topicName = Array.isArray(producer.topicName) ? producer.topicName.join(', ') : producer.topicName;
  }
  const contactEmails = producer.contact_emails || producer.contactEmails || '';
  const createdAt = producer.created_at || producer.createdAt;
  const allEnvARNs = producer.allEnvARNs || (producer.env_arns ? producer.env_arns.map(e => `${e.env}: ${e.arn}`).join('\n') : '');

  return (
    <>
      <tr className={`border-b transition-colors duration-200 font-sans text-base ${isDarkMode ? 'border-gray-800 hover:bg-gray-800/60' : 'border-gray-100 hover:bg-gray-50'}`}>
        <td className={`py-3 px-4 font-normal align-top ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{lobName}</td>
        <td className={`py-3 px-4 align-top ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{domain}</td>
        <td className={`py-3 px-4 align-top ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{onboardType}</td>
        <td className={`py-3 px-4 align-top ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{subDomain}</td>
        <td className={`py-3 px-4 font-mono text-sm align-top ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {topicName.split(',').map((t, i, arr) => (
            <div key={i}>
              {t.trim()}{i < arr.length - 1 ? ',' : ''}
            </div>
          ))}
        </td>
        <td className={`py-3 px-4 align-top ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{contactEmails}</td>
        <td className={`py-3 px-4 align-top ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</td>
        <td className="py-3 px-4 align-top">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(producer)} 
              className={`p-2 rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-blue-900 hover:bg-blue-800 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => onDelete(producer.id)} 
              className={`p-2 rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => onToggleDetails(producer.id)} 
              className={`p-2 rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
              title="Details"
            >
              <Info size={18} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className={isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}>
          <td colSpan={columns.length} className="py-8 px-8">
            <div className={`rounded-2xl shadow-lg border p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isDarkMode ? 'bg-gray-900/90 border-blue-900' : 'bg-white/90 border-blue-100'}`}>
              <div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Basic Information</h4>
                <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : ''}`}>
                  <div><span className="font-medium">LOB Name:</span> {lobName}</div>
                  <div><span className="font-medium">Domain:</span> {domain}</div>
                  <div><span className="font-medium">Sub-Domain:</span> {subDomain}</div>
                  <div><span className="font-medium">Onboard Type:</span> {onboardType}</div>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Technical Details</h4>
                <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : ''}`}>
                  <div><span className="font-medium">Volume of Events:</span> {producer.volume_of_events || producer.volumeOfEvents || ''}</div>
                  <div><span className="font-medium">Schema Name:</span> {producer.schema_name || producer.schemaName || ''}</div>
                  <div><span className="font-medium">Topic Name:</span> {topicName}</div>
                  <div><span className="font-medium">Tentative PROD Date:</span> {producer.tentative_prod_date || producer.tentativeProdDate || ''}</div>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Configuration</h4>
                <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : ''}`}>
                  <div><span className="font-medium">Can Perform PT:</span> {(producer.can_perform_pt ?? producer.canPerformPT) ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Notification Email:</span> {producer.notification_email || producer.notificationEmail || ''}</div>
                  <div><span className="font-medium">Contact Emails:</span> {contactEmails}</div>
                  <div><span className="font-medium">Created:</span> {createdAt ? new Date(createdAt).toLocaleString() : ''}</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Environment ARNs</h4>
                <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <pre className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{allEnvARNs}</pre>
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
  const { isDarkMode } = useTheme();
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
    navigate('/onboard', { state: { editId: producer.id } });
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
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? 'from-gray-950 via-gray-900 to-gray-800' : 'from-blue-50 via-white to-blue-100'} py-8 px-2 flex flex-col items-center`}>
      <div className={`w-full max-w-6xl mx-auto rounded-2xl shadow-2xl border p-6 ${isDarkMode ? 'border-gray-800 bg-gray-900/90' : 'border-blue-100 bg-white/90'}`}>
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Producers</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your data producers and configurations</p>
        </div>
        <div className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
          <input
            type="text"
            placeholder="Search by LOB Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-700' : 'border-blue-200 focus:ring-blue-500 bg-white'}`}
          />
          <div className="flex gap-3">
            <button 
              onClick={refresh} 
              className={`text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold shadow ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              Refresh
            </button>
            <button 
              onClick={handleAddNew} 
              className={`text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold shadow ${isDarkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}
            >
              Add Producer
            </button>
          </div>
        </div>
        {error && (
          <div className={`border rounded-lg p-4 mb-6 shadow-sm ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className={`min-w-full rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <thead>
              <tr className={`shadow-sm font-sans text-base ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900'}`}>
                {columns.map(col => (
                  <th key={col.key} className={`py-3 px-4 text-left text-base border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-blue-50'}`}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : producers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className={`flex flex-col items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-400'}`}>
                      <div className="text-6xl mb-2">📦</div>
                      <p className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : ''}`}>No producers found</p>
                      <p className={`text-base mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>Add your first producer to get started</p>
                      <button onClick={handleAddNew} className={`text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold shadow ${isDarkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}>Add Producer</button>
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
                    isDarkMode={isDarkMode}
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

export default Producers; 