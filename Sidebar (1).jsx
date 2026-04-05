import React from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday
} from 'date-fns';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ currentDate, events, onDateClick, onEventClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  const eventsFor = (day) => events.filter(e => isSameDay(new Date(e.start_datetime), day));

  return (
    <div className="w98-sunken flex flex-col h-full" style={{ background: '#ffffff' }}>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 flex-shrink-0" style={{ borderBottom: '2px solid #808080' }}>
        {DAY_HEADERS.map(d => (
          <div key={d} className="w98-cal-header text-center font-retro" style={{ borderRight: '1px solid #808080' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: 'minmax(72px, 1fr)' }}>
        {days.map((day, idx) => {
          const dayEvts  = eventsFor(day);
          const inMonth  = isSameMonth(day, currentDate);
          const todayDay = isToday(day);

          let cellBg = '#ffffff';
          if (!inMonth)  cellBg = '#e8e8e8';
          if (todayDay)  cellBg = '#ffffc0';

          return (
            <div
              key={idx}
              onClick={() => onDateClick(day)}
              className="w98-cal-cell cursor-pointer"
              style={{ background: cellBg, borderRight: '1px solid #c0c0c0', borderBottom: '1px solid #c0c0c0' }}
            >
              {/* Date number */}
              <div
                className="font-retro text-sm leading-tight px-[2px]"
                style={{
                  color: !inMonth ? '#808080' : todayDay ? '#ffffff' : '#000000',
                  background: todayDay ? '#000080' : 'transparent',
                  display: 'inline-block',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {format(day, 'd')}
              </div>

              {/* Events */}
              <div className="mt-[2px] space-y-[1px] overflow-hidden">
                {dayEvts.slice(0, 3).map(evt => (
                  <div
                    key={evt.id}
                    className="w98-event-pill"
                    onClick={e => { e.stopPropagation(); onEventClick(evt); }}
                    title={evt.title}
                  >
                    ▪ {evt.title}
                  </div>
                ))}
                {dayEvts.length > 3 && (
                  <div className="font-retro text-[11px] text-[#808080] px-[2px]">
                    +{dayEvts.length - 3} more…
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}