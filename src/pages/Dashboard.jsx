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
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
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
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
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
      <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    details: 'This section shows the most recent activity in your system, such as new producers, consumers, or topic changes.'
  },
];

const Dashboard = () => {
  const { isDarkMode } = useTheme ? useTheme() : { isDarkMode: false };
  const { producers, loading: loadingProducers } = useProducers();
  const { consumers, loading: loadingConsumers } = useConsumers();
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
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

  return (
    <div className="flex flex-col gap-8">
      <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cardMeta.map((card) => (
          <div
            key={card.key}
            className={`relative rounded-2xl shadow-lg border-2 ${card.border} bg-gradient-to-br ${card.color} transition-all duration-300`}
          >
            <div className="flex items-center justify-between p-6">
              <div className={`flex items-center gap-4`}>
                <div className={`rounded-xl p-3 ${card.iconBg}`}>{card.icon}</div>
                <div>
                  <div className="font-semibold text-lg text-gray-900 mb-1">{card.title}</div>
                  <div className="text-2xl font-bold text-gray-800">{counts[card.key]}</div>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => navigate(`/dashboard/${card.key}`)}
                aria-label={`Expand ${card.title}`}
              >
                <ExpandIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 