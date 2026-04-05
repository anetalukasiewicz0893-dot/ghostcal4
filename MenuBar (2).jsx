import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';

export default function ShowCard({ show, isSaved, onSave, compact = false }) {
  const rating = show.rating ? show.rating.toFixed(1) : null;

  return (
    <Link
      to={`/show?id=${show.id}`}
      className="show-card block group relative"
      style={{ textDecoration: 'none' }}
    >
      <div className="vp-card overflow-hidden h-full">
        {/* Poster */}
        <div className={`relative overflow-hidden ${compact ? 'aspect-[2/3]' : 'aspect-[2/3]'}`}>
          {show.image ? (
            <img
              src={show.image}
              alt={show.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d0a50)' }}>
              <span className="text-4xl">📺</span>
              <span className="font-retro text-vp-pink text-sm text-center px-2">{show.name}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
            style={{ background: 'rgba(13,8,30,0.7)' }}>
            <span className="font-orb text-white text-xs tracking-widest border border-white/30 px-3 py-1">
              VIEW DETAILS
            </span>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 vp-badge">
              <Star className="w-2.5 h-2.5 fill-current" />
              {rating}
            </div>
          )}

          {/* Save button */}
          {onSave && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onSave(show); }}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center transition-all duration-200"
              style={{
                background: isSaved ? 'rgba(255,110,199,0.9)' : 'rgba(13,8,30,0.8)',
                border: `1px solid ${isSaved ? '#ff6ec7' : 'rgba(255,110,199,0.4)'}`,
                boxShadow: isSaved ? '0 0 12px rgba(255,110,199,0.6)' : 'none',
              }}
              title={isSaved ? 'Saved' : 'Save to My Shows'}
            >
              {isSaved
                ? <Check className="w-3.5 h-3.5 text-white" />
                : <Plus className="w-3.5 h-3.5 text-vp-pink" />
              }
            </button>
          )}
        </div>

        {/* Info */}
        {!compact && (
          <div className="p-3 space-y-1.5">
            <h3 className="font-grotesk font-semibold text-sm text-white leading-tight line-clamp-1 group-hover:text-vp-pink transition-colors">
              {show.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {show.genres?.slice(0, 2).map(g => (
                <span key={g} className="vp-badge-cyan text-[9px] px-1.5 py-0.5"
                  style={{ fontFamily: 'Orbitron', letterSpacing: '0.5px' }}>
                  {g}
                </span>
              ))}
              {show.status && (
                <span className={`text-[9px] font-orb ${show.status === 'Running' ? 'text-green-400' : 'text-gray-500'}`}>
                  {show.status === 'Running' ? '● LIVE' : '○ ENDED'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}