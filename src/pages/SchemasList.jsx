import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Layers, Plus, X } from 'lucide-react';
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
    { domain: 'products', subdomain: 'reviews' }
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
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [current, setCurrent] = useState(null); // { schema, version }
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ environment: '', domain: '', subdomain: '', namespace: '', version: '', schema_json: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [schemaVersions, setSchemaVersions] = useState([]);
  const [addVersionOpen, setAddVersionOpen] = useState(false);
  const [versionForm, setVersionForm] = useState({ version: '', schema_json: '' });
  const [versionError, setVersionError] = useState('');
  const [versionSuccess, setVersionSuccess] = useState('');
  const [versionSubmitting, setVersionSubmitting] = useState(false);

  // Fetch schemas from API
  const fetchSchemas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schemas');
      const data = await res.json();
      setSchemas(data);
    } catch (err) {
      setSchemas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemas();
  }, []);

  // For slider navigation
  const flatSchemas = schemas.flatMap(s => VERSIONS.map(version => ({ ...s, version })));
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

  // Open slider and fetch versions for a schema
  const handleOpenSlider = async (schema) => {
    setCurrent({ schema, version: null });
    setSliderOpen(true);
    try {
      const res = await fetch(`/api/schemas/${schema.id}`);
      const data = await res.json();
      setSchemaVersions(data.versions || []);
    } catch {
      setSchemaVersions([]);
    }
  };

  // Compute schema name preview
  const schemaNamePreview = form.environment && form.domain && form.subdomain
    ? `ebeh-ob-${form.environment}-${form.domain}-${form.subdomain}-schema`
    : '';

  const handleCreateSchema = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.environment || !form.domain || !form.subdomain || !form.version || !form.schema_json) {
      setFormError('Environment, Domain, Subdomain, Version, and Schema JSON are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/schemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment: form.environment,
          domain: form.domain,
          subdomain: form.subdomain,
          namespace: form.namespace,
          version: form.version,
          schema_json: JSON.parse(form.schema_json)
        })
      });
      if (res.status === 500) {
        const data = await res.json();
        if (data.error && data.error.includes('duplicate key value')) {
          setFormError('Schema already exists for this Environment, Domain, and Subdomain. To add a new version, use the Add Version button in the schema details.');
        } else {
          setFormError('Server error.');
        }
        return;
      }
      if (!res.ok) throw new Error('Failed to create schema');
      setFormSuccess('Schema created successfully!');
      setForm({ environment: '', domain: '', subdomain: '', namespace: '', version: '', schema_json: '' });
      setTimeout(() => { setCreateOpen(false); setFormSuccess(''); fetchSchemas(); }, 1200);
    } catch (err) {
      setFormError('Invalid JSON or server error.');
    } finally {
      setSubmitting(false);
    }
  };

  // Add version to existing schema
  const handleAddVersion = async (e) => {
    e.preventDefault();
    setVersionError('');
    setVersionSuccess('');
    if (!versionForm.version || !versionForm.schema_json) {
      setVersionError('Version and Schema JSON are required.');
      return;
    }
    setVersionSubmitting(true);
    try {
      const res = await fetch(`/api/schemas/${current.schema.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: versionForm.version,
          schema_json: JSON.parse(versionForm.schema_json)
        })
      });
      if (res.status === 500) {
        const data = await res.json();
        if (data.error && data.error.includes('duplicate key value')) {
          setVersionError('This version already exists for the selected schema.');
        } else {
          setVersionError('Server error.');
        }
        return;
      }
      if (!res.ok) throw new Error('Failed to add version');
      setVersionSuccess('Version added successfully!');
      setVersionForm({ version: '', schema_json: '' });
      // Refresh versions
      const res2 = await fetch(`/api/schemas/${current.schema.id}`);
      const data2 = await res2.json();
      setSchemaVersions(data2.versions || []);
      setTimeout(() => { setAddVersionOpen(false); setVersionSuccess(''); }, 1200);
    } catch (err) {
      setVersionError('Invalid JSON or server error.');
    } finally {
      setVersionSubmitting(false);
    }
  };

  const schemaDef = current ? getSubdomainSchema(current.domain, current.subdomain, current.version) : null;

  return (
    <div className={`h-full w-full flex flex-col bg-gradient-to-br ${isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-blue-50 via-white to-blue-100'}`}>
      <div className={`w-full bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-120px)] mx-4 my-4`}>
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3 mb-1">
            <Layers className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`} />
            <h1 className={`text-xl font-bold text-gray-800`}>Schemas List</h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">View and manage all schemas in the system</p>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition-colors ${isDarkMode ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={18} /> Create Schema
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <table className={`w-full text-left rounded-xl overflow-hidden font-sans ${isDarkMode ? 'bg-gray-900' : ''}`}>
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-800 text-blue-200' : 'bg-gradient-to-r from-blue-100 to-blue-50 text-gray-700'} text-base font-semibold`}>
                <th className="py-3 px-4 font-bold">Schema Name</th>
                <th className="py-3 px-4 font-bold">Environment</th>
                <th className="py-3 px-4 font-bold">Domain</th>
                <th className="py-3 px-4 font-bold">Subdomain</th>
                <th className="py-3 px-4 font-bold">Namespace</th>
                <th className="py-3 px-4 font-bold">Versions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 font-sans">Loading...</td></tr>
              ) : schemas.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500 font-sans">No schemas found</td></tr>
              ) : (
                schemas.map(schema => (
                  <tr key={schema.id} className={`border-b last:border-b-0 transition-all group font-sans hover:bg-gray-50/40`}>
                    <td className={`py-3 px-4 font-semibold text-lg group-hover:text-blue-400 text-gray-900`}>{schema.name}</td>
                    <td className={`py-3 px-4 text-base group-hover:text-blue-400 text-gray-800`}>{schema.environment || '-'}</td>
                    <td className={`py-3 px-4 text-base group-hover:text-blue-400 text-gray-800`}>{schema.domain || '-'}</td>
                    <td className={`py-3 px-4 text-base group-hover:text-blue-400 text-gray-800`}>{schema.subdomain || '-'}</td>
                    <td className={`py-3 px-4 text-base group-hover:text-blue-400 text-gray-800`}>{schema.namespace || '-'}</td>
                    <td className="py-3 px-4">
                      <button
                        className="px-3 py-1 rounded-full border font-semibold text-sm flex items-center gap-1 shadow-sm transition-all bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300"
                        onClick={() => handleOpenSlider(schema)}
                      >
                        View Versions
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Schema Details Slider */}
      <div
        className={`fixed top-0 right-0 h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          sliderOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'}`}
        style={{ width: '70vw', maxWidth: '900px', minWidth: '400px' }}
        onClick={e => e.stopPropagation()}
      >
        {sliderOpen && current && (
          <>
            <div className={`flex items-center justify-between p-6 border-b shadow-md rounded-t-2xl ${isDarkMode ? 'border-blue-900 bg-gray-900/80' : 'border-blue-200 bg-white/80'}`}>
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{current.schema.name}</span>
              <button onClick={() => setSliderOpen(false)} className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Schema Name:</div>
                  <div className={`text-base font-mono ${isDarkMode ? 'text-blue-100' : 'text-gray-800'}`}>{current.schema.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Namespace:</div>
                  <div className={`text-base font-mono ${isDarkMode ? 'text-blue-100' : 'text-gray-800'}`}>{current.schema.namespace || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Environment:</div>
                  <div className={`text-base font-mono ${isDarkMode ? 'text-blue-100' : 'text-gray-800'}`}>{current.schema.environment || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Domain:</div>
                  <div className={`text-base font-mono ${isDarkMode ? 'text-blue-100' : 'text-gray-800'}`}>{current.schema.domain || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Subdomain:</div>
                  <div className={`text-base font-mono ${isDarkMode ? 'text-blue-100' : 'text-gray-800'}`}>{current.schema.subdomain || '-'}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                  <span>Versions:</span>
                  <button
                    className={`ml-2 px-3 py-1 rounded border text-sm font-semibold shadow-sm transition-all ${isDarkMode ? 'bg-blue-900 text-white hover:bg-blue-800 border-blue-800' : 'bg-blue-100 text-blue-900 hover:bg-blue-200 border-blue-300'}`}
                    onClick={() => setAddVersionOpen(v => !v)}
                  >
                    {addVersionOpen ? 'Cancel' : 'Add Version'}
                  </button>
                </div>
                {addVersionOpen && (
                  <form className="mb-4 p-4 border rounded-lg bg-white/90" onSubmit={handleAddVersion}>
                    <div className="mb-2">
                      <label className="block text-sm font-semibold mb-1">Version *</label>
                      <input
                        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={versionForm.version}
                        onChange={e => setVersionForm(f => ({ ...f, version: e.target.value }))}
                        required
                        placeholder="e.g. 1.0.1"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-semibold mb-1">Schema JSON *</label>
                      <textarea
                        className="w-full rounded border px-3 py-2 font-mono min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={versionForm.schema_json}
                        onChange={e => setVersionForm(f => ({ ...f, schema_json: e.target.value }))}
                        required
                        placeholder="Paste your schema JSON here"
                      />
                    </div>
                    {versionError && <div className="text-red-500 text-sm mb-1">{versionError}</div>}
                    {versionSuccess && <div className="text-green-600 text-sm mb-1">{versionSuccess}</div>}
                    <button
                      type="submit"
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${versionSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 text-white'}`}
                      disabled={versionSubmitting}
                    >
                      {versionSubmitting ? 'Adding...' : 'Add Version'}
                    </button>
                  </form>
                )}
                <div className="flex flex-col gap-2">
                  {schemaVersions.length === 0 ? (
                    <div className="text-gray-400">No versions found</div>
                  ) : schemaVersions.map(ver => (
                    <details key={ver.id} className="border rounded-lg p-3 bg-white/80">
                      <summary className="font-semibold cursor-pointer">{ver.version}</summary>
                      <pre className="text-xs font-mono whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded">
                        {JSON.stringify(ver.schema_json, null, 2)}
                      </pre>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Create Schema Slider */}
      <div
        className={`fixed top-0 right-0 h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          createOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'}`}
        style={{ width: '70vw', maxWidth: '900px', minWidth: '400px' }}
        onClick={e => e.stopPropagation()}
      >
        {createOpen && (
          <>
            <div className={`flex items-center justify-between p-6 border-b shadow-md rounded-t-2xl ${isDarkMode ? 'border-blue-900 bg-gray-900/80' : 'border-blue-200 bg-white/80'}`}>
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Schema</span>
              <button onClick={() => setCreateOpen(false)} className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20">
                <X size={22} />
              </button>
            </div>
            <form className="p-6 space-y-6 flex flex-col h-full" onSubmit={handleCreateSchema} style={{minHeight: '400px'}}>
              <div className="flex-1 space-y-6 overflow-y-auto pb-24">
                <div>
                  <label className="block text-sm font-semibold mb-1">Environment *</label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.environment}
                    onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                    required
                    placeholder="e.g. dev, qa, prod"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Domain *</label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.domain}
                    onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                    required
                    placeholder="e.g. customers, products"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Subdomain *</label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.subdomain}
                    onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))}
                    required
                    placeholder="e.g. profiles, inventory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Schema Name</label>
                  <input
                    className="w-full rounded border px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={schemaNamePreview}
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Namespace</label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.namespace}
                    onChange={e => setForm(f => ({ ...f, namespace: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Version *</label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.version}
                    onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Schema JSON *</label>
                  <textarea
                    className="w-full rounded border px-3 py-2 font-mono min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.schema_json}
                    onChange={e => setForm(f => ({ ...f, schema_json: e.target.value }))}
                    required
                    placeholder="Paste your schema JSON here"
                  />
                </div>
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
              </div>
              <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent pt-4 pb-2 z-10">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 text-white'}`}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Schema'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SchemasList;