import React from 'react';
import { startOfWeek, addDays, format, isSameDay, isToday } from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekView({ currentDate, events, onDateClick, onEventClick }) {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const eventsAt = (day, hour) =>
    events.filter(e => {
      const d = new Date(e.start_datetime);
      return isSameDay(d, day) && d.getHours() === hour;
    });

  return (
    <div className="w98-sunken overflow-auto h-full" style={{ background: '#ffffff' }}>
      <div style={{ minWidth: 560 }}>
        {/* Header row */}
        <div
          className="grid sticky top-0 z-10 bg-[#c0c0c0]"
          style={{ gridTemplateColumns: '56px repeat(7, 1fr)', borderBottom: '2px solid #808080' }}
        >
          <div className="w98-cal-header" />
          {days.map((day, i) => (
            <div
              key={i}
              className="w98-cal-header cursor-pointer hover:bg-[#d4d0c8]"
              onClick={() => onDateClick(day)}
              style={{
                background: isToday(day) ? '#000080' : undefined,
                color: isToday(day) ? '#ffffff' : '#000000',
                borderLeft: '1px solid #808080',
              }}
            >
              <div className="font-retro text-[13px]">{format(day, 'EEE')}</div>
              <div className="font-retro text-base font-bold leading-none">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        {HOURS.map(hour => (
          <div
            key={hour}
            className="grid"
            style={{ gridTemplateColumns: '56px repeat(7, 1fr)', borderBottom: '1px solid #e0e0e0' }}
          >
            {/* Time label */}
            <div
              className="font-retro text-[12px] text-[#808080] text-right pr-1 pt-[2px] bg-[#f0f0f0] flex-shrink-0"
              style={{ borderRight: '1px solid #c0c0c0' }}
            >
              {format(new Date(2000, 0, 1, hour), 'ha')}
            </div>

            {/* Day cells */}
            {days.map((day, di) => {
              const hourEvts = eventsAt(day, hour);
              return (
                <div
                  key={di}
                  className="min-h-[28px] cursor-pointer hover:bg-[#e8e8ff] p-[1px]"
                  style={{
                    background: isToday(day) ? '#fffff0' : '#ffffff',
                    borderLeft: '1px solid #e0e0e0',
                  }}
                  onClick={() => onDateClick(day)}
                >
                  {hourEvts.map(evt => (
                    <div
                      key={evt.id}
                      className="w98-event-pill"
                      onClick={e => { e.stopPropagation(); onEventClick(evt); }}
                      title={evt.title}
                    >
                      ▪ {evt.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}