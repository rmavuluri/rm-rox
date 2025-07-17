// In-memory mock data
let producers = [
  {
    id: 'prod-1',
    lobName: 'Payments',
    domain: 'Finance',
    subDomain: 'Transactions',
    topicName: 'payments-topic',
    contactEmails: 'payments@company.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    lobName: 'Orders',
    domain: 'Ecommerce',
    subDomain: 'Order Management',
    topicName: 'orders-topic',
    contactEmails: 'orders@company.com',
    createdAt: new Date().toISOString(),
  },
];

let consumers = [
  {
    id: 'cons-1',
    lobName: 'Analytics',
    domain: 'Data',
    subDomain: 'Reporting',
    topicName: 'analytics-topic',
    contactEmails: 'analytics@company.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cons-2',
    lobName: 'Notifications',
    domain: 'Communication',
    subDomain: 'Email',
    topicName: 'notifications-topic',
    contactEmails: 'notify@company.com',
    createdAt: new Date().toISOString(),
  },
];

function simulateNetwork(data, error = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) reject(new Error('Mock API error'));
      else resolve(JSON.parse(JSON.stringify(data)));
    }, 500);
  });
}

// Producers
export const getProducers = () => simulateNetwork(producers);
export const addProducer = (producer) => {
  producers = [producer, ...producers];
  return simulateNetwork(producer);
};
export const updateProducer = (id, updates) => {
  producers = producers.map((p) => (p.id === id ? { ...p, ...updates } : p));
  return simulateNetwork(producers.find((p) => p.id === id));
};
export const deleteProducer = (id) => {
  producers = producers.filter((p) => p.id !== id);
  return simulateNetwork({ success: true });
};

// Consumers
export const getConsumers = () => simulateNetwork(consumers);
export const addConsumer = (consumer) => {
  consumers = [consumer, ...consumers];
  return simulateNetwork(consumer);
};
export const updateConsumer = (id, updates) => {
  consumers = consumers.map((c) => (c.id === id ? { ...c, ...updates } : c));
  return simulateNetwork(consumers.find((c) => c.id === id));
};
export const deleteConsumer = (id) => {
  consumers = consumers.filter((c) => c.id !== id);
  return simulateNetwork({ success: true });
}; 