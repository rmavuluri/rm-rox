import { useState, useEffect, useCallback } from 'react';

// Mock API with in-memory data
const mockProducersData = [
  {
    id: 1,
    lobName: 'Retail Banking',
    domain: 'finance.com',
    onboardType: 'Direct Producer',
    subDomain: 'payments',
    volumeOfEvents: '1M/day',
    schemaName: 'payment_schema_v1',
    topicName: 'retail.payments.topic',
    tentativeProdDate: '2024-05-01',
    canPerformPT: true,
    allEnvARNs: 'arn:aws:sns:us-east-1:123456789012:retail-payments-topic',
    notificationEmail: 'alerts@finance.com',
    contactEmails: 'team@finance.com\nmanager@finance.com',
    createdAt: '2024-11-05T00:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    lobName: 'Investment Services',
    domain: 'invest.com',
    onboardType: 'EB with Lambda',
    subDomain: 'trading',
    volumeOfEvents: '500K/day',
    schemaName: 'trade_schema_v2',
    topicName: 'invest.trading.topic',
    tentativeProdDate: '2024-01-01',
    canPerformPT: false,
    allEnvARNs: 'arn:aws:events:us-east-1:123456789123456789123:rule/trading-events',
    notificationEmail: 'trading@invest.com',
    contactEmails: 'trading-team@invest.com',
    createdAt: '2024-12-20T00:00:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
  },
  {
    id: 3,
    lobName: 'Credit Card Services',
    domain: 'credit.com',
    onboardType: 'Direct Producer',
    subDomain: 'transactions',
    volumeOfEvents: '2M/day',
    schemaName: 'transaction_schema_v1',
    topicName: 'credit.transactions.topic',
    tentativeProdDate: '2024-01-01',
    canPerformPT: true,
    allEnvARNs: 'arn:aws:sns:us-east-1:1234567890123456789012:credit-transactions-topic',
    notificationEmail: 'transactions@credit.com',
    contactEmails: 'ops@credit.com\nsupport@credit.com',
    createdAt: '2024-02-21T00:00:00Z',
    updatedAt: '2024-02-09T09:15:00Z',
  },
];

export const useProducers = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Load data from localStorage or use mock data
  const loadData = useCallback(() => {
    try {
      const stored = localStorage.getItem('producers_data');
      if (stored) {
        setProducers(JSON.parse(stored));
      } else {
        setProducers(mockProducersData);
        localStorage.setItem('producers_data', JSON.stringify(mockProducersData));
      }
    } catch (err) {
      setError('Failed to load producers data');
      setProducers(mockProducersData);
    }
    setLoading(false);
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data) => {
    try {
      localStorage.setItem('producers_data', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save producers data:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter producers based on search
  const filteredProducers = producers.filter(producer =>
    producer.lobName.toLowerCase().includes(search.toLowerCase())
  );

  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      loadData();
    }, 500);
  }, [loadData]);

  // Select producer
  const selectProducer = useCallback((producer) => {
    const selected = JSON.parse(localStorage.getItem('selected_producers') || '[]');
    const exists = selected.find(p => p.id === producer.id);
    if (!exists) {
      selected.push(producer);
      localStorage.setItem('selected_producers', JSON.stringify(selected));
    }
  }, []);

  // Delete producer
  const deleteProducer = useCallback((id) => {
    const updated = producers.filter(p => p.id !== id);
    setProducers(updated);
    saveData(updated);
  }, [producers, saveData]);

  return {
    producers: filteredProducers,
    loading,
    error,
    search,
    setSearch,
    refresh,
    selectProducer,
    deleteProducer,
  };
}; 