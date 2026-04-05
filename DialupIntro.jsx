import React, { useState } from 'react';
import AppShell from '../components/retro/AppShell';
import RetroButton from '../components/retro/RetroButton';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const TIMEZONES = [
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
  'America/Anchorage','Pacific/Honolulu','UTC',
  'Europe/London','Europe/Paris','Europe/Berlin',
  'Asia/Tokyo','Asia/Shanghai','Asia/Kolkata',
  'Australia/Sydney','Pacific/Auckland',
];

const FieldRow = ({ label, children }) => (
  <div className="grid items-start" style={{ gridTemplateColumns: '140px 1fr', gap: 4 }}>
    <label className="font-retro text-base pt-[2px] text-right pr-2">{label}:</label>
    <div>{children}</div>
  </div>
);

const GroupBox = ({ title, children }) => (
  <div className="relative mt-3" style={{ border: '2px groove #808080', padding: '12px 10px 10px', background: '#c0c0c0' }}>
    <span
      className="font-retro text-base absolute bg-[#c0c0c0] px-1"
      style={{ top: -10, left: 8 }}
    >
      {title}
    </span>
    <div className="flex flex-col gap-2 mt-1">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const [timezone, setTimezone] = useState(localStorage.getItem('ghostcal_timezone') || 'America/New_York');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('ghostcal_sound') !== 'false');
  const [skipIntro,   setSkipIntro]   = useState(localStorage.getItem('ghostcal_skip_intro') === 'true');
  const [saved, setSaved] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const handleSave = () => {
    localStorage.setItem('ghostcal_timezone',   timezone);
    localStorage.setItem('ghostcal_sound',       soundEnabled.toString());
    localStorage.setItem('ghostcal_skip_intro',  skipIntro.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('Settings saved!');
  };

  return (
    <AppShell title="⚙️ Settings" statusText="Preferences — GhostCal v1.0">
      <div className="p-2 max-w-[480px] mx-auto flex flex-col gap-1">

        {/* User profile group */}
        <GroupBox title="👤 User Profile">
          <FieldRow label="Full name">
            <input className="w98-field w-full" value={user?.full_name || ''} readOnly />
          </FieldRow>
          <FieldRow label="Email">
            <input className="w98-field w-full" value={user?.email || ''} readOnly />
          </FieldRow>
          <FieldRow label="Role">
            <input className="w98-field w-[80px]" value={user?.role || 'user'} readOnly />
          </FieldRow>
        </GroupBox>

        {/* Calendar preferences group */}
        <GroupBox title="📅 Calendar Preferences">
          <FieldRow label="Default timezone">
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w98-field w-full"
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </FieldRow>
        </GroupBox>

        {/* Startup preferences */}
        <GroupBox title="🚀 Startup">
          <label className="flex items-center gap-2 font-retro text-base cursor-pointer">
            <input
              type="checkbox"
              checked={skipIntro}
              onChange={e => setSkipIntro(e.target.checked)}
              className="w98-checkbox"
            />
            Skip dial-up intro on launch
          </label>
          <label className="flex items-center gap-2 font-retro text-base cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              className="w98-checkbox"
            />
            Enable intro sound effects (visual toggle)
          </label>
        </GroupBox>

        {/* About group */}
        <GroupBox title="ℹ️ About">
          <div className="flex gap-4 items-start">
            <pre className="font-retro text-xs text-[#808080] leading-tight" style={{ fontFamily: 'Courier New, monospace' }}>
{`  .-.
 (o o)
 | O |
 '~~~'`}
            </pre>
            <div className="font-retro text-sm">
              <div className="font-bold text-base">GhostCal v1.0</div>
              <div className="text-[#808080]">© 2026 GhostCal Software, Inc.</div>
              <div className="text-[#808080] mt-1 italic">"Your appointments… from beyond the grave"</div>
              <div className="text-[#808080] text-xs mt-2">Best viewed at 800×600 resolution</div>
            </div>
          </div>
        </GroupBox>

        {/* Action buttons */}
        <div
          className="flex justify-end gap-2 pt-3 mt-1"
          style={{ borderTop: '1px solid #808080', boxShadow: '0 -1px 0 #ffffff' }}
        >
          {saved && <span className="font-retro text-base text-green-800 mr-2">✔ Saved!</span>}
          <RetroButton onClick={handleSave}>
            💾 Save Settings
          </RetroButton>
          <RetroButton onClick={() => {
            setTimezone('America/New_York');
            setSoundEnabled(true);
            setSkipIntro(false);
          }}>
            Reset Defaults
          </RetroButton>
        </div>
      </div>
    </AppShell>
  );
}