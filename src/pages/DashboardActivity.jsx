import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShrinkIcon } from './Dashboard';
import { useProducers } from '../hooks/useProducers';
import { useConsumers } from '../hooks/useConsumers';

const getRecentActivity = (producers, consumers) => {
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
  all.sort((a, b) => b.createdAt - a.createdAt);
  return all;
};

const PAGE_SIZE = 5;

const DashboardActivity = () => {
  const navigate = useNavigate();
  const { producers } = useProducers();
  const { consumers } = useConsumers();
  const recent = getRecentActivity(producers, consumers);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(recent.length / PAGE_SIZE) || 1;
  const paginated = recent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full mx-0 px-0 mt-8 bg-white rounded-2xl shadow-xl border-2 border-pink-200 py-8 relative">
      <div className="relative px-8">
        <button
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/')}
          aria-label="Back to Dashboard"
        >
          <ShrinkIcon />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-pink-900">Recent Activity</h1>
        {recent.length === 0 ? (
          <div>No recent activity</div>
        ) : (
          <>
            <ul className="list-disc pl-6 mb-6">
              {paginated.map((item, idx) => (
                <li key={idx} className="mb-2">
                  <span className="font-semibold">{item.type}:</span> {item.name} ({item.domain})
                  <span className="ml-2 text-gray-500 text-xs">{item.createdAt.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <button
                className="px-4 py-2 rounded bg-pink-100 text-pink-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                className="px-4 py-2 rounded bg-pink-100 text-pink-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardActivity; 