import React, { useState } from 'react';

// Mock schema data
const schemas = [
  {
    name: 'User',
    versions: [
      {
        version: '1.0.0',
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
    ],
  },
  {
    name: 'Product',
    versions: [
      {
        version: '2.0.0',
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
    ],
  },
];

const SchemasList = () => {
  // Default: first schema, first version
  const [selectedSchemaIdx, setSelectedSchemaIdx] = useState(0);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(0);

  const handleSchemaClick = (idx) => {
    setSelectedSchemaIdx(idx);
    setSelectedVersionIdx(0);
  };

  const handleVersionClick = (vIdx) => {
    setSelectedVersionIdx(vIdx);
  };

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
                {schema.name}
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
                      v{v.version}
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
          <h2 className="text-xl font-bold text-purple-700">{selectedSchema.name} Schema</h2>
          <span className="text-sm text-gray-500 font-mono">v{selectedVersion.version}</span>
        </div>
        <div className="flex-1 overflow-auto max-h-[75vh] bg-gray-50 rounded-lg p-4 border border-gray-100">
          <pre className="text-xs md:text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(selectedVersion.schema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemasList; 