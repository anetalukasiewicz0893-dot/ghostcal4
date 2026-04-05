import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MENUS = {
  File: [
    { label: 'New Event',    action: 'newEvent' },
    { label: 'Export iCal…', action: 'export'   },
    { separator: true },
    { label: 'Exit',         action: 'logout'   },
  ],
  View: [
    { label: 'Month View', action: 'viewMonth' },
    { label: 'Week View',  action: 'viewWeek'  },
    { label: 'Day View',   action: 'viewDay'   },
  ],
  Tools: [
    { label: 'Settings', action: 'settings' },
  ],
  Help: [
    { label: 'About GhostCal…', action: 'about' },
  ],
};

export default function MenuBar({ onAction }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="w98-menubar relative" ref={ref}>
      {Object.entries(MENUS).map(([name, items]) => (
        <div key={name} className="relative">
          <div
            className={`w98-menuitem ${open === name ? 'active' : ''}`}
            onClick={() => setOpen(open === name ? null : name)}
          >
            <u>{name[0]}</u>{name.slice(1)}
          </div>
          {open === name && (
            <div
              className="absolute left-0 top-full z-50 w98-window bg-[#c0c0c0] min-w-[140px]"
              style={{ top: '100%' }}
            >
              {items.map((item, i) =>
                item.separator
                  ? <div key={i} className="w98-groove mx-1 my-1" />
                  : (
                    <div
                      key={i}
                      className="w98-menuitem text-sm"
                      onClick={() => { setOpen(null); onAction?.(item.action); }}
                    >
                      {item.label}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}