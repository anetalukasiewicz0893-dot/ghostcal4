function formatICSDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T20:00:00');
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function sanitize(str = '') {
  return str.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@tvtracker`;
}

export function exportShowsToICS(savedShowsWithEpisodes) {
  const events = [];

  for (const { show, episodes } of savedShowsWithEpisodes) {
    // Include ALL episodes (past + future) so saved shows always appear
    const allEps = Array.isArray(episodes) ? episodes : [];
    for (const ep of allEps) {
      if (!ep.airdate) continue;

      events.push([
        'BEGIN:VEVENT',
        `UID:${uid()}`,
        `DTSTART;VALUE=DATE:${ep.airdate.replace(/-/g, '')}`,
        `DTEND;VALUE=DATE:${ep.airdate.replace(/-/g, '')}`,
        `SUMMARY:${sanitize(`${show.name} — S${String(ep.season).padStart(2,'0')}E${String(ep.number).padStart(2,'0')} "${ep.name}"`)}`,
        `DESCRIPTION:${sanitize(ep.summary || 'New episode')}`,
        `CATEGORIES:TV,${sanitize(show.name)}`,
        'END:VEVENT',
      ].join('\r\n'));
    }
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GhostCal//My Shows//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:GhostCal — My Shows',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'ghostcal-my-shows.ics';
  a.click();
  URL.revokeObjectURL(url);
}