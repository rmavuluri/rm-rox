import React, { useState, useEffect } from 'react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';

// Mock data - in real app this would come from localStorage or API
const mockTopicsData = [
  {
    id: 1,
    name: 'Customer Management',
    domain: 'customers',
    subdomains: ['profiles', 'relationships', 'preferences', 'history']
  },
  {
    id: 2,
    name: 'Product Catalog',
    domain: 'products',
    subdomains: ['inventory', 'categories', 'pricing', 'reviews']
  },
  {
    id: 3,
    name: 'Order Processing',
    domain: 'orders',
    subdomains: ['checkout', 'payment', 'shipping', 'tracking']
  },
  {
    id: 4,
    name: 'User Authentication',
    domain: 'auth',
    subdomains: ['login', 'registration', 'permissions', 'sessions']
  },
  {
    id: 5,
    name: 'Analytics Dashboard',
    domain: 'analytics',
    subdomains: ['reports', 'metrics', 'insights', 'forecasting']
  }
];

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [expandedSubdomains, setExpandedSubdomains] = useState(new Set());
  const [selectedVersions, setSelectedVersions] = useState({});

  // Mock schema data for subdomains - in real app this would come from API or localStorage
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

  const getAvailableVersions = () => {
    return ['1.0.0', '1.1.0', '2.0.0'];
  };

  useEffect(() => {
    // Load topics from localStorage or use mock data
    const loadTopics = () => {
      // Try to get from localStorage first (from onboarding form data)
      const producersData = JSON.parse(localStorage.getItem('producers_data') || '[]');
      const consumersData = JSON.parse(localStorage.getItem('consumers_data') || '[]');
      
      const allData = [...producersData, ...consumersData];
      
      if (allData.length > 0) {
        // Group by domain and create topics
        const topicsMap = new Map();
        
        allData.forEach(item => {
          const domain = item.domain;
          const subDomain = item.subDomain;
          
          if (!topicsMap.has(domain)) {
            topicsMap.set(domain, {
              id: domain,
              name: domain.charAt(0).toUpperCase() + domain.slice(1),
              domain: domain,
              subdomains: []
            });
          }
          
          const topic = topicsMap.get(domain);
          if (!topic.subdomains.includes(subDomain)) {
            topic.subdomains.push(subDomain);
          }
        });
        
        setTopics(Array.from(topicsMap.values()));
      } else {
        // Use mock data if no real data exists
        setTopics(mockTopicsData);
      }
    };
    
    loadTopics();
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setIsSliderOpen(true);
  };

  const handleSliderClose = () => {
    setIsSliderOpen(false);
    setSelectedTopic(null);
    setExpandedSubdomains(new Set());
  };

  const toggleSubdomain = (subdomain) => {
    setExpandedSubdomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subdomain)) {
        newSet.delete(subdomain);
      } else {
        newSet.add(subdomain);
      }
      return newSet;
    });
  };

  const handleSubdomainClick = (subdomain) => {
    toggleSubdomain(subdomain);
  };

  const handleVersionClick = (subdomain, version) => {
    setSelectedVersions(prev => ({
      ...prev,
      [subdomain]: version
    }));
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left column - Topics list */}
      <div className="w-[350px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-120px)]">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Topics</h2>
          <p className="text-sm text-gray-600">Select a topic to view details</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg mb-2 ${
                selectedTopic?.id === topic.id 
                  ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-l-4 border-purple-500 shadow-sm' 
                  : 'text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-base">{topic.name}</div>
                <div className={`w-2 h-2 rounded-full ${
                  selectedTopic?.id === topic.id ? 'bg-purple-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {topic.subdomains.length} subdomain{topic.subdomains.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-400 mt-1 capitalize">
                Domain: {topic.domain}
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
          <h2 className="text-xl font-bold text-gray-800">
            {selectedTopic?.name}
          </h2>
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
                
                {/* Subdomains */}
                <div className="ml-9 space-y-2">
                  {selectedTopic.subdomains.map((subdomain) => (
                    <div key={subdomain} className="space-y-2">
                      <div 
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => handleSubdomainClick(subdomain)}
                      >
                        <ChevronRight 
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            expandedSubdomains.has(subdomain) ? 'rotate-90' : ''
                          }`}
                        />
                        <span className="text-base text-gray-700 capitalize font-medium">{subdomain}</span>
                      </div>
                      
                      {/* Expanded Schema Content */}
                      {expandedSubdomains.has(subdomain) && (
                        <div className="ml-7 bg-gray-50 rounded-lg p-4 border border-gray-200 w-full">
                          <div className="space-y-3 mb-4">
                            {/* Schema Name */}
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <div className="text-xs text-gray-500 mb-1">Schema Name</div>
                              <div className="text-sm font-mono text-gray-800">
                                {getSubdomainSchema(selectedTopic.domain, subdomain).schemaName}
                              </div>
                            </div>
                            
                            {/* Version */}
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <div className="text-xs text-gray-500 mb-2">Version</div>
                              <div className="flex gap-2">
                                {getAvailableVersions().map((version) => (
                                  <button
                                    key={version}
                                    onClick={() => handleVersionClick(subdomain, version)}
                                    className={`px-3 py-1 text-xs rounded border transition-colors ${
                                      selectedVersions[subdomain] === version
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    v{version}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Schema Definition */}
                            <div>
                              <div className="text-xs text-gray-500 mb-2">Schema Definition</div>
                              <div className="bg-white rounded border border-gray-200 p-4 max-h-64 overflow-y-auto w-full">
                                <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap">
                                  {JSON.stringify(getSubdomainSchema(selectedTopic.domain, subdomain, selectedVersions[subdomain] || '1.0.0'), null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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