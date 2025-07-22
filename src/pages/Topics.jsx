import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import DiffViewer from 'react-diff-viewer-continued';
import { useProducers } from '../hooks/useProducers';
import { useConsumers } from '../hooks/useConsumers';
import ReactFlow from 'react-flow-renderer';

function generateFlowElements(groups) {
  const nodes = [];
  const edges = [];
  let y = 0;
  groups.forEach((group, groupIdx) => {
    const topicId = `topic-${groupIdx}`;
    nodes.push({
      id: topicId,
      type: 'default',
      data: { label: `${group.domain} / ${group.subdomain}` },
      position: { x: 300, y: y + 60 },
      style: { background: '#fff3cd', border: '2px solid #856404', borderRadius: 8 }
    });
    (group.producers || []).forEach((p, i) => {
      const producerId = `producer-${p.id}`;
      nodes.push({
        id: producerId,
        type: 'input',
        data: { label: p.lob_name || p.lobName || p.name },
        position: { x: 60, y: y + 30 + i * 60 },
        style: { background: '#cce5ff', border: '2px solid #004085', borderRadius: 8 }
      });
      edges.push({ id: `e-${producerId}-${topicId}`, source: producerId, target: topicId, animated: true });
    });
    (group.consumers || []).forEach((c, i) => {
      const consumerId = `consumer-${c.id}`;
      nodes.push({
        id: consumerId,
        type: 'output',
        data: { label: c.lob_name || c.lobName || c.name },
        position: { x: 540, y: y + 30 + i * 60 },
        style: { background: '#d4edda', border: '2px solid #155724', borderRadius: 8 }
      });
      edges.push({ id: `e-${topicId}-${consumerId}`, source: topicId, target: consumerId, animated: true });
    });
    y += Math.max((group.producers?.length || 1), (group.consumers?.length || 1)) * 80;
  });
  return { nodes, edges };
}

const Topics = () => {
  const [topics, setTopics] = useState([]); // [{ topicName, domain, subdomain, environment, schemas }]
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
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

  // Handle version checkbox
  const handleVersionSelect = (ver) => {
    setShowDiff(false);
    setSelectedVersions(prev => {
      if (prev.some(v => v.id === ver.id)) {
        return prev.filter(v => v.id !== ver.id);
      } else if (prev.length < 2) {
        return [...prev, ver];
      } else {
        return prev;
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

  // Inside Topics component
  const { producers, loading: loadingProducers } = useProducers();
  const { consumers, loading: loadingConsumers } = useConsumers();

  // Group mapping by (domain, subdomain)
  const mapping = React.useMemo(() => {
    const map = {};
    (producers || []).forEach(p => {
      const domain = p.domain || p.Domain || p.domain_name || '';
      const subdomain = p.subDomain || p.subdomain || p.SubDomain || p.sub_domain || '';
      const key = `${domain}||${subdomain}`;
      if (!map[key]) map[key] = { domain, subdomain, producers: [], consumers: [] };
      map[key].producers.push(p);
    });
    (consumers || []).forEach(c => {
      const domain = c.domain || c.Domain || c.domain_name || '';
      const subdomain = c.subDomain || c.subdomain || c.SubDomain || c.sub_domain || '';
      const key = `${domain}||${subdomain}`;
      if (!map[key]) map[key] = { domain, subdomain, producers: [], consumers: [] };
      map[key].consumers.push(c);
    });
    // Show groups with at least one producer OR one consumer
    return Object.values(map).filter(g => g.producers.length || g.consumers.length);
  }, [producers, consumers]);

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

      {/* Right column - Producers && Consumers Mapping */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-120px)]">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Producers &amp;&amp; Consumers Mapping</h2>
          <p className="text-sm text-gray-600 mb-4">Mapping between producers and consumers will be shown here.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {(loadingProducers || loadingConsumers) ? (
            <div className="text-gray-400 text-center py-8">Loading...</div>
          ) : mapping.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No mappings found.</div>
          ) : (
            <>
              <div className="space-y-4">
                {mapping.map((group, idx) => {
                  const { nodes, edges } = generateFlowElements([group]);
                  console.log('ReactFlow nodes:', nodes, 'edges:', edges);
                  return (
                    <details key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <summary className="font-semibold cursor-pointer flex items-center gap-2">
                        <span className="text-blue-700">{group.domain || <em>"(no domain)"</em>}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-green-700">{group.subdomain || <em>"(no subdomain)"</em>}</span>
                      </summary>
                      <div className="mt-3 flex gap-8 flex-wrap">
                        <div>
                          <div className="font-bold text-blue-800 mb-1">Producers</div>
                          <ul className="list-disc ml-5">
                            {group.producers.map(p => (
                              <li key={p.id}>{p.lob_name || p.lobName || p.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-bold text-green-800 mb-1">Consumers</div>
                          <ul className="list-disc ml-5">
                            {group.consumers.map(c => (
                              <li key={c.id}>{c.lob_name || c.lobName || c.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* React Flow Diagram for this group */}
                      <div className="mt-6 w-full">
                        <h4 className="text-base font-semibold mb-1">Graphical Representation</h4>
                        <div style={{ width: '100%', minHeight: 200, height: 240, background: '#f8fafc', borderRadius: 8 }}>
                          <ReactFlow nodes={nodes} edges={edges} fitView />
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </>
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
                                      <summary className="font-semibold cursor-pointer flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={selectedVersions.some(v => v.id === ver.id)}
                                          onChange={() => handleVersionSelect(ver)}
                                          disabled={selectedVersions.length === 2 && !selectedVersions.some(v => v.id === ver.id)}
                                          className="accent-blue-600 w-4 h-4"
                                        />
                                        {ver.version}
                                      </summary>
                                      <pre className="text-xs font-mono whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded">
                                        {JSON.stringify(ver.schema_json, null, 2)}
                                      </pre>
                                    </details>
                                  ))}
                                </div>
                               {selectedVersions.length > 0 && (
                                 <div className="flex items-center gap-3 mt-3">
                                   <button
                                     className={`px-4 py-2 rounded bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition-all ${selectedVersions.length === 2 ? '' : 'opacity-50 cursor-not-allowed'}`}
                                     onClick={handleCompare}
                                     disabled={selectedVersions.length !== 2}
                                   >
                                     Compare Selected
                                   </button>
                                   <button
                                     className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                                     onClick={handleClearSelection}
                                   >
                                     Clear Selection
                                   </button>
                                 </div>
                               )}
                               {showDiff && selectedVersions.length === 2 && (
                                 <div className="mt-6 p-4 bg-white border border-blue-200 rounded-xl shadow">
                                   <div className="font-semibold text-blue-900 mb-2">Schema Diff</div>
                                   <div className="overflow-x-auto text-sm">
                                     <DiffViewer
                                       oldValue={JSON.stringify(selectedVersions[0].schema_json, null, 2)}
                                       newValue={JSON.stringify(selectedVersions[1].schema_json, null, 2)}
                                       splitView={true}
                                       hideLineNumbers={false}
                                       showDiffOnly={false}
                                       leftTitle={`Version ${selectedVersions[0].version}`}
                                       rightTitle={`Version ${selectedVersions[1].version}`}
                                     />
                                   </div>
                                 </div>
                               )}
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