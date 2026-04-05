import React from 'react';

export default function WindowFrame({ title, children, className = '', onClose, icon, noPad = false }) {
  return (
    <div className={`w98-window flex flex-col ${className}`}>
      {/* Title bar */}
      <div className="w98-titlebar flex-shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          {icon && <span className="text-base leading-none flex-shrink-0">{icon}</span>}
          <span className="truncate text-base leading-none font-retro">{title}</span>
        </div>
        <div className="flex items-center gap-[2px] flex-shrink-0 ml-2">
          <button className="w98-titlebar-btn" title="Minimize">_</button>
          <button className="w98-titlebar-btn" title="Maximize">□</button>
          {onClose && (
            <button className="w98-titlebar-btn font-bold" onClick={onClose} title="Close">✕</button>
          )}
        </div>
      </div>
      {/* Content */}
      <div className={`bg-[#c0c0c0] flex-1 ${noPad ? '' : 'p-[4px]'}`}>
        {children}
      </div>
    </div>
  );
}