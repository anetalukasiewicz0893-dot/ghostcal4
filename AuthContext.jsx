import React from 'react';

export default function RetroButton({
  children, onClick, disabled, className = '',
  variant = 'default', size = 'md', active = false, type = 'button'
}) {
  const sizeMap = {
    xs: 'text-sm px-[6px] min-h-[18px]',
    sm: 'text-base px-[8px] min-h-[21px]',
    md: 'text-base px-[10px] min-h-[23px]',
    lg: 'text-lg px-[14px] min-h-[27px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w98-btn font-retro ${sizeMap[size]} ${active ? 'w98-btn-active' : ''} ${className}`}
    >
      {children}
    </button>
  );
}