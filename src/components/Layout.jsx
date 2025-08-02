import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/ThemeContext';

const Layout = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const { isDarkMode } = useTheme();
  
  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };
  
  return (
    <div className={`min-h-screen flex relative ${isDarkMode ? 'bg-[#181f2a]' : 'bg-gray-50'}`}>
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        {/* Floating chevron button at the intersection */}
        <button
          onClick={toggleSidebar}
          className={`absolute z-30 left-0 top-14 md:top-15 w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-900 hover:border-blue-800 transition-all duration-200 shadow-lg ${
            isDarkMode ? 'bg-[#232b3b] text-white hover:bg-[#232b3b]/80' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          style={{ transform: `translateX(${expanded ? '15.5rem' : '4.5rem'}) translateY(-50%)` }}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={expanded}
          aria-controls="sidebar"
        >
          {expanded ? <ChevronLeft size={20} aria-hidden="true" /> : <ChevronRight size={20} aria-hidden="true" />}
        </button>
        <main 
          id="main-content"
          className={`flex-1 p-1 md:p-2 min-w-0 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-[#232b3b] via-[#232b3b] to-[#232b3b]/80' 
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
          }`}
          role="main"
          tabIndex="-1"
        >
          <div className="max-w-6xl mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 