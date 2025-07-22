import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder } from 'lucide-react';

const Topics = () => {
  const [topics, setTopics] = useState([]); // [{ topicName, domain, subdomain, environment, schemas }]
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [schemaVersions, setSchemaVersions] = useState([]);

  // Fetch schemas and group by (domain, subdomain, environment)
  useEffect(() => {
    const fetchAndGroup = async () => {
      const res = await fetch('/api/schemas');
      const schemas = await res.json();
      // Group schemas by (domain, subdomain, environment)
      const topicMap = new Map();
      schemas.forEach(s => {
        const key = `${s.domain}-${s.subdomain}-${s.environment}`.toLowerCase();
        if (!topicMap.has(key)) {
          topicMap.set(key, {
            topicName: key,
            domain: s.domain,
            subdomain: s.subdomain,
            environment: s.environment,
            schemas: []
          });
        }
        topicMap.get(key).schemas.push(s);
      });
      setTopics(Array.from(topicMap.values()));
    };
    fetchAndGroup();
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setIsSliderOpen(true);
    setSelectedSchema(null);
    setSchemaVersions([]);
  };

  const handleSliderClose = () => {
    setIsSliderOpen(false);
    setSelectedTopic(null);
    setSelectedSchema(null);
    setSchemaVersions([]);
  };

  // Fetch versions for a schema
  const handleSchemaClick = async (schema) => {
    setSelectedSchema(schema);
    try {
      const res = await fetch(`/api/schemas/${schema.id}`);
      const data = await res.json();
      setSchemaVersions(data.versions || []);
    } catch {
      setSchemaVersions([]);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left column - Topics list */}
      <div className="w-[350px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-120px)]">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Topics</h2>
          <p className="text-sm text-gray-600 mb-4">Select a topic to view details</p>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search topic name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {topics
            .filter(topic => topic.topicName.includes(search.toLowerCase()))
            .map((topic) => (
              <button
                key={topic.topicName}
                onClick={() => handleTopicClick(topic)}
                className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg mb-2 ${
                  selectedTopic?.topicName === topic.topicName
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 border-l-4 border-blue-900 shadow-sm'
                    : 'text-gray-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-base">{topic.topicName}</div>
                  <div className={`w-2 h-2 rounded-full ${selectedTopic?.topicName === topic.topicName ? 'bg-blue-900' : 'bg-gray-300'}`}></div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {topic.schemas.length} schema{topic.schemas.length !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          {topics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No topics available</p>
            </div>
          )}
        </div>
      </div>

      {/* Slider overlay */}
      {isSliderOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleSliderClose}
        />
      )}

      {/* Slider panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isSliderOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '750px' }}
      >
        {/* Slider header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Schemas</h2>
          <button
            onClick={handleSliderClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Slider content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {selectedTopic && (
            <div className="space-y-6">
              {/* Tree Structure */}
              <div className="space-y-4">
                {/* Domain */}
                <div className="flex items-center gap-3">
                  <Folder className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-800 capitalize">
                    {selectedTopic.domain}
                  </span>
                </div>
                {/* Subdomain */}
                <div className="ml-9 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg">
                      <span className="text-base text-gray-700 capitalize font-medium">{selectedTopic.subdomain}</span>
                    </div>
                    {/* Schema Content for this topic (env) */}
                    <div className="ml-7 bg-gray-50 rounded-lg p-4 border border-gray-200 w-full">
                      <div className="space-y-6 mb-4">
                        {selectedTopic.schemas.map(schema => (
                          <div key={schema.id} className="mb-4 p-4 bg-white rounded border border-blue-100">
                            <div className="flex flex-col gap-1 mb-1">
                              <span className="font-semibold text-blue-900">{schema.name}</span>
                              <span className="text-xs text-gray-500">Topic Name: <span className="font-mono text-gray-700">{`${schema.domain}-${schema.subdomain}-${schema.environment}`}</span></span>
                            </div>
                            <button
                              className="ml-0 mt-1 px-2 py-1 text-xs rounded border border-blue-300 bg-blue-100 hover:bg-blue-200 text-blue-900 w-fit"
                              onClick={() => handleSchemaClick(schema)}
                              type="button"
                            >
                              View Versions
                            </button>
                            {/* Show versions if this schema is selected */}
                            {selectedSchema && selectedSchema.id === schema.id && schemaVersions.length > 0 && (
                              <div className="ml-4 mt-2">
                                <div className="text-xs text-gray-500 mb-1">Versions:</div>
                                <div className="flex flex-col gap-2">
                                  {schemaVersions.map(ver => (
                                    <details key={ver.id} className="border rounded-lg p-3 bg-white/80">
                                      <summary className="font-semibold cursor-pointer">{ver.version}</summary>
                                      <pre className="text-xs font-mono whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded">
                                        {JSON.stringify(ver.schema_json, null, 2)}
                                      </pre>
                                    </details>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topics; 