import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShrinkIcon } from './Dashboard';

const DashboardTopics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/schemas');
        const schemas = await res.json();
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
      setLoading(false);
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(t =>
    t.topicName.toLowerCase().includes(search.toLowerCase()) ||
    (t.domain && t.domain.toLowerCase().includes(search.toLowerCase())) ||
    (t.subdomain && t.subdomain.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full mx-0 px-0 mt-8 bg-white rounded-2xl shadow-xl border-2 border-green-200 py-8 relative">
      <div className="relative px-8">
        <button
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/')}
          aria-label="Back to Dashboard"
        >
          <ShrinkIcon />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-green-900">Topics</h1>
        <input
          type="text"
          placeholder="Search topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        {loading ? <div>Loading...</div> : (
          <ul className="list-disc pl-6">
            {filteredTopics.map(t => (
              <li key={t.topicName} className="mb-2">{t.topicName} ({t.domain} / {t.subdomain} / {t.environment})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardTopics; 