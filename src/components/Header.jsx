import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../hooks/ThemeContext';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };
  const handleChangePassword = () => {
    setMenuOpen(false);
    navigate('/change-password');
  };

  return (
    <header className={`flex items-center justify-between px-8 py-4 shadow border-b-2 border-blue-900 ${
      isDarkMode ? 'bg-[#232b3b] text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        <span className={
          isDarkMode
            ? "pl-5 font-bold text-l tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            : "pl-5 font-bold text-l tracking-wide bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent"
        }>FULCRUM</span>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={toggleDarkMode} className="hover:text-blue-400 transition-colors">
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 focus:outline-none hover:text-blue-400 transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <User size={22} />
            <span className="font-semibold">{user?.fullName || 'User'}</span>
          </button>
          {menuOpen && (
            <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${isDarkMode ? 'bg-blue-900 border border-blue-800' : 'bg-white border border-gray-200'}`}>
              <button
                onClick={handleProfile}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 ${isDarkMode ? 'text-white hover:text-blue-200' : 'text-gray-800'}`}
              >
                Profile
              </button>
              <button
                onClick={handleChangePassword}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 ${isDarkMode ? 'text-white hover:text-blue-200' : 'text-gray-800'}`}
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500'}`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 