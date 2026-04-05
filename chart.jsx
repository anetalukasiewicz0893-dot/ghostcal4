import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/retro/AppShell';
import EventModal from '../components/calendar/EventModal';
import RetroButton from '../components/retro/RetroButton';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function EventsListPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-start_datetime', 500),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Event.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); closeModal(); toast.success('Event updated!'); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); closeModal(); toast.success('Event deleted!'); },
  });

  const closeModal = () => { setShowModal(false); setSelectedEvent(null); };

  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.notes?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q);
  });

  const handleSave = (fd) => {
    if (selectedEvent?.id) updateMut.mutate({ id: selectedEvent.id, data: fd });
  };

  return (
    <AppShell title="📋 Events" statusText={`${filtered.length} event(s) shown`}>
      <div className="flex flex-col h-full gap-2 p-1">

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          <span className="font-retro text-base">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w98-field flex-1 min-w-[120px]"
            placeholder="Search events…"
          />
          <RetroButton
            size="sm"
            onClick={() => { setSelectedEvent(null); setShowModal(false); setSearch(''); }}
          >
            Clear
          </RetroButton>
        </div>

        {/* Column headers */}
        <div
          className="grid font-retro text-sm bg-[#c0c0c0] flex-shrink-0"
          style={{
            gridTemplateColumns: '56px 1fr 110px 110px 80px',
            borderBottom: '2px solid #808080',
            borderTop: '2px solid #ffffff',
          }}
        >
          <div className="px-1 py-[2px] border-r border-[#808080]">Date</div>
          <div className="px-1 py-[2px] border-r border-[#808080]">Title / Location</div>
          <div className="px-1 py-[2px] border-r border-[#808080] hidden sm:block">Start</div>
          <div className="px-1 py-[2px] border-r border-[#808080] hidden sm:block">End</div>
          <div className="px-1 py-[2px]">Actions</div>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="font-retro text-base text-center py-6">⌛ Loading…</div>
        ) : filtered.length === 0 ? (
          <div
            className="w98-sunken bg-white text-center py-8 font-retro"
          >
            <div className="text-lg mb-1">No events found 👻</div>
            <div className="text-sm text-[#808080]">
              {search ? 'Try a different search term' : 'Create your first event from the Calendar page'}
            </div>
          </div>
        ) : (
          <div className="w98-sunken bg-white flex-1 overflow-auto min-h-0">
            {filtered.map((evt, idx) => (
              <div
                key={evt.id}
                className="grid items-center font-retro text-sm cursor-pointer"
                style={{
                  gridTemplateColumns: '56px 1fr 110px 110px 80px',
                  background: idx % 2 === 0 ? '#ffffff' : '#f8f8f8',
                  borderBottom: '1px solid #e0e0e0',
                }}
                onClick={() => { setSelectedEvent(evt); setShowModal(true); }}
              >
                {/* Date badge */}
                <div
                  className="flex flex-col items-center justify-center py-1 border-r border-[#e0e0e0]"
                  style={{ background: '#000080', color: '#fff', height: '100%' }}
                >
                  <span style={{ fontSize: 11 }}>{format(new Date(evt.start_datetime), 'MMM')}</span>
                  <span className="font-bold text-base leading-tight">{format(new Date(evt.start_datetime), 'd')}</span>
                </div>

                {/* Title + location */}
                <div className="px-2 py-1 min-w-0 border-r border-[#e0e0e0]">
                  <div className="font-bold truncate">{evt.title}</div>
                  {evt.location && (
                    <div className="text-[#808080] text-xs truncate">📍 {evt.location}</div>
                  )}
                  {evt.notes && (
                    <div className="text-[#808080] text-xs truncate">{evt.notes}</div>
                  )}
                </div>

                {/* Start */}
                <div className="px-2 py-1 border-r border-[#e0e0e0] hidden sm:block whitespace-nowrap">
                  {format(new Date(evt.start_datetime), 'h:mm a')}
                </div>

                {/* End */}
                <div className="px-2 py-1 border-r border-[#e0e0e0] hidden sm:block whitespace-nowrap">
                  {format(new Date(evt.end_datetime), 'h:mm a')}
                </div>

                {/* Actions */}
                <div className="px-1 py-1 flex gap-1 items-center">
                  <button
                    className="w98-btn text-sm px-1"
                    style={{ minHeight: 18 }}
                    onClick={e => { e.stopPropagation(); setSelectedEvent(evt); setShowModal(true); }}
                    title="Edit"
                  >✏</button>
                  <button
                    className="w98-btn text-sm px-1"
                    style={{ minHeight: 18 }}
                    onClick={e => { e.stopPropagation(); deleteMut.mutate(evt.id); }}
                    title="Delete"
                  >🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="w98-statusbar flex-shrink-0 -mx-1 -mb-1">
          <div className="w98-statusbar-panel flex-1 font-retro text-sm">
            {filtered.length} of {events.length} event(s)
          </div>
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleSave}
          onDelete={(id) => deleteMut.mutate(id)}
          onClose={closeModal}
        />
      )}
    </AppShell>
  );
}