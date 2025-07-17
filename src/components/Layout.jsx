import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Layout = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="min-h-screen flex bg-[#181f2a] relative">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        {/* Floating chevron button at the intersection */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="absolute z-30 left-0 top-14 md:top-15 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#232b3b] bg-[#232b3b] text-white hover:bg-[#232b3b]/80 hover:border-[#444] transition-all duration-200 shadow-sm"
          style={{ transform: `translateX(${expanded ? '15.5rem' : '3.5rem'}) translateY(-50%)` }}
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-[#232b3b] via-[#232b3b] to-[#232b3b]/80 min-w-0">
          <div className="max-w-6xl mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 