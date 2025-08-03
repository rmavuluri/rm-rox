import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/ThemeContext';
import { useProducers } from '../hooks/useProducers';
import { useConsumers } from '../hooks/useConsumers';

// Provided ExpandIcon SVG
export const ExpandIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="28" height="28" {...props}>
    <path d="M408 64L552 64C565.3 64 576 74.7 576 88L576 232C576 241.7 570.2 250.5 561.2 254.2C552.2 257.9 541.9 255.9 535 249L496 210L409 297C399.6 306.4 384.4 306.4 375.1 297L343.1 265C333.7 255.6 333.7 240.4 343.1 231.1L430.1 144.1L391.1 105.1C384.2 98.2 382.2 87.9 385.9 78.9C389.6 69.9 398.3 64 408 64zM232 576L88 576C74.7 576 64 565.3 64 552L64 408C64 398.3 69.8 389.5 78.8 385.8C87.8 382.1 98.1 384.2 105 391L144 430L231 343C240.4 333.6 255.6 333.6 264.9 343L296.9 375C306.3 384.4 306.3 399.6 296.9 408.9L209.9 495.9L248.9 534.9C255.8 541.8 257.8 552.1 254.1 561.1C250.4 570.1 241.7 576 232 576z"/>
  </svg>
);

// Provided ShrinkIcon SVG
export const ShrinkIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="28" height="28" {...props}>
    <path d="M503.5 71C512.9 61.6 528.1 61.6 537.4 71L569.4 103C578.8 112.4 578.8 127.6 569.4 136.9L482.4 223.9L521.4 262.9C528.3 269.8 530.3 280.1 526.6 289.1C522.9 298.1 514.2 304 504.5 304L360.5 304C347.2 304 336.5 293.3 336.5 280L336.5 136C336.5 126.3 342.3 117.5 351.3 113.8C360.3 110.1 370.6 112.1 377.5 119L416.5 158L503.5 71zM136.5 336L280.5 336C293.8 336 304.5 346.7 304.5 360L304.5 504C304.5 513.7 298.7 522.5 289.7 526.2C280.7 529.9 270.4 527.9 263.5 521L224.5 482L137.5 569C128.1 578.4 112.9 578.4 103.6 569L71.6 537C62.2 527.6 62.2 512.4 71.6 503.1L158.6 416.1L119.6 377.1C112.7 370.2 110.7 359.9 114.4 350.9C118.1 341.9 126.8 336 136.5 336z"/>
  </svg>
);

const getLatestActivity = (producers, consumers) => {
  // Find the most recently created producer or consumer
  const all = [
    ...producers.map(p => ({
      type: 'Producer',
      name: p.lob_name || p.lobName,
      domain: p.domain,
      createdAt: new Date(p.created_at || p.createdAt || 0),
    })),
    ...consumers.map(c => ({
      type: 'Consumer',
      name: c.lob_name || c.lobName,
      domain: c.domain,
      createdAt: new Date(c.created_at || c.createdAt || 0),
    })),
  ].filter(x => x.createdAt && !isNaN(x.createdAt));
  if (all.length === 0) return null;
  all.sort((a, b) => b.createdAt - a.createdAt);
  return all[0];
};

const cardMeta = [
  {
    key: 'producers',
    title: 'Producers',
    color: 'from-blue-100 to-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
      </svg>
    ),
    details: 'Producers are responsible for sending data to topics. Here you can see the list of active producers and their statistics.'
  },
  {
    key: 'consumers',
    title: 'Consumers',
    color: 'from-purple-100 to-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    details: 'Consumers receive data from topics. Here you can see the list of active consumers and their statistics.'
  },
  {
    key: 'topics',
    title: 'Topics',
    color: 'from-green-100 to-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" />
      </svg>
    ),
    details: 'Topics are channels for data flow between producers and consumers. Here you can see the list of topics and their details.'
  },
  {
    key: 'activity',
    title: 'Recent Activity',
    color: 'from-pink-100 to-pink-50',
    border: 'border-pink-200',
    iconBg: 'bg-pink-100',
    icon: (
      <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    details: 'This section shows the most recent activity in your system, such as new producers, consumers, or topic changes.'
  },
];

const Dashboard = () => {
  const { isDarkMode } = useTheme ? useTheme() : { isDarkMode: false };
  const { producers, loading: loadingProducers } = useProducers();
  const { consumers, loading: loadingConsumers } = useConsumers();
  const [selectedView, setSelectedView] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  // Handle smooth scrolling when cards appear
  useEffect(() => {
    if (selectedView) {
      // Add a small delay to ensure the card is rendered
      setTimeout(() => {
        const cardElement = document.querySelector('[data-card-container]');
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, [selectedView]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const res = await fetch('/api/schemas');
        const schemas = await res.json();
        // Group by (domain, subdomain, environment)
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
      } catch {
        setTopics([]);
      }
      setLoadingTopics(false);
    };
    fetchTopics();
  }, []);

  const latestActivity = getLatestActivity(producers, consumers);

  const activityCount = (loadingProducers || loadingConsumers)
    ? '...'
    : (producers.length + consumers.length);

  const counts = {
    producers: loadingProducers ? '...' : producers.length,
    consumers: loadingConsumers ? '...' : consumers.length,
    topics: loadingTopics ? '...' : topics.length,
    activity: activityCount,
  };

  const handleCardClick = (cardKey) => {
    navigate(`/dashboard/${cardKey}`);
  };

  const handleKeyDown = (event, cardKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(cardKey);
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-2">
      <style>
        {`
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .card-enter {
            animation: slideInFromTop 0.7s ease-out;
          }
        `}
      </style>
      {/* Modern Professional Dashboard Header */}
      <div className={`relative overflow-hidden rounded-2xl p-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600' : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'} shadow-lg`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        {/* Header Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                Dashboard
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                Welcome to your Fulcrum overview
              </p>
            </div>
          </div>
          
          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-4 mt-6">
            
            <button 
              onClick={() => setSelectedView(selectedView === 'producers' ? null : 'producers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedView === 'producers' 
                  ? (isDarkMode ? 'bg-blue-600/30 text-blue-200' : 'bg-blue-100 text-blue-700') 
                  : (isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {counts.producers} Producers
              </span>
            </button>
            <button 
              onClick={() => setSelectedView(selectedView === 'consumers' ? null : 'consumers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedView === 'consumers' 
                  ? (isDarkMode ? 'bg-purple-600/30 text-purple-200' : 'bg-purple-100 text-purple-700') 
                  : (isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {counts.consumers} Consumers
              </span>
            </button>
            <button 
              onClick={() => setSelectedView(selectedView === 'topics' ? null : 'topics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedView === 'topics' 
                  ? (isDarkMode ? 'bg-emerald-600/30 text-emerald-200' : 'bg-emerald-100 text-emerald-700') 
                  : (isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {counts.topics} Topics
              </span>
            </button>
            <button 
              onClick={() => setSelectedView(selectedView === 'activity' ? null : 'activity')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedView === 'activity' 
                  ? (isDarkMode ? 'bg-pink-600/30 text-pink-200' : 'bg-pink-100 text-pink-700') 
                  : (isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-sm font-medium">
                Recent Activity
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Conditional Cards Display */}
      {selectedView && (
        <div 
          className="grid grid-cols-1 gap-8 transition-all duration-700 ease-out transform" 
          role="grid" 
          aria-label="Dashboard overview cards"
          data-card-container
          style={{
            animation: 'slideInFromTop 0.7s ease-out',
            transform: 'translateY(0)',
            opacity: 1
          }}
        >
          {cardMeta
            .filter(card => card.key === selectedView)
            .map((card) => (
              <div
                key={card.key}
                className={`relative rounded-2xl shadow-lg border-2 ${card.border} bg-gradient-to-br ${card.color} transition-all duration-300 cursor-pointer hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
                onClick={() => handleCardClick(card.key)}
                onKeyDown={(e) => handleKeyDown(e, card.key)}
                tabIndex={0}
                role="button"
                aria-label={`${card.title} - ${counts[card.key]} items. ${card.details}`}
              >
                <div className="flex items-center justify-between p-8">
                  <div className={`flex items-center gap-6`}>
                    <div className={`rounded-xl p-4 ${card.iconBg}`} aria-hidden="true">
                      {card.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-xl text-gray-900 mb-2">{card.title}</div>
                      <div className="text-3xl font-bold text-gray-800 mb-2" aria-live="polite">
                        {counts[card.key]}
                      </div>
                      <div className="text-sm text-gray-600 max-w-md">
                        {card.details}
                      </div>
                    </div>
                  </div>
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.key);
                    }}
                    aria-label={`Expand ${card.title} view`}
                  >
                    <ExpandIcon aria-hidden="true" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 