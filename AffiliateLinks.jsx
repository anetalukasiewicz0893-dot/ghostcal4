import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function DayView({ currentDate, events, onEventClick }) {
  const dayEvts = events.filter(e => isSameDay(new Date(e.start_datetime), currentDate));
  const eventsAt = (hour) => dayEvts.filter(e => new Date(e.start_datetime).getHours() === hour);

  return (
    <div className="w98-sunken overflow-auto h-full" style={{ background: '#ffffff' }}>
      {/* Day header */}
      <div
        className="sticky top-0 z-10 p-2 text-center font-retro text-base font-bold"
        style={{
          background: isToday(currentDate) ? '#000080' : '#c0c0c0',
          color: isToday(currentDate) ? '#ffffff' : '#000000',
          borderBottom: '2px solid #808080',
        }}
      >
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
        {isToday(currentDate) && <span className="ml-2 text-sm opacity-75">— Today</span>}
      </div>

      {/* Hour rows */}
      {HOURS.map(hour => {
        const hourEvts = eventsAt(hour);
        return (
          <div
            key={hour}
            className="flex"
            style={{ borderBottom: '1px solid #e0e0e0', minHeight: '36px' }}
          >
            <div
              className="font-retro text-[13px] text-[#808080] text-right pr-2 pt-[3px] bg-[#f0f0f0] flex-shrink-0 w-[72px]"
              style={{ borderRight: '1px solid #c0c0c0' }}
            >
              {format(new Date(2000, 0, 1, hour), 'h:mm a')}
            </div>
            <div className="flex-1 p-[2px] hover:bg-[#f8f8ff]">
              {hourEvts.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => onEventClick(evt)}
                  className="w98-event-pill flex items-center justify-between gap-2 mb-[2px]"
                  title={evt.title}
                  style={{ fontSize: 14, padding: '1px 4px' }}
                >
                  <span className="truncate">▪ {evt.title}</span>
                  <span className="flex-shrink-0 opacity-70 text-[12px]">
                    {format(new Date(evt.start_datetime), 'h:mm')}–{format(new Date(evt.end_datetime), 'h:mma')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}