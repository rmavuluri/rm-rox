import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SchemasList = () => {
  const [schemas, setSchemas] = useState([]);
  // Default: first schema, first version
  const [selectedSchemaIdx, setSelectedSchemaIdx] = useState(0);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  // If no real data, use mock schemas with at least 3 versions for demo
  const mockSchemas = [
    {
      name: 'customers-profiles',
      lobName: 'Test',
      onboardType: 'Direct Producer',
      versions: [
        {
          version: '1.0.0',
          environment: 'DEV',
          schema: {
            title: 'customers-profiles',
            type: 'object',
            properties: {
              id: { type: 'string' },
              domain: { type: 'string' },
              subDomain: { type: 'string' },
              environment: { type: 'string' },
              lobName: { type: 'string' },
              onboardType: { type: 'string' },
              volumeOfEvents: { type: 'string' },
            },
            required: ['id', 'domain', 'subDomain', 'environment', 'lobName', 'onboardType', 'volumeOfEvents'],
          },
        },
        {
          version: '2.0.0',
          environment: 'QA',
          schema: {
            title: 'customers-profiles',
            type: 'object',
            properties: {
              id: { type: 'string' },
              domain: { type: 'string' },
              subDomain: { type: 'string' },
              environment: { type: 'string' },
              lobName: { type: 'string' },
              onboardType: { type: 'string' },
              volumeOfEvents: { type: 'string' },
              isActive: { type: 'boolean' },
              lastUpdated: { type: 'string', format: 'date-time' },
            },
            required: ['id', 'domain', 'subDomain', 'environment', 'lobName', 'onboardType', 'volumeOfEvents', 'isActive'],
          },
        },
      ],
    },
    {
      name: 'User',
      lobName: 'User Management',
      onboardType: 'Direct Producer',
      versions: [
        {
          version: '1.0.0',
          environment: 'dev',
          schema: {
            title: 'User',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
            },
            required: ['id', 'name', 'email'],
          },
        },
        {
          version: '1.1.0',
          environment: 'qa',
          schema: {
            title: 'User',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              isActive: { type: 'boolean' },
            },
            required: ['id', 'name', 'email'],
          },
        },
        {
          version: '2.0.0',
          environment: 'prod',
          schema: {
            title: 'User',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              isActive: { type: 'boolean' },
              lastLogin: { type: 'string', format: 'date-time' },
            },
            required: ['id', 'name', 'email'],
          },
        },
      ],
    },
    {
      name: 'Product',
      lobName: 'Product Catalog',
      onboardType: 'Direct Producer',
      versions: [
        {
          version: '2.0.0',
          environment: 'dev',
          schema: {
            title: 'Product',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              price: { type: 'number' },
            },
            required: ['id', 'name', 'price'],
          },
        },
        {
          version: '2.1.0',
          environment: 'qa',
          schema: {
            title: 'Product',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              price: { type: 'number' },
              tags: { type: 'array', items: { type: 'string' } },
            },
            required: ['id', 'name', 'price'],
          },
        },
        {
          version: '3.0.0',
          environment: 'prod',
          schema: {
            title: 'Product',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              price: { type: 'number' },
              tags: { type: 'array', items: { type: 'string' } },
              inStock: { type: 'boolean' },
            },
            required: ['id', 'name', 'price'],
          },
        },
      ],
    },
  ];

  // Load schemas from localStorage
  useEffect(() => {
    const loadSchemas = () => {
      const schemasData = JSON.parse(localStorage.getItem('schemas_data') || '[]');
      if (schemasData.length === 0) {
        setSchemas(mockSchemas);
        return;
      }
      // Group schemas by name (domain-subdomain) and combine versions
      const groupedSchemas = schemasData.reduce((acc, schema) => {
        const existingSchema = acc.find(s => s.name === schema.name);
        if (existingSchema) {
          // Add as a new version if environment is different
          const versionExists = existingSchema.versions.some(v => v.environment === schema.environment);
          if (!versionExists) {
            existingSchema.versions.push({
              version: `${existingSchema.versions.length + 1}.0.0`,
              schema: schema.versions[0].schema,
              environment: schema.environment,
            });
          }
        } else {
          acc.push({
            name: schema.name,
            versions: schema.versions.map(v => ({
              ...v,
              environment: schema.environment,
            })),
            domain: schema.domain,
            subDomain: schema.subDomain,
            lobName: schema.lobName,
            onboardType: schema.onboardType,
            createdAt: schema.createdAt,
          });
        }
        return acc;
      }, []);
      setSchemas(groupedSchemas);
    };
    loadSchemas();
    // Listen for storage changes to update the list
    const handleStorageChange = () => {
      loadSchemas();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSchemaClick = (idx) => {
    setSelectedSchemaIdx(idx);
    setSelectedVersionIdx(0);
  };

  const handleVersionClick = (vIdx) => {
    setAnimating(true);
    setSelectedVersionIdx(vIdx);
    setTimeout(() => setAnimating(false), 350);
  };

  const handleArrow = (dir) => {
    if (!schemas.length) return;
    const versions = schemas[selectedSchemaIdx].versions;
    let newIdx = selectedVersionIdx + dir;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= versions.length) newIdx = versions.length - 1;
    if (newIdx !== selectedVersionIdx) {
      setAnimating(true);
      setSelectedVersionIdx(newIdx);
      setTimeout(() => setAnimating(false), 350);
    }
  };

  if (schemas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Schemas Found</h2>
          <p className="text-gray-500">No schemas have been onboarded yet. Use the Onboarding Form to create schemas.</p>
        </div>
      </div>
    );
  }

  const selectedSchema = schemas[selectedSchemaIdx];
  const selectedVersion = selectedSchema.versions[selectedVersionIdx];

  return (
    <div className="flex gap-8 w-full min-h-[70vh]">
      {/* Left column: schema names and versions */}
      <div className="w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
        <h2 className="text-xl font-bold text-purple-700 mb-2">Schemas</h2>
        <div className="flex flex-col gap-2">
          {schemas.map((schema, idx) => (
            <div key={schema.name}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors ${
                  idx === selectedSchemaIdx ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleSchemaClick(idx)}
              >
                <div className="flex flex-col">
                  <span className="font-bold">{schema.name}</span>
                  <span className="text-xs text-gray-500">{schema.lobName} • {schema.onboardType}</span>
                </div>
              </button>
              {/* Versions */}
              {idx === selectedSchemaIdx && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {schema.versions.map((v, vIdx) => (
                    <button
                      key={v.version}
                      className={`px-2 py-1 text-sm rounded transition-colors ${
                        vIdx === selectedVersionIdx
                          ? 'bg-purple-600 text-white font-bold'
                          : 'hover:bg-purple-50 text-purple-700'
                      }`}
                      onClick={() => handleVersionClick(vIdx)}
                    >
                      v{v.version} ({v.environment})
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Right column: schema JSON */}
      <div className="w-2/3 bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-purple-700">{selectedSchema.name} Schema</h2>
            <p className="text-sm text-gray-500">{selectedSchema.lobName} • {selectedSchema.onboardType}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 font-mono">v{selectedVersion.version}</span>
            <div className="text-xs text-gray-400">{selectedVersion.environment}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleArrow(-1)}
            disabled={selectedVersionIdx === 0}
            className={`p-2 rounded-full border border-gray-300 bg-gray-50 hover:bg-purple-100 transition-all ${selectedVersionIdx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {selectedSchema.versions.map((v, vIdx) => (
              <button
                key={v.version}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                  vIdx === selectedVersionIdx
                    ? 'bg-purple-600 text-white font-bold'
                    : 'hover:bg-purple-50 text-purple-700'
                }`}
                onClick={() => handleVersionClick(vIdx)}
              >
                v{v.version}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleArrow(1)}
            disabled={selectedVersionIdx === selectedSchema.versions.length - 1}
            className={`p-2 rounded-full border border-gray-300 bg-gray-50 hover:bg-purple-100 transition-all ${selectedVersionIdx === selectedSchema.versions.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className={`flex-1 overflow-auto max-h-[75vh] bg-gray-50 rounded-lg p-4 border border-gray-100 transition-all duration-300 ${animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <pre className="text-xs md:text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(selectedVersion.schema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemasList; 