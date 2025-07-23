import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsumers } from '../hooks/useConsumers';
import { ShrinkIcon } from './Dashboard';

const DashboardConsumers = () => {
  const navigate = useNavigate();
  const { consumers, loading } = useConsumers();
  const [search, setSearch] = useState('');
  const filteredConsumers = consumers.filter(c =>
    (c.lob_name || c.lobName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.domain || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.subDomain || c.subdomain || c.sub_domain || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.env_arns && c.env_arns.some(env => env.env.toLowerCase().includes(search.toLowerCase())))
  );

  const getEnvironments = (consumer) => {
    if (consumer.env_arns && consumer.env_arns.length > 0) {
      return consumer.env_arns.map(env => env.env).join(', ');
    }
    return '-';
  };

  return (
    <div className="w-full mx-0 px-0 mt-8 bg-white rounded-2xl shadow-xl border-2 border-purple-200 py-8 relative">
      <div className="relative px-8">
        <button
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/')}
          aria-label="Back to Dashboard"
        >
          <ShrinkIcon />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-purple-900">Onboarded Consumers</h1>
        <input
          type="text"
          placeholder="Search consumers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        {loading ? <div>Loading...</div> : (
          <ul className="list-disc pl-6">
            {filteredConsumers.map(c => (
              <li key={c.id} className="mb-2">
                {c.lob_name || c.lobName} ({c.domain || '-'} / {c.subDomain || c.subdomain || c.sub_domain || '-'} / {getEnvironments(c)})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardConsumers; 