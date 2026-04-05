import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Taskbar from './Taskbar';
import Sidebar from './Sidebar';
import MenuBar from './MenuBar';
import { base44 } from '@/api/base44Client';

export default function AppShell({ children, onMenuAction, title = 'GhostCal', statusText = 'Ready' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuAction = (action) => {
    if (action === 'logout')     { base44.auth.logout('/'); return; }
    if (action === 'settings')   { navigate('/settings'); return; }
    if (action === 'newEvent')   { onMenuAction?.('newEvent'); return; }
    if (action === 'viewMonth')  { onMenuAction?.('viewMonth'); return; }
    if (action === 'viewWeek')   { onMenuAction?.('viewWeek'); return; }
    if (action === 'viewDay')    { onMenuAction?.('viewDay'); return; }
    if (action === 'export')     { onMenuAction?.('export'); return; }
    if (action === 'about') {
      alert('GhostCal v1.0\n© 2026 GhostCal Software\n\n"Your appointments… from beyond the grave"\n\nBest viewed at 800×600 resolution.');
      return;
    }
    onMenuAction?.(action);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#008080] pb-[36px] scanlines">

      {/* ── Top chrome: title bar + menu bar ── */}
      <div className="w98-window flex-shrink-0 mx-0">
        {/* Global title bar */}
        <div className="w98-titlebar">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">👻</span>
            <span className="font-retro text-lg tracking-wide">GhostCal</span>
            <span className="font-retro text-sm opacity-75 hidden sm:inline ml-2">
              — Your appointments from beyond the grave
            </span>
          </div>
          <div className="flex items-center gap-[2px]">
            {/* Mobile hamburger */}
            <button
              className="w98-titlebar-btn w-[20px] h-[16px] text-[11px] sm:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Menu"
            >
              ☰
            </button>
            <button className="w98-titlebar-btn" title="Minimize">_</button>
            <button className="w98-titlebar-btn" title="Maximize">□</button>
            <button
              className="w98-titlebar-btn font-bold"
              title="Logout"
              onClick={() => base44.auth.logout('/')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu bar */}
        <MenuBar onAction={handleMenuAction} />
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — hidden on mobile unless open */}
        <div
          className={`
            fixed sm:relative z-50 sm:z-auto top-0 left-0 h-full sm:h-auto
            transition-transform duration-150
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          `}
          style={{ paddingTop: sidebarOpen ? '0' : undefined }}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main content window */}
        <div className="flex-1 flex flex-col min-w-0 p-[4px] sm:p-[6px] gap-[4px]">
          {/* Inner window */}
          <div className="w98-window flex flex-col flex-1 min-h-0">
            {/* Window title */}
            <div
              className="flex items-center px-2 py-[2px] flex-shrink-0"
              style={{ borderBottom: '1px solid #808080', background: '#c0c0c0' }}
            >
              <span className="font-retro text-base text-black">{title}</span>
            </div>
            {/* Content area */}
            <div className="flex-1 min-h-0 overflow-auto bg-[#c0c0c0] p-[4px]">
              {children}
            </div>
          </div>

          {/* Status bar */}
          <div className="w98-statusbar flex-shrink-0">
            <div className="w98-statusbar-panel flex-1 text-sm font-retro">{statusText}</div>
            <div className="w98-statusbar-panel text-sm font-retro w-24 text-center">
              {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <Taskbar />
    </div>
  );
}