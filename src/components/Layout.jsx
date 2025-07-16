import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#181f2a]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-[#232b3b] via-[#232b3b] to-[#232b3b]/80">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 