import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Producers from './pages/Producers';
import Consumers from './pages/Consumers';
import FulcrumResources from './pages/FulcrumResources';
import { ThemeContextProvider } from './hooks/ThemeContext';

const App = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/producers" element={<Producers />} />
            <Route path="/consumers" element={<Consumers />} />
            <Route path="/resources" element={<FulcrumResources />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;