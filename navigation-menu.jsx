import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MESSAGES = [
  { text: 'GHOSTCAL v1.0 — Copyright © 2026 GhostCal Software, Inc.',  delay: 0   },
  { text: 'Initializing modem driver…',                                  delay: 300 },
  { text: 'Dialing 1-800-GHOST-CAL…',                                   delay: 700 },
  { text: 'ATDT 18004468722',                                            delay: 1000 },
  { text: '>>> CONNECT 28800 bps <<<',                                   delay: 1500 },
  { text: 'Authenticating with spirit realm… OK',                        delay: 2000 },
  { text: 'Handshaking with ectoplasmic server… OK',                     delay: 2500 },
  { text: 'Downloading phantom calendar data…',                          delay: 3000 },
  { text: 'Synchronizing schedules from the void… DONE',                 delay: 3600 },
  { text: '>>> CONNECTION ESTABLISHED — Welcome to GhostCal <<<',        delay: 4100 },
];

export default function DialupIntro() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // Check skip pref
  useEffect(() => {
    if (localStorage.getItem('ghostcal_skip_intro') === 'true') {
      navigate('/calendar', { replace: true });
    }
  }, [navigate]);

  // Reveal messages one by one
  useEffect(() => {
    const timers = MESSAGES.map((m, i) =>
      setTimeout(() => setVisibleCount(i + 1), m.delay)
    );
    const doneTimer = setTimeout(() => setDone(true), 4700);
    return () => { timers.forEach(clearTimeout); clearTimeout(doneTimer); };
  }, []);

  // Animate progress bar
  useEffect(() => {
    const steps = [
      [400,  8], [700, 12], [1000, 18], [1400, 30],
      [1800, 45],[2200, 58],[2700, 72], [3200, 85],
      [3700, 94],[4100, 100],
    ];
    const timers = steps.map(([ms, val]) => setTimeout(() => setProgress(val), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Navigate when done
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate('/calendar', { replace: true }), 500);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 scanlines"
      style={{ background: '#008080' }}
    >
      {/* Outer desktop window */}
      <div className="w98-window w-full max-w-[560px]">

        {/* Title bar */}
        <div className="w98-titlebar">
          <div className="flex items-center gap-2">
            <span className="text-base">👻</span>
            <span className="font-retro text-base">GhostCal — Connecting to Network</span>
          </div>
          <div className="flex gap-[2px]">
            <button className="w98-titlebar-btn">_</button>
            <button className="w98-titlebar-btn">□</button>
            <button
              className="w98-titlebar-btn font-bold"
              onClick={() => navigate('/calendar', { replace: true })}
              title="Skip intro"
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="bg-[#c0c0c0] p-3 flex flex-col gap-3">

          {/* Terminal window */}
          <div
            className="w98-sunken font-retro text-sm leading-snug p-2 overflow-hidden"
            style={{ background: '#000000', minHeight: 200, color: '#00cc00' }}
          >
            {MESSAGES.slice(0, visibleCount).map((m, i) => (
              <div
                key={i}
                className="fade-in"
                style={{ color: m.text.startsWith('>>>') ? '#00ff00' : '#00cc00', fontWeight: m.text.startsWith('>>>') ? 'bold' : 'normal' }}
              >
                {m.text}
              </div>
            ))}
            {visibleCount < MESSAGES.length && (
              <span className="blink" style={{ color: '#00ff00' }}>█</span>
            )}
          </div>

          {/* Progress section */}
          <div>
            <div className="font-retro text-base mb-1 flex justify-between">
              <span>Connecting to GhostCal Network…</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div
              className="w98-sunken bg-white"
              style={{ height: 20, overflow: 'hidden' }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  transition: 'width 0.4s linear',
                  background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 10px, #0000b0 10px, #0000b0 20px)',
                }}
              />
            </div>
          </div>

          {/* Modem info row */}
          <div className="w98-sunken bg-white p-2 font-retro text-sm flex gap-4 items-center">
            <div>
              <div className="text-[#808080] text-xs">Speed</div>
              <div className="font-bold">28,800 bps</div>
            </div>
            <div>
              <div className="text-[#808080] text-xs">Protocol</div>
              <div className="font-bold">Ectoplasm/IP</div>
            </div>
            <div>
              <div className="text-[#808080] text-xs">Realm</div>
              <div className="font-bold">Spirit Network</div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div
                className="w-3 h-3 rounded-full blink"
                style={{ background: progress > 0 && progress < 100 ? '#00cc00' : progress === 100 ? '#00ff00' : '#808080' }}
              />
              <span className="text-xs text-[#808080]">TX/RX</span>
            </div>
          </div>

          {/* ASCII art + buttons row */}
          <div className="flex items-end justify-between">
            <pre
              className="font-retro text-xs text-[#808080] leading-tight select-none"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
{`  .-.   GhostCal v1.0
 (o o)  © 2026 GhostCal
 | O |  Software, Inc.
 '~~~'  Best @ 800x600`}
            </pre>

            <div className="flex flex-col gap-1 items-end">
              {/* Sound toggle */}
              <label className="flex items-center gap-2 font-retro text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundOn}
                  onChange={e => setSoundOn(e.target.checked)}
                  className="w98-checkbox"
                />
                Enable sounds
              </label>

              {/* Skip */}
              <button
                className="w98-btn font-retro text-base"
                onClick={() => navigate('/calendar', { replace: true })}
              >
                Skip intro ▶▶
              </button>
            </div>
          </div>

          {/* Status bar at bottom */}
          <div className="w98-statusbar -mx-3 -mb-3 px-2">
            <div className="w98-statusbar-panel flex-1 font-retro text-sm">
              {progress < 100
                ? `Connecting… ${progress}% complete`
                : '✓ Connection established — launching GhostCal…'}
            </div>
            <div className="w98-statusbar-panel font-retro text-sm w-20 text-center">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}