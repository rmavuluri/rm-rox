import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducers } from '../hooks/useProducers';
import { ShrinkIcon } from './Dashboard';

const DashboardProducers = () => {
  const navigate = useNavigate();
  const { producers, loading } = useProducers();
  const [search, setSearch] = useState('');
  const filteredProducers = producers.filter(p =>
    (p.lob_name || p.lobName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.domain || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.subDomain || p.subdomain || p.sub_domain || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.env_arns && p.env_arns.some(env => env.env.toLowerCase().includes(search.toLowerCase())))
  );

  const getEnvironments = (producer) => {
    if (producer.env_arns && producer.env_arns.length > 0) {
      return producer.env_arns.map(env => env.env).join(', ');
    }
    return '-';
  };

  return (
    <div className="w-full mx-0 px-0 mt-8 bg-white rounded-2xl shadow-xl border-2 border-blue-200 py-8 relative">
      <div className="relative px-8">
        <button
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/')}
          aria-label="Back to Dashboard"
        >
          <ShrinkIcon />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Onboarded Producers</h1>
        <input
          type="text"
          placeholder="Search producers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {loading ? <div>Loading...</div> : (
          <ul className="list-disc pl-6">
            {filteredProducers.map(p => (
              <li key={p.id} className="mb-2">
                {p.lob_name || p.lobName} ({p.domain || '-'} / {p.subDomain || p.subdomain || p.sub_domain || '-'} / {getEnvironments(p)})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardProducers; 