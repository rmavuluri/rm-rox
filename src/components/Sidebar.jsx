import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  BookOpen,
  FileText,
} from 'lucide-react';
import FulcrumResourcesSlider from './FulcrumResourcesSlider';
import { useTheme } from '../hooks/ThemeContext';

const menu = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    to: '/',
  },
  {
    label: 'Schemas List',
    icon: <FileText size={20} />,
    to: '/schemas',
  },
  {
    label: 'Topics',
    icon: <BookOpen size={20} />,
    to: '/topics',
  },
  {
    label: 'Onboard Form',
    icon: <FileText size={20} />,
    to: '/onboard',
  },
  {
    label: 'Producers',
    icon: <User size={20} />,
    dropdown: [
      { label: 'All Producers', to: '/producers' },
    ],
  },
  {
    label: 'Consumers',
    icon: <Users size={20} />,
    dropdown: [
      { label: 'All Consumers', to: '/consumers' },
    ],
  },
  {
    label: 'Fulcrum Resources',
    icon: <BookOpen size={20} />,
    action: 'openResources',
  },
];

// Update the Logo component to show 'RAMESH' horizontally when expanded, only 'R' when collapsed
const Logo = ({ expanded }) => {
  const letters = expanded ? [...'RAMESH'] : ['R'];
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: expanded ? 160 : 40,
        height: 40,
      }}
      aria-label={expanded ? 'RAMESH Logo' : 'R Logo'}
    >
      {letters.map((char) => (
        <div
          key={char}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 13,
            fontFamily: 'sans-serif',
            letterSpacing: 1,
          }}>{char}</span>
        </div>
      ))}
    </div>
  );
};

const Sidebar = ({ expanded, setExpanded }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const isActive = (to) => location.pathname === to;
  const isDropdownActive = (dropdown) => dropdown && dropdown.some((item) => location.pathname.startsWith(item.to));

  const handleMenuClick = (item) => {
    if (item.action === 'openResources') {
      setIsResourcesOpen(true);
    }
  };

  const handleDropdownToggle = (itemLabel) => {
    setOpenDropdown(openDropdown === itemLabel ? null : itemLabel);
  };

  return (
    <>
      <aside 
        id="sidebar"
        className={`h-screen transition-all duration-300 ease-out ${expanded ? 'w-64' : 'w-20'} flex flex-col shadow-xl border-r ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-gray-700' 
            : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-800 border-gray-200'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo and collapse button */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center p-4">
            <span className="flex items-center justify-center">
              <Logo expanded={expanded} />
            </span>
          </div>
          {/* Modern gradient separator */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 px-3 mt-4" role="menubar">
          {menu.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isDropdownActive(item.dropdown)
                        ? `${isDarkMode 
                            ? 'bg-blue-600/20 text-blue-200 shadow-lg shadow-blue-500/20' 
                            : 'bg-blue-100 text-blue-700 shadow-lg shadow-blue-200'
                          } font-semibold` 
                        : `${isDarkMode 
                            ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                          }`
                    }`}
                    onClick={() => handleDropdownToggle(item.label)}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    aria-label={`${item.label} menu`}
                    role="menuitem"
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isDropdownActive(item.dropdown)
                        ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-200'
                        : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      {React.cloneElement(item.icon, { 
                        'aria-hidden': true,
                        className: isDropdownActive(item.dropdown) ? 'text-blue-500' : ''
                      })}
                    </div>
                    {expanded && <span className="flex-1 text-left">{item.label}</span>}
                    {expanded && (
                      <div className={`transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}>
                        <ChevronDown size={16} aria-hidden="true" />
                      </div>
                    )}
                  </button>
                  {openDropdown === item.label && expanded && (
                    <div 
                      className="ml-4 flex flex-col gap-1 mt-2 pl-4 border-l-2 border-gray-300/30 dark:border-gray-600/30"
                      role="menu"
                      aria-label={`${item.label} submenu`}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive(sub.to)
                              ? `${isDarkMode 
                                  ? 'bg-blue-600/15 text-blue-200 font-semibold' 
                                  : 'bg-blue-50 text-blue-700 font-semibold'
                                }` 
                              : `${isDarkMode 
                                  ? 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200' 
                                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                                }`
                          }`}
                          role="menuitem"
                          aria-current={isActive(sub.to) ? 'page' : undefined}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive(sub.to)
                              ? isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                              : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                          }`} />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : item.action ? (
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
                  aria-label={`Open ${item.label}`}
                  role="menuitem"
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    {React.cloneElement(item.icon, { 'aria-hidden': true })}
                  </div>
                  {expanded && <span className="flex-1 text-left">{item.label}</span>}
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive(item.to)
                      ? `${isDarkMode 
                          ? 'bg-blue-600/20 text-blue-200 shadow-lg shadow-blue-500/20' 
                          : 'bg-blue-100 text-blue-700 shadow-lg shadow-blue-200'
                        } font-semibold` 
                      : `${isDarkMode 
                          ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`
                  }`}
                  role="menuitem"
                  aria-current={isActive(item.to) ? 'page' : undefined}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive(item.to)
                      ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-200'
                      : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    {React.cloneElement(item.icon, { 
                      'aria-hidden': true,
                      className: isActive(item.to) ? 'text-blue-500' : ''
                    })}
                  </div>
                  {expanded && <span className="flex-1 text-left">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Fulcrum Resources Slider */}
      <FulcrumResourcesSlider 
        isOpen={isResourcesOpen} 
        onClose={() => setIsResourcesOpen(false)} 
      />
    </>
  );
};

export default Sidebar; 