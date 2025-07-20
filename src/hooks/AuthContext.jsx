import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const session = localStorage.getItem('session');
        if (session) {
          const sessionData = JSON.parse(session);
          setUser(sessionData.user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('session');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    const session = {
      user: userData,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 