import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder, Eye } from 'lucide-react';
import DiffViewer from 'react-diff-viewer-continued';
import { useProducers } from '../hooks/useProducers';
import { useConsumers } from '../hooks/useConsumers';
import ReactFlow from 'react-flow-renderer';
import { useTheme } from '../hooks/ThemeContext';

function generateFlowElements(topic) {
  const nodes = [];
  const edges = [];
  
  // Topic node (center)
  const topicId = `topic-${topic.topicName}`;
  nodes.push({
    id: topicId,
    type: 'default',
    data: { label: `${topic.domain} / ${topic.subdomain}` },
    position: { x: 300, y: 100 },
    style: { background: '#fff3cd', border: '2px solid #856404', borderRadius: 8 }
  });

  // Producer nodes (left side)
  (topic.producers || []).forEach((p, i) => {
    const producerId = `producer-${p.id}`;
    nodes.push({
      id: producerId,
      type: 'input',
      data: { label: p.lob_name || p.lobName || p.name },
      position: { x: 60, y: 50 + i * 60 },
      style: { background: '#cce5ff', border: '2px solid #004085', borderRadius: 8 }
    });
    edges.push({ 
      id: `e-${producerId}-${topicId}`, 
      source: producerId, 
      target: topicId, 
      animated: true,
      style: { stroke: '#004085', strokeWidth: 2 }
    });
  });

  // Consumer nodes (right side)
  (topic.consumers || []).forEach((c, i) => {
    const consumerId = `consumer-${c.id}`;
    nodes.push({
      id: consumerId,
      type: 'output',
      data: { label: c.lob_name || c.lobName || c.name },
      position: { x: 540, y: 50 + i * 60 },
      style: { background: '#d4edda', border: '2px solid #155724', borderRadius: 8 }
    });
    edges.push({ 
      id: `e-${topicId}-${consumerId}`, 
      source: topicId, 
      target: consumerId, 
      animated: true,
      style: { stroke: '#155724', strokeWidth: 2 }
    });
  });

  return { nodes, edges };
}

const Topics = () => {
  const { isDarkMode } = useTheme();
  const [topics, setTopics] = useState([]); // [{ topicName, domain, subdomain, environment, schemas }]
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTopicForFlow, setSelectedTopicForFlow] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [schemaVersions, setSchemaVersions] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]); // [{id, version, schema_json}]
  const [showDiff, setShowDiff] = useState(false);

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

  const handleTopicFlowClick = (topic) => {
    setSelectedTopicForFlow(topic);
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
    // Mock versions - in real app, fetch from API
    setSchemaVersions([
      { id: 1, version: '1.0.0', schema_json: JSON.stringify(schema, null, 2) },
      { id: 2, version: '1.1.0', schema_json: JSON.stringify({ ...schema, newField: 'value' }, null, 2) },
      { id: 3, version: '2.0.0', schema_json: JSON.stringify({ ...schema, majorChange: true }, null, 2) }
    ]);
  };

  const handleVersionSelect = (ver) => {
    setSelectedVersions(prev => {
      const exists = prev.find(v => v.id === ver.id);
      if (exists) {
        return prev.filter(v => v.id !== ver.id);
      } else {
        return [...prev, ver];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedVersions([]);
    setShowDiff(false);
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      setShowDiff(true);
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.topicName.toLowerCase().includes(search.toLowerCase()) ||
    topic.domain.toLowerCase().includes(search.toLowerCase()) ||
    topic.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  const { producers } = useProducers();
  const { consumers } = useConsumers();

  // Group producers and consumers by topic
  const topicGroups = filteredTopics.map(topic => {
    const topicProducers = producers.filter(p => {
      const producerTopics = Array.isArray(p.topic_name) ? p.topic_name : 
                           (typeof p.topic_name === 'string' ? [p.topic_name] : []);
      return producerTopics.some(t => t.toLowerCase().includes(topic.topicName.toLowerCase()));
    });

    const topicConsumers = consumers.filter(c => {
      const consumerTopics = Array.isArray(c.topic_name) ? c.topic_name : 
                           (typeof c.topic_name === 'string' ? [c.topic_name] : []);
      return consumerTopics.some(t => t.toLowerCase().includes(topic.topicName.toLowerCase()));
    });

    return {
      ...topic,
      producers: topicProducers,
      consumers: topicConsumers
    };
  });

  // Generate flow elements for selected topic
  const flowElements = selectedTopicForFlow ? generateFlowElements(selectedTopicForFlow) : { nodes: [], edges: [] };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Topics
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            aria-label="Search topics"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics List */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Available Topics
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredTopics.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No topics found
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {topicGroups.map((topic) => (
                  <div
                    key={topic.topicName}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Folder size={20} className="text-blue-500" aria-hidden="true" />
                        <div className="flex-1">
                          <div className="font-medium">{topic.topicName}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {topic.domain} / {topic.subdomain} ({topic.environment})
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {topic.producers.length} producers, {topic.consumers.length} consumers
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTopicFlowClick(topic)}
                          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            selectedTopicForFlow?.topicName === topic.topicName
                              ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                          }`}
                          aria-label={`View flow diagram for ${topic.topicName}`}
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleTopicClick(topic)}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-400"
                          aria-label={`View details for topic ${topic.topicName}`}
                        >
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flow Diagram */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Data Flow Diagram
              {selectedTopicForFlow && (
                <span className={`ml-2 text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  - {selectedTopicForFlow.topicName}
                </span>
              )}
            </h2>
          </div>
          <div className="h-96">
            {selectedTopicForFlow ? (
              <ReactFlow
                nodes={flowElements.nodes}
                edges={flowElements.edges}
                fitView
                className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
                aria-label={`Data flow diagram for ${selectedTopicForFlow.topicName} showing producers, topics, and consumers`}
              />
            ) : (
              <div className={`h-full flex items-center justify-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="text-center">
                  <Eye size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p>Select a topic to view its flow diagram</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Details Slider */}
      {isSliderOpen && selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className={`w-1/2 h-full overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {selectedTopic.topicName}
                </h2>
                <button
                  onClick={handleSliderClose}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  aria-label="Close topic details"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Topic Info */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Topic Information
                  </h3>
                  <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div><strong>Domain:</strong> {selectedTopic.domain}</div>
                    <div><strong>Subdomain:</strong> {selectedTopic.subdomain}</div>
                    <div><strong>Environment:</strong> {selectedTopic.environment}</div>
                    <div><strong>Schemas:</strong> {selectedTopic.schemas.length}</div>
                  </div>
                </div>

                {/* Schemas */}
                <div>
                  <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Schemas
                  </h3>
                  <div className="space-y-2">
                    {selectedTopic.schemas.map((schema, index) => (
                      <button
                        key={index}
                        onClick={() => handleSchemaClick(schema)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'border-gray-600 hover:bg-gray-700 text-gray-100' 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                        }`}
                        aria-label={`View schema ${schema.name || schema.id}`}
                      >
                        <div className="font-medium">{schema.name || `Schema ${index + 1}`}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Version: {schema.version || '1.0.0'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schema Versions */}
                {selectedSchema && schemaVersions.length > 0 && (
                  <div>
                    <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      Schema Versions
                    </h3>
                    <div className="space-y-2 mb-4">
                      {schemaVersions.map((version) => (
                        <label
                          key={version.id}
                          className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                            isDarkMode 
                              ? 'border-gray-600 hover:bg-gray-700' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedVersions.some(v => v.id === version.id)}
                            onChange={() => handleVersionSelect(version)}
                            className="rounded focus:ring-2 focus:ring-blue-500"
                            aria-label={`Select version ${version.version} for comparison`}
                          />
                          <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            Version {version.version}
                          </span>
                        </label>
                      ))}
                    </div>

                    {selectedVersions.length === 2 && (
                      <div className="space-x-2">
                        <button
                          onClick={handleCompare}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Compare selected versions"
                        >
                          Compare Versions
                        </button>
                        <button
                          onClick={handleClearSelection}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Clear version selection"
                        >
                          Clear Selection
                        </button>
                      </div>
                    )}

                    {showDiff && selectedVersions.length === 2 && (
                      <div className="mt-4">
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                          Version Comparison
                        </h4>
                        <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                          <DiffViewer
                            oldValue={selectedVersions[0].schema_json}
                            newValue={selectedVersions[1].schema_json}
                            splitView={true}
                            useDarkTheme={isDarkMode}
                            aria-label={`Differences between version ${selectedVersions[0].version} and ${selectedVersions[1].version}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics; 