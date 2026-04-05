import React, { useState, useEffect } from 'react';
import WindowFrame from '../retro/WindowFrame';
import RetroButton from '../retro/RetroButton';
import { format } from 'date-fns';

const TIMEZONES = [
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
  'America/Anchorage','Pacific/Honolulu','UTC',
  'Europe/London','Europe/Paris','Europe/Berlin',
  'Asia/Tokyo','Asia/Shanghai','Asia/Kolkata',
  'Australia/Sydney','Pacific/Auckland',
];

const defaultStart = (d) => {
  const dt = d ? new Date(d) : new Date();
  dt.setHours(9, 0, 0, 0);
  return format(dt, "yyyy-MM-dd'T'HH:mm");
};
const defaultEnd = (d) => {
  const dt = d ? new Date(d) : new Date();
  dt.setHours(10, 0, 0, 0);
  return format(dt, "yyyy-MM-dd'T'HH:mm");
};

const LabelRow = ({ label, error, children }) => (
  <div>
    <label className="font-retro text-base block mb-[2px]">{label}</label>
    {children}
    {error && <div className="font-retro text-sm text-red-700 mt-[2px]">⚠ {error}</div>}
  </div>
);

export default function EventModal({ event, selectedDate, onSave, onDelete, onClose }) {
  const isEdit = !!event?.id;

  const [form, setForm] = useState({
    title: '',
    start_datetime: defaultStart(selectedDate),
    end_datetime:   defaultEnd(selectedDate),
    notes: '',
    location: '',
    timezone: localStorage.getItem('ghostcal_timezone') || 'America/New_York',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setForm({
        title:          event.title || '',
        start_datetime: event.start_datetime ? format(new Date(event.start_datetime), "yyyy-MM-dd'T'HH:mm") : defaultStart(null),
        end_datetime:   event.end_datetime   ? format(new Date(event.end_datetime),   "yyyy-MM-dd'T'HH:mm") : defaultEnd(null),
        notes:          event.notes    || '',
        location:       event.location || '',
        timezone:       event.timezone || localStorage.getItem('ghostcal_timezone') || 'America/New_York',
      });
    }
  }, [event]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.start_datetime) e.start_datetime = 'Required';
    if (!form.end_datetime)   e.end_datetime   = 'Required';
    if (form.start_datetime && form.end_datetime &&
        new Date(form.start_datetime) >= new Date(form.end_datetime))
      e.end_datetime = 'End must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      start_datetime: new Date(form.start_datetime).toISOString(),
      end_datetime:   new Date(form.end_datetime).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <WindowFrame
        title={isEdit ? '📝 Edit Event' : '📅 New Event'}
        onClose={onClose}
        className="w-full max-w-md"
      >
        <div className="p-2 flex flex-col gap-2 font-retro bg-[#c0c0c0]">

          {/* Title */}
          <LabelRow label="Title *" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w98-field w-full"
              placeholder="Event title…"
              autoFocus
            />
          </LabelRow>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-2">
            <LabelRow label="Start *" error={errors.start_datetime}>
              <input
                type="datetime-local"
                value={form.start_datetime}
                onChange={e => set('start_datetime', e.target.value)}
                className="w98-field w-full text-sm"
              />
            </LabelRow>
            <LabelRow label="End *" error={errors.end_datetime}>
              <input
                type="datetime-local"
                value={form.end_datetime}
                onChange={e => set('end_datetime', e.target.value)}
                className="w98-field w-full text-sm"
              />
            </LabelRow>
          </div>

          {/* Location */}
          <LabelRow label="Location">
            <input
              type="text"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              className="w98-field w-full"
              placeholder="Where?"
            />
          </LabelRow>

          {/* Timezone */}
          <LabelRow label="Timezone">
            <select
              value={form.timezone}
              onChange={e => set('timezone', e.target.value)}
              className="w98-field w-full"
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </LabelRow>

          {/* Notes */}
          <LabelRow label="Notes">
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="w98-field w-full resize-none"
              rows={3}
              placeholder="Additional notes…"
            />
          </LabelRow>

          {/* Separator */}
          <div className="w98-groove my-1" />

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <div>
              {isEdit && (
                <RetroButton onClick={() => onDelete(event.id)}>
                  🗑 Delete
                </RetroButton>
              )}
            </div>
            <div className="flex gap-2">
              <RetroButton onClick={onClose}>Cancel</RetroButton>
              <RetroButton onClick={submit}>
                {isEdit ? '💾 Save' : '✔ Create'}
              </RetroButton>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}