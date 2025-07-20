import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../hooks/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <header className={`flex items-center justify-between px-8 py-4 shadow border-b-2 border-purple-500 ${
      isDarkMode ? 'bg-[#232b3b] text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        <span className="pl-5 font-bold text-l tracking-wide bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">FULCRUM</span>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={toggleDarkMode} className="hover:text-purple-400 transition-colors">
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <div className="flex items-center gap-2">
          <User size={22} />
          <span className="font-semibold">Ramesh</span>
        </div>
        <button className="hover:text-purple-400 transition-colors text-red-500">
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header; 