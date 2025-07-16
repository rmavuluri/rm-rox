import React, { useState, useRef } from 'react';
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
} from 'lucide-react';

const menu = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    to: '/',
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
    to: '/resources',
  },
];

// Update the Logo component to show 'R' in the center
const Logo = () => (
  <div style={{
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <span style={{
      color: 'white',
      fontWeight: 'bold',
      fontSize: 24,
      fontFamily: 'sans-serif',
      letterSpacing: 1,
    }}>R</span>
  </div>
);

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState('');
  const location = useLocation();

  const isActive = (to) => location.pathname === to;
  const isDropdownActive = (dropdown) => dropdown && dropdown.some((item) => location.pathname.startsWith(item.to));

  return (
    <aside className={`bg-[#181f2a] text-white h-screen transition-all duration-200 ${expanded ? 'w-64' : 'w-20'} flex flex-col shadow-lg`}>
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4">
        <span className={`transition-all duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}><Logo /></span>
        <button onClick={() => setExpanded((e) => !e)} className="text-white focus:outline-none ml-2">
          {expanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2 mt-2">
        {menu.map((item) => (
          <div key={item.label}>
            {item.dropdown ? (
              <>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors relative ${
                    isDropdownActive(item.dropdown)
                      ? 'text-white' : 'hover:bg-[#232b3b]'
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
                            ? 'text-white after:content-[""] after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-purple-400 after:to-purple-600' : 'hover:bg-[#232b3b]'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 transition-colors relative ${
                  isActive(item.to)
                    ? 'text-white after:content-[""] after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-purple-400 after:to-purple-600' : 'hover:bg-[#232b3b]'
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
  );
};

export default Sidebar; 