import React from 'react';
import { useTheme } from '../hooks/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer 
      className={`py-6 px-4 border-t ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-white via-gray-100 to-white border-gray-200'
      }`}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright Section */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 Ally Financials. All rights reserved.
            </span>
          </div>

          {/* Additional Footer Content */}
          <div className="flex items-center gap-6">
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Fulcrum Dashboard v1.0
            </span>
            {/* <div className={`w-px h-4 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Powered by React
            </span> */}
          </div>
        </div>

        {/* Bottom Border with Gradient */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
      </div>
    </footer>
  );
};

export default Footer; 