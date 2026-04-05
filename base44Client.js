import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/calendar', label: 'Calendar',  icon: '📅' },
  { path: '/events',   label: 'Events',    icon: '📋' },
  { path: '/settings', label: 'Settings',  icon: '⚙️' },
];

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation();

  return (
    <div className="w98-raised bg-[#c0c0c0] flex flex-col h-full min-w-[120px] w-[140px] flex-shrink-0">
      {/* Sidebar header */}
      <div
        className="px-2 py-1 text-sm font-retro text-[#ffffff] flex items-center gap-1"
        style={{ background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)' }}
      >
        <span>GhostCal</span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col pt-1 flex-1">
        {NAV.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onNavigate}
            className={`w98-navitem ${pathname === path ? 'active' : ''}`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="font-retro text-base">{label}</span>
          </Link>
        ))}
      </div>

      {/* ASCII ghost */}
      <div className="p-2 text-center font-retro text-[#808080] text-xs leading-tight whitespace-pre select-none">
{` .-.
(o o)
| O |
'~~~'`}
      </div>
    </div>
  );
}