import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Producers from './pages/Producers';
import Consumers from './pages/Consumers';
import FulcrumResources from './pages/FulcrumResources';
import OnboardForm from './pages/OnboardForm';
import SchemasList from './pages/SchemasList';
import Topics from './pages/Topics';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Landing from './pages/Landing';
import Profile from './pages/Profile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import DashboardProducers from './pages/DashboardProducers';
import DashboardConsumers from './pages/DashboardConsumers';
import DashboardTopics from './pages/DashboardTopics';
import DashboardActivity from './pages/DashboardActivity';
import { ThemeContextProvider } from './hooks/ThemeContext';
import { AuthProvider } from './hooks/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/producers" element={
              <ProtectedRoute>
                <Layout>
                  <Producers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/consumers" element={
              <ProtectedRoute>
                <Layout>
                  <Consumers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute>
                <Layout>
                  <FulcrumResources />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/onboard" element={
              <ProtectedRoute>
                <Layout>
                  <OnboardForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/schemas" element={
              <ProtectedRoute>
                <Layout>
                  <SchemasList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/topics" element={
              <ProtectedRoute>
                <Layout>
                  <Topics />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/producers" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardProducers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/consumers" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardConsumers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/topics" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardTopics />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/activity" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardActivity />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </Router>
      </ThemeContextProvider>
    </AuthProvider>
  );
};

export default App;