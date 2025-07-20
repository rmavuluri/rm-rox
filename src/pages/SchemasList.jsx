import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText, Layers } from 'lucide-react';
import { useTheme } from '../hooks/ThemeContext';

const VERSIONS = ['1.0.0', '1.1.0', '2.0.0'];

const getAllSchemasGrouped = () => {
  const producersData = JSON.parse(localStorage.getItem('producers_data') || '[]');
  const consumersData = JSON.parse(localStorage.getItem('consumers_data') || '[]');
  const allData = [...producersData, ...consumersData];
  const mock = [
    { domain: 'customers', subdomain: 'profiles' },
    { domain: 'customers', subdomain: 'relationships' },
    { domain: 'customers', subdomain: 'preferences' },
    { domain: 'customers', subdomain: 'history' },
    { domain: 'products', subdomain: 'inventory' },
    { domain: 'products', subdomain: 'categories' },
    { domain: 'products', subdomain: 'pricing' },
    { domain: 'products', subdomain: 'reviews' },
    { domain: 'orders', subdomain: 'checkout' },
    { domain: 'orders', subdomain: 'payment' },
    { domain: 'orders', subdomain: 'shipping' },
    { domain: 'orders', subdomain: 'tracking' },
    { domain: 'auth', subdomain: 'login' },
    { domain: 'auth', subdomain: 'registration' },
    { domain: 'auth', subdomain: 'permissions' },
    { domain: 'auth', subdomain: 'sessions' },
    { domain: 'analytics', subdomain: 'reports' },
    { domain: 'analytics', subdomain: 'metrics' },
    { domain: 'analytics', subdomain: 'insights' },
    { domain: 'analytics', subdomain: 'forecasting' },
  ];
  let schemas = [];
  if (allData.length > 0) {
    const seen = new Set();
    allData.forEach(item => {
      const key = `${item.domain}__${item.subDomain}`;
      if (!seen.has(key)) {
        schemas.push({ domain: item.domain, subdomain: item.subDomain });
        seen.add(key);
      }
    });
  } else {
    schemas = mock;
  }
  return schemas;
};

const getSubdomainSchema = (domain, subdomain, version = '1.0.0') => {
  const schemas = {
    '1.0.0': {
      schemaName: `ebeh-ob-dev-${domain}-${subdomain}-schema`,
      version: '1.0.0',
      title: `${domain}-${subdomain}`,
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the record' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
        status: { type: 'string', enum: ['active', 'inactive', 'pending'], description: 'Current status' },
        metadata: { 
          type: 'object', 
          properties: {
            domain: { type: 'string', description: 'Domain name' },
            subdomain: { type: 'string', description: 'Subdomain name' },
            environment: { type: 'string', description: 'Environment (dev, qa, prod)' }
          }
        }
      },
      required: ['id', 'name', 'status']
    },
    '1.1.0': {
      schemaName: `ebeh-ob-dev-${domain}-${subdomain}-schema`,
      version: '1.1.0',
      title: `${domain}-${subdomain}`,
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the record' },
        email: { type: 'string', format: 'email', description: 'Email address' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
        status: { type: 'string', enum: ['active', 'inactive', 'pending', 'suspended'], description: 'Current status' },
        isVerified: { type: 'boolean', description: 'Verification status' },
        metadata: { 
          type: 'object', 
          properties: {
            domain: { type: 'string', description: 'Domain name' },
            subdomain: { type: 'string', description: 'Subdomain name' },
            environment: { type: 'string', description: 'Environment (dev, qa, prod)' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Additional tags' }
          }
        }
      },
      required: ['id', 'name', 'email', 'status']
    },
    '2.0.0': {
      schemaName: `ebeh-ob-dev-${domain}-${subdomain}-schema`,
      version: '2.0.0',
      title: `${domain}-${subdomain}`,
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the record' },
        email: { type: 'string', format: 'email', description: 'Email address' },
        phone: { type: 'string', description: 'Phone number' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
        status: { type: 'string', enum: ['active', 'inactive', 'pending', 'suspended', 'archived'], description: 'Current status' },
        isVerified: { type: 'boolean', description: 'Verification status' },
        preferences: {
          type: 'object',
          properties: {
            notifications: { type: 'boolean', description: 'Notification preferences' },
            language: { type: 'string', enum: ['en', 'es', 'fr'], description: 'Preferred language' },
            timezone: { type: 'string', description: 'User timezone' }
          }
        },
        metadata: { 
          type: 'object', 
          properties: {
            domain: { type: 'string', description: 'Domain name' },
            subdomain: { type: 'string', description: 'Subdomain name' },
            environment: { type: 'string', description: 'Environment (dev, qa, prod)' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Additional tags' },
            version: { type: 'string', description: 'Schema version' }
          }
        }
      },
      required: ['id', 'name', 'email', 'status', 'preferences']
    }
  };
  return schemas[version] || schemas['1.0.0'];
};

const SchemasList = () => {
  const { isDarkMode } = useTheme();
  const schemas = useMemo(getAllSchemasGrouped, []);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [current, setCurrent] = useState(null); // { domain, subdomain, version }

  // For slider navigation
  const flatSchemas = useMemo(() => schemas.flatMap(s => VERSIONS.map(version => ({ ...s, version }))), [schemas]);
  const currentIdx = current ? flatSchemas.findIndex(s => s.domain === current.domain && s.subdomain === current.subdomain && s.version === current.version) : -1;

  const handleChipClick = (domain, subdomain, version) => {
    setCurrent({ domain, subdomain, version });
    setSliderOpen(true);
  };
  const handleClose = () => setSliderOpen(false);
  const handlePrev = e => {
    e.stopPropagation();
    if (currentIdx > 0) setCurrent(flatSchemas[currentIdx - 1]);
    else setCurrent(flatSchemas[flatSchemas.length - 1]);
  };
  const handleNext = e => {
    e.stopPropagation();
    if (currentIdx < flatSchemas.length - 1) setCurrent(flatSchemas[currentIdx + 1]);
    else setCurrent(flatSchemas[0]);
  };

  const schemaDef = current ? getSubdomainSchema(current.domain, current.subdomain, current.version) : null;

  return (
    <div className={`min-h-[80vh] w-full flex flex-col items-center justify-start py-12 px-2 bg-gradient-to-br ${isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-purple-50 via-white to-blue-50'}`}>
      <div className={`w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-700 bg-gray-900/90' : 'border-gray-200 bg-white/90'} p-8`}>
        <div className="flex items-center gap-3 mb-8">
          <Layers className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
          <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Schemas List</h1>
        </div>
        <table className={`w-full text-left rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : ''}`}>
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700'} text-base`}>
              <th className="py-3 px-4 font-bold">Domain</th>
              <th className="py-3 px-4 font-bold">Subdomain</th>
              <th className="py-3 px-4 font-bold">Versions</th>
            </tr>
          </thead>
          <tbody>
            {schemas.map((s, idx) => (
              <tr key={`${s.domain}-${s.subdomain}`} className={`border-b last:border-b-0 transition-all group ${isDarkMode ? 'hover:bg-purple-900/30 border-gray-700' : 'hover:bg-purple-50/40'}`}>
                <td className={`py-3 px-4 capitalize font-semibold text-lg group-hover:text-purple-400 ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>{s.domain}</td>
                <td className={`py-3 px-4 capitalize font-medium text-base group-hover:text-purple-400 ${isDarkMode ? 'text-purple-200' : 'text-gray-800'}`}>{s.subdomain}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-wrap">
                    {VERSIONS.map(version => (
                      <button
                        key={version}
                        className={`px-3 py-1 rounded-full border font-semibold text-sm flex items-center gap-1 shadow-sm transition-all
                          ${current && current.domain === s.domain && current.subdomain === s.subdomain && current.version === version
                            ? isDarkMode ? 'bg-purple-700 text-white border-purple-700 scale-105' : 'bg-purple-600 text-white border-purple-600 scale-105'
                            : isDarkMode ? 'bg-gray-800 text-purple-200 border-purple-700 hover:bg-purple-900 hover:border-purple-400' : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100 hover:border-purple-500'}
                        `}
                        onClick={() => handleChipClick(s.domain, s.subdomain, version)}
                      >
                        <FileText size={15} /> v{version}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Slider overlay */}
      {sliderOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
      {/* Slider panel */}
      <div
        className={`fixed top-0 right-0 h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          sliderOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-100 via-white to-blue-100'}`}
        style={{ width: '750px' }}
        onClick={e => e.stopPropagation()}
      >
        {sliderOpen && (
          <>
            <div className={`flex items-center justify-between p-8 border-b shadow-md rounded-t-2xl ${isDarkMode ? 'border-purple-900 bg-gray-900/80' : 'border-purple-200 bg-white/80'}`}>
              <div className="flex items-center gap-3">
                <FileText className={`w-7 h-7 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {current?.domain} / {current?.subdomain} <span className={`text-base ml-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>v{current?.version}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className={`p-2 rounded-full border shadow ${isDarkMode ? 'hover:bg-purple-900 text-purple-200 border-purple-900' : 'hover:bg-purple-100 text-purple-600 border-purple-200'}`}
                  title="Previous"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className={`p-2 rounded-full border shadow ${isDarkMode ? 'hover:bg-purple-900 text-purple-200 border-purple-900' : 'hover:bg-purple-100 text-purple-600 border-purple-200'}`}
                  title="Next"
                >
                  <ChevronRight size={22} />
                </button>
                <button
                  onClick={handleClose}
                  className={`ml-2 p-2 rounded-full border shadow ${isDarkMode ? 'hover:bg-purple-900 text-purple-200 border-purple-900' : 'hover:bg-purple-100 text-purple-600 border-purple-200'}`}
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(100vh-120px)]">
              {schemaDef && (
                <div className="space-y-6">
                  <div className={`${isDarkMode ? 'bg-gray-900 border-purple-900' : 'bg-white/90 border-purple-200'} rounded-xl border p-4 shadow`}>
                    <div className={`text-xs mb-1 font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Schema Name</div>
                    <div className={`text-base font-mono ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>
                      {schemaDef.schemaName}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-900 border-purple-900' : 'bg-white/90 border-purple-200'} rounded-xl border p-4 shadow`}>
                    <div className={`text-xs mb-2 font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Version</div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>v{schemaDef.version}</div>
                  </div>
                  <div>
                    <div className={`text-xs mb-2 font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Schema Definition</div>
                    <div className={`${isDarkMode ? 'bg-gray-900 border-purple-900' : 'bg-white rounded-xl border-purple-200'} rounded-xl border p-4 max-h-64 overflow-y-auto w-full shadow`}>
                      <pre className={`text-xs font-mono whitespace-pre-wrap ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>
                        {JSON.stringify(schemaDef, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchemasList; 