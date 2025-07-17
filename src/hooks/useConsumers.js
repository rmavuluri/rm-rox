import { useState, useEffect, useCallback } from 'react';

// Mock API with in-memory data
const mockConsumersData = [
  {
    id: 1,
    lobName: 'Analytics Platform',
    domain: 'analytics.com',
    onboardType: 'Direct Consumer',
    subDomain: 'data-processing',
    volumeOfEvents: '500ay',
    schemaName: 'analytics_schema_v1',
    topicName: 'analytics.data.topic',
    tentativeProdDate: '2024-05-01',
    canPerformPT: false,
    allEnvARNs: 'arn:aws:sqs:us-east-1:123456789012:analytics-queue',
    notificationEmail: 'alerts@analytics.com',
    contactEmails: 'data-team@analytics.com\nops@analytics.com',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-10-22T10:00:00Z',
  },
  {
    id: 2,
    lobName: 'Reporting Service',
    domain: 'reports.com',
    onboardType: 'S3',
    subDomain: 'reports',
    volumeOfEvents: '100ay',
    schemaName: 'report_schema_v1',
    topicName: 'reports.data.topic',
    tentativeProdDate: '2024-01-01',
    canPerformPT: true,
    allEnvARNs: 'arn:aws:s3::reports-bucket/*',
    notificationEmail: 'reports@reports.com',
    contactEmails: 'reporting-team@reports.com',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-10-20T10:00:00Z',
  },
  {
    id: 3,
    lobName: 'Data Warehouse',
    domain: 'warehouse.com',
    onboardType: 'SF',
    subDomain: 'etl',
    volumeOfEvents: '1ay',
    schemaName: 'warehouse_schema_v1',
    topicName: 'warehouse.etl.topic',
    tentativeProdDate: '2024-01-01',
    canPerformPT: false,
    allEnvARNs: 'arn:aws:glue:us-east-1:12345678912:job/etl-job',
    notificationEmail: 'etl@warehouse.com',
    contactEmails: 'etl-team@warehouse.com\nmonitoring@warehouse.com',
    createdAt: '2024-02-21T10:00:00Z',
    updatedAt: '2024-10-25T10:00:00Z',
  },
];

export const useConsumers = () => {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Load data from localStorage or use mock data
  const loadData = useCallback(() => {
    try {
      const stored = localStorage.getItem('consumers_data');
      if (stored) {
        setConsumers(JSON.parse(stored));
      } else {
        setConsumers(mockConsumersData);
        localStorage.setItem('consumers_data', JSON.stringify(mockConsumersData));
      }
    } catch (err) {
      setError('Failed to load consumers data');
      setConsumers(mockConsumersData);
    }
    setLoading(false);
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data) => {
    try {
      localStorage.setItem('consumers_data', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save consumers data:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter consumers based on search
  const filteredConsumers = consumers.filter(consumer =>
    consumer.lobName.toLowerCase().includes(search.toLowerCase())
  );

  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      loadData();
    }, 500);
  }, [loadData]);

  // Select consumer
  const selectConsumer = useCallback((consumer) => {
    const selected = JSON.parse(localStorage.getItem('selected_consumers') || '[]');
    const exists = selected.find(c => c.id === consumer.id);
    if (!exists) {
      selected.push(consumer);
      localStorage.setItem('selected_consumers', JSON.stringify(selected));
    }
  }, []);

  // Delete consumer
  const deleteConsumer = useCallback((id) => {
    const updated = consumers.filter(c => c.id !== id);
    setConsumers(updated);
    saveData(updated);
  }, [consumers, saveData]);

  return {
    consumers: filteredConsumers,
    loading,
    error,
    search,
    setSearch,
    refresh,
    selectConsumer,
    deleteConsumer,
  };
}; 