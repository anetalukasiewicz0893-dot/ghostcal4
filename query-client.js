import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const NAV = [
  { path: '/calendar', label: '📅 Calendar' },
  { path: '/events',   label: '📋 Events'   },
  { path: '/settings', label: '⚙️ Settings'  },
];

export default function Taskbar() {
  const { pathname } = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w98-taskbar">
      {/* Start button */}
      <Link
        to="/calendar"
        className="w98-btn font-retro font-bold text-base flex items-center gap-1 px-2"
        style={{ minHeight: '28px' }}
      >
        <span className="text-lg leading-none">👻</span>
        <span className="hidden xs:inline">Start</span>
      </Link>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: '#808080', borderRight: '1px solid #fff' }} />

      {/* Open windows / nav */}
      {NAV.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`w98-btn font-retro text-sm flex items-center gap-1 ${pathname === path ? 'w98-btn-active' : ''}`}
          style={{ minHeight: '28px', minWidth: '70px' }}
        >
          {label}
        </Link>
      ))}

      <div className="flex-1" />

      {/* Clock */}
      <div
        className="font-retro text-sm px-2 flex items-center"
        style={{
          border: '1px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          minHeight: '22px',
          minWidth: '64px',
          justifyContent: 'center',
        }}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}