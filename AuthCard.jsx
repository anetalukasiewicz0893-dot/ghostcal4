import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import RetroButton from '../retro/RetroButton';

export default function CalendarToolbar({ currentDate, onDateChange, view, onViewChange, onAddEvent, onExport }) {
  const go = (dir) => {
    const ops = {
      month: dir > 0 ? addMonths : subMonths,
      week:  dir > 0 ? addWeeks  : subWeeks,
      day:   dir > 0 ? addDays   : subDays,
    };
    onDateChange(ops[view](currentDate, 1));
  };

  const getTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week')  return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    return format(currentDate, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-1 bg-[#c0c0c0] flex-shrink-0"
      style={{ borderBottom: '2px solid #808080' }}
    >
      {/* New event */}
      <RetroButton size="sm" onClick={onAddEvent}>➕ New</RetroButton>
      <RetroButton size="sm" onClick={onExport} className="hidden sm:flex">📥 Export iCal</RetroButton>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: '#808080', borderRight: '1px solid #fff' }} />

      {/* Navigation */}
      <RetroButton size="sm" onClick={() => go(-1)}>◀</RetroButton>
      <RetroButton size="sm" onClick={() => onDateChange(new Date())}>Today</RetroButton>
      <RetroButton size="sm" onClick={() => go(1)}>▶</RetroButton>

      <span className="font-retro text-base font-bold px-2 min-w-[160px] text-center hidden sm:block">
        {getTitle()}
      </span>
      <span className="font-retro text-base font-bold px-1 sm:hidden">
        {format(currentDate, 'MMM yyyy')}
      </span>

      <div className="flex-1" />

      {/* View switcher */}
      <div className="flex gap-[2px]">
        {['month', 'week', 'day'].map(v => (
          <RetroButton
            key={v}
            size="sm"
            active={view === v}
            onClick={() => onViewChange(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </RetroButton>
        ))}
      </div>
    </div>
  );
}