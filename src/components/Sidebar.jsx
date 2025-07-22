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
    icon: <FileText size={20} />, // You can change the icon if you want a different one
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
    action: 'openResources', // Special action instead of navigation
  },
];

// Update the Logo component to show 'RAMESH' horizontally when expanded, only 'R' when collapsed
const Logo = ({ expanded }) => {
  const letters = expanded ? [...'RAMESH'] : ['R'];
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      width: expanded ? 160 : 40,
      height: 40,
    }}>
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
  const [openDropdown, setOpenDropdown] = useState('');
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const isActive = (to) => location.pathname === to;
  const isDropdownActive = (dropdown) => dropdown && dropdown.some((item) => location.pathname.startsWith(item.to));

  // Automatically open the dropdown if the current route matches one of its children
  useEffect(() => {
    const dropdownMenu = menu.find(
      (item) => item.dropdown && item.dropdown.some((sub) => location.pathname.startsWith(sub.to))
    );
    if (dropdownMenu) {
      setOpenDropdown(dropdownMenu.label);
    } else {
      setOpenDropdown('');
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    if (item.action === 'openResources') {
      setIsResourcesOpen(true);
    }
  };

  return (
    <>
      <aside className={`h-screen transition-all duration-200 ${expanded ? 'w-64' : 'w-20'} flex flex-col shadow-lg border-r ${
        isDarkMode ? 'bg-[#181f2a] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
      }`}>
        {/* Logo and collapse button */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center p-4">
            <span className="flex items-center justify-center"><Logo expanded={expanded} /></span>
          </div>
          {/* Underline under logo/collapse row, matching header underline */}
          <div className="h-0.5 w-full bg-gradient-to-r from-blue-800 to-blue-950" />
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-2 mt-2">
          {menu.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 transition-colors relative ${
                      isDropdownActive(item.dropdown)
                        ? `${isDarkMode ? 'text-white' : 'text-blue-900'} font-semibold` : `${isDarkMode ? 'hover:bg-[#232b3b]' : 'hover:bg-gray-100'} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
                    }`}
                    onClick={() => setOpenDropdown(openDropdown === item.label ? '' : item.label)}
                  >
                    {item.icon}
                    {expanded && <span>{item.label}</span>}
                    {expanded && (openDropdown === item.label ? <ChevronUp size={18} className="ml-auto" /> : <ChevronDown size={18} className="ml-auto" />)}
                  </button>
                  {openDropdown === item.label && expanded && (
                    <div className="ml-8 flex flex-col gap-1 mt-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors relative ${
                            isActive(sub.to)
                              ? `${isDarkMode ? 'text-white' : 'text-blue-900'} font-semibold after:content-["\"] after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-blue-800 after:to-blue-950` : `${isDarkMode ? 'hover:bg-[#232b3b]' : 'hover:bg-gray-100'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : item.action ? (
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors relative ${isDarkMode ? 'hover:bg-[#232b3b] text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  {item.icon}
                  {expanded && <span>{item.label}</span>}
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 transition-colors relative ${
                    isActive(item.to)
                      ? `${isDarkMode ? 'text-white' : 'text-blue-900'} font-semibold after:content-["\"] after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-blue-800 after:to-blue-950` : `${isDarkMode ? 'hover:bg-[#232b3b]' : 'hover:bg-gray-100'} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
                  }`}
                >
                  {item.icon}
                  {expanded && <span>{item.label}</span>}
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