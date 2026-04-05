import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function EpisodeRow({ episode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="vp-card cursor-pointer select-none transition-all duration-150"
      style={{ marginBottom: 4 }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Episode number */}
        <div className="font-retro text-vp-cyan text-xl flex-shrink-0 w-16">
          S{String(episode.season).padStart(2,'0')}E{String(episode.number).padStart(2,'0')}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="font-grotesk text-sm font-medium text-white truncate">{episode.name}</div>
          {episode.airdate && (
            <div className="flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-vp-purple" />
              <span className="font-retro text-vp-purple text-sm">{episode.airdate}</span>
            </div>
          )}
        </div>

        {/* Runtime */}
        {episode.runtime && (
          <span className="vp-badge hidden sm:block flex-shrink-0">{episode.runtime}m</span>
        )}

        {/* Toggle */}
        <div className="flex-shrink-0 text-gray-600">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {open && episode.summary && (
        <div className="px-4 pb-3 text-sm text-purple-300/80 font-grotesk border-t border-vp-border/50 pt-2">
          {episode.summary}
        </div>
      )}
    </div>
  );
}