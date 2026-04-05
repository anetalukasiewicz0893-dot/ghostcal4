import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/retro/AppShell';
import CalendarToolbar from '../components/calendar/CalendarToolbar';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import EventModal from '../components/calendar/EventModal';
import { exportToICS } from '../lib/icalExport';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-start_datetime', 500),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.Event.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); closeModal(); toast.success('Event created!'); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Event.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); closeModal(); toast.success('Event updated!'); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); closeModal(); toast.success('Event deleted!'); },
  });

  const closeModal = () => { setShowModal(false); setSelectedEvent(null); setSelectedDate(null); };

  const handleSave = (fd) => {
    if (selectedEvent?.id) updateMut.mutate({ id: selectedEvent.id, data: fd });
    else                   createMut.mutate(fd);
  };

  const handleExport = () => {
    if (!events.length) { toast.error('No events to export!'); return; }
    exportToICS(events);
    toast.success(`Exported ${events.length} event(s) to ghostcal.ics`);
  };

  const handleMenuAction = (action) => {
    if (action === 'newEvent')   { setSelectedEvent(null); setSelectedDate(null); setShowModal(true); }
    if (action === 'export')     handleExport();
    if (action === 'viewMonth')  setView('month');
    if (action === 'viewWeek')   setView('week');
    if (action === 'viewDay')    setView('day');
  };

  const statusText = isLoading
    ? 'Loading events…'
    : `${events.length} event(s) — ${format(currentDate, 'MMMM yyyy')} — ${view} view`;

  return (
    <AppShell title="📅 Calendar" onMenuAction={handleMenuAction} statusText={statusText}>
      <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 160px)' }}>
        {/* Toolbar */}
        <CalendarToolbar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          view={view}
          onViewChange={setView}
          onAddEvent={() => { setSelectedEvent(null); setSelectedDate(null); setShowModal(true); }}
          onExport={handleExport}
        />

        {/* Calendar body */}
        <div className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: 400 }}>
          {isLoading ? (
            <div
              className="h-full flex flex-col items-center justify-center font-retro bg-white gap-3"
              style={{ border: '2px inset #808080' }}
            >
              <div className="text-lg">⌛ Loading events…</div>
              <div className="w98-sunken bg-white" style={{ width: 240, height: 16 }}>
                <div
                  className="h-full"
                  style={{
                    width: '60%',
                    background: 'repeating-linear-gradient(90deg,#000080,#000080 10px,#0000b0 10px,#0000b0 20px)',
                  }}
                />
              </div>
              <div className="text-sm text-[#808080]">Please wait, connecting to database…</div>
            </div>
          ) : (
            <div style={{ height: '100%', minHeight: 400 }}>
              {view === 'month' && (
                <MonthView
                  currentDate={currentDate} events={events}
                  onDateClick={(d) => { setSelectedDate(d); setSelectedEvent(null); setShowModal(true); }}
                  onEventClick={(e) => { setSelectedEvent(e); setSelectedDate(null); setShowModal(true); }}
                />
              )}
              {view === 'week' && (
                <WeekView
                  currentDate={currentDate} events={events}
                  onDateClick={(d) => { setSelectedDate(d); setSelectedEvent(null); setShowModal(true); }}
                  onEventClick={(e) => { setSelectedEvent(e); setSelectedDate(null); setShowModal(true); }}
                />
              )}
              {view === 'day' && (
                <DayView
                  currentDate={currentDate} events={events}
                  onEventClick={(e) => { setSelectedEvent(e); setSelectedDate(null); setShowModal(true); }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSave}
          onDelete={(id) => deleteMut.mutate(id)}
          onClose={closeModal}
        />
      )}
    </AppShell>
  );
}