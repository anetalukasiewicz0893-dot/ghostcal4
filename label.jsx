import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { base44 } from '@/api/base44Client';
import { tvmaze } from '@/lib/tvmaze';
import { exportShowsToICS } from '@/lib/icalExport';
import { Trash2, Download, Star, Tv2, RefreshCw } from 'lucide-react';

const STATUSES = [
  { key: 'all',           label: 'ALL' },
  { key: 'watching',      label: 'WATCHING' },
  { key: 'completed',     label: 'COMPLETED' },
  { key: 'plan_to_watch', label: 'PLAN TO WATCH' },
  { key: 'on_hold',       label: 'ON HOLD' },
  { key: 'dropped',       label: 'DROPPED' },
];

const STATUS_COLORS = {
  watching:      { color: '#00f5ff', bg: 'rgba(0,245,255,0.1)',   border: 'rgba(0,245,255,0.4)' },
  completed:     { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.4)' },
  plan_to_watch: { color: '#ff6ec7', bg: 'rgba(255,110,199,0.1)', border: 'rgba(255,110,199,0.4)' },
  on_hold:       { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.4)' },
  dropped:       { color: '#808080', bg: 'rgba(128,128,128,0.1)', border: 'rgba(128,128,128,0.3)' },
};

export default function MyShows() {
  const [activeTab, setActiveTab] = useState('all');
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadSaved = async () => {
    setLoading(true);
    const records = await base44.entities.SavedShow.list('-created_date');
    setSaved(records);
    setLoading(false);
  };

  useEffect(() => { loadSaved(); }, []);

  const handleRemove = async (id) => {
    await base44.entities.SavedShow.delete(id);
    setSaved(prev => prev.filter(s => s.id !== id));
  };

  const handleStatusChange = async (id, watch_status) => {
    await base44.entities.SavedShow.update(id, { watch_status });
    setSaved(prev => prev.map(s => s.id === id ? { ...s, watch_status } : s));
  };

  const handleExport = async () => {
    if (exporting || saved.length === 0) return;
    setExporting(true);
    const withEpisodes = await Promise.all(
      saved.map(async s => ({
        show: { name: s.show_name, id: s.show_id },
        episodes: await tvmaze.getEpisodes(s.show_id),
      }))
    );
    exportShowsToICS(withEpisodes);
    setExporting(false);
  };

  const filtered = activeTab === 'all' ? saved : saved.filter(s => s.watch_status === activeTab);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-pixel text-2xl gradient-text">MY SHOWS</h1>
          <p className="font-retro text-vp-cyan text-lg mt-1 glow-cyan">{saved.length} SHOWS TRACKED</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} disabled={exporting || saved.length === 0}
            className="vp-btn-secondary flex items-center gap-2 disabled:opacity-40">
            {exporting
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Download className="w-4 h-4" />
            }
            EXPORT ICAL
          </button>
          <Link to="/shows" className="vp-btn-primary flex items-center gap-2">
            + BROWSE SHOWS
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-6" style={{ borderBottom: '1px solid rgba(61,32,96,0.5)' }}>
        {STATUSES.map(s => (
          <button key={s.key} onClick={() => setActiveTab(s.key)}
            className={`vp-tab ${activeTab === s.key ? 'active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="vp-window text-center py-20">
          <div className="font-pixel text-vp-pink text-xs mb-6">NO SHOWS FOUND</div>
          <Tv2 className="w-16 h-16 text-purple-700 mx-auto mb-4" />
          <p className="font-retro text-xl text-purple-400 mb-6">
            {activeTab === 'all'
              ? "Your show list is empty. Start discovering!"
              : `No shows marked as "${activeTab.replace(/_/g,' ')}"`
            }
          </p>
          <Link to="/shows" className="vp-btn-primary inline-flex items-center gap-2">
            BROWSE SHOWS
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vp-card p-4 flex gap-4">
              <div className="w-16 h-24 vp-skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 vp-skeleton rounded w-3/4" />
                <div className="h-3 vp-skeleton rounded w-1/2" />
                <div className="h-3 vp-skeleton rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show list */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => {
            const sc = STATUS_COLORS[s.watch_status] ?? STATUS_COLORS.plan_to_watch;
            return (
              <div key={s.id} className="vp-card p-4 flex gap-4 show-card">
                {/* Poster */}
                <Link to={`/show?id=${s.show_id}`} className="flex-shrink-0">
                  {s.show_image ? (
                    <img src={s.show_image} alt={s.show_name}
                      className="w-16 h-24 object-cover"
                      style={{ border: '1px solid rgba(255,110,199,0.3)' }} />
                  ) : (
                    <div className="w-16 h-24 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#1a0a2e,#2d0a50)', border: '1px solid rgba(255,110,199,0.3)' }}>
                      <Tv2 className="w-6 h-6 text-vp-pink/40" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Link to={`/show?id=${s.show_id}`}
                    className="font-grotesk font-semibold text-white text-sm leading-tight block hover:text-vp-pink transition-colors truncate">
                    {s.show_name}
                  </Link>

                  {s.show_genres?.length > 0 && (
                    <div className="font-retro text-vp-purple text-sm">{s.show_genres.slice(0,2).join(' · ')}</div>
                  )}

                  {s.show_rating && (
                    <div className="flex items-center gap-1 vp-badge w-fit">
                      <Star className="w-2.5 h-2.5 fill-current" />{s.show_rating}
                    </div>
                  )}

                  {/* Status select */}
                  <select
                    value={s.watch_status}
                    onChange={e => handleStatusChange(s.id, e.target.value)}
                    className="vp-input py-1 text-xs font-orb"
                    style={{ fontSize: 9, letterSpacing: '0.5px', color: sc.color, borderColor: sc.border, background: sc.bg }}>
                    {STATUSES.filter(st => st.key !== 'all').map(st => (
                      <option key={st.key} value={st.key} style={{ background: '#0d0a1a', color: '#e8d5ff' }}>{st.label}</option>
                    ))}
                  </select>
                </div>

                {/* Remove */}
                <button onClick={() => handleRemove(s.id)}
                  className="flex-shrink-0 text-purple-700 hover:text-red-400 transition-colors self-start mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}