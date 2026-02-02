
import React, { useState } from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD' as AppView, icon: 'fa-house', label: 'Dashboard' },
    { id: 'RECOGNITION' as AppView, icon: 'fa-camera', label: 'Recognition' },
    { id: 'STUDENTS' as AppView, icon: 'fa-user-graduate', label: 'Students' },
    { id: 'LOGS' as AppView, icon: 'fa-list-check', label: 'Logs' },
  ];

  const handleLogoClick = () => {
    setActiveView('DASHBOARD');
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header with Direct Dashboard Link */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 z-50 flex items-center justify-between shadow-sm">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95"
        >
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">EduFace AI</span>
        </button>
        <div className="flex items-center gap-2">
           <button 
            onClick={handleLogoClick}
            className={`p-2 rounded-lg transition-colors ${activeView === 'DASHBOARD' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}
            title="Go to Dashboard"
          >
            <i className="fa-solid fa-house text-xl"></i>
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Desktop Branding */}
          <button 
            onClick={handleLogoClick}
            className="hidden lg:flex items-center gap-3 mb-10 hover:opacity-90 transition-all group w-full text-left"
          >
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-800">EduFace AI</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Main Menu</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-lg w-6`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Admin Portal</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Control Center v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
