import React from 'react';
import { Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import { useTheme } from '../hooks/ThemeContext';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout, isOktaEnabled } = useAuth();
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

  // Handle keyboard navigation for menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (menuOpen) {
        if (event.key === 'Escape') {
          setMenuOpen(false);
        }
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  return (
    <header 
      className={`flex items-center justify-between px-[14px] py-[14px] shadow border-b-2 border-blue-900 ${
        isDarkMode ? 'bg-[#232b3b] text-white' : 'bg-white text-gray-800'
      }`}
      role="banner"
    >
      <div className="flex items-center gap-3">
        <span 
          className={
            isDarkMode
              ? "pl-5 font-bold text-l tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              : "pl-5 font-bold text-l tracking-wide bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent"
          }
          aria-label="Fulcrum Dashboard"
        >
          FULCRUM
        </span>
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={handleThemeToggle} 
          className="hover:text-blue-400 transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />}
        </button>
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 focus:outline-none hover:text-blue-400 transition-colors p-1 rounded-lg focus:ring-2 focus:ring-blue-500"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <User size={22} aria-hidden="true" />
            <span className="font-semibold">{user?.fullName || 'User'}</span>
            {user?.provider === 'okta' && (
              <Shield 
                size={16} 
                className="text-blue-500" 
                title="OKTA User" 
                aria-label="OKTA User"
              />
            )}
          </button>
          {menuOpen && (
            <div 
              className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${isDarkMode ? 'bg-blue-900 border border-blue-800' : 'bg-white border border-gray-200'}`}
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={handleProfile}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-white hover:text-blue-200' : 'text-gray-800'}`}
                role="menuitem"
              >
                Profile
              </button>
              <button
                onClick={handleChangePassword}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-white hover:text-blue-200' : 'text-gray-800'}`}
                role="menuitem"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500'}`}
                role="menuitem"
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