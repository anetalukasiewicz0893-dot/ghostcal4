import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import EpisodeRow from '@/components/tv/EpisodeRow';
import { tvmaze } from '@/lib/tvmaze';
import { base44 } from '@/api/base44Client';
import { Star, Plus, Check, Globe, Tv2, ChevronLeft, Calendar, Users } from 'lucide-react';
import AffiliateLinks from '@/components/tv/AffiliateLinks';

export default function ShowDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [savedRecord, setSavedRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tvmaze.getShow(id).then(data => {
      setShow(data);
      setLoading(false);
    });
    // Check if saved
    base44.entities.SavedShow.filter({ show_id: Number(id) }).then(records => {
      setSavedRecord(records[0] ?? null);
    }).catch(() => {});
  }, [id]);

  const handleSave = async () => {
    if (saving || !show) return;
    setSaving(true);
    if (savedRecord) {
      await base44.entities.SavedShow.delete(savedRecord.id);
      setSavedRecord(null);
    } else {
      const record = await base44.entities.SavedShow.create({
        show_id:     show.id,
        show_name:   show.name,
        show_image:  show.image,
        show_genres: show.genres,
        show_status: show.status,
        show_rating: show.rating,
        watch_status: 'plan_to_watch',
      });
      setSavedRecord(record);
    }
    setSaving(false);
  };

  // Group episodes by season
  const seasons = show
    ? [...new Set(show.episodes.map(e => e.season))].sort((a, b) => a - b)
    : [];
  const episodesForSeason = show
    ? show.episodes.filter(e => e.season === selectedSeason)
    : [];

  if (loading) return <Layout><DetailSkeleton /></Layout>;
  if (!show) return (
    <Layout>
      <div className="vp-window text-center py-16">
        <div className="font-pixel text-vp-pink text-sm mb-4">SHOW NOT FOUND</div>
        <Link to="/shows" className="vp-btn-secondary inline-block mt-4">← BACK</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Back nav */}
      <Link to="/shows" className="inline-flex items-center gap-2 font-orb text-[10px] text-purple-400 hover:text-vp-pink tracking-widest mb-6 transition-colors">
        <ChevronLeft className="w-3 h-3" /> BACK TO SHOWS
      </Link>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Poster */}
        <div className="w-full md:w-56 flex-shrink-0">
          <div className="relative" style={{ boxShadow: '0 0 30px rgba(255,110,199,0.3), 0 0 60px rgba(180,79,255,0.2)' }}>
            {show.imageLg ? (
              <img src={show.imageLg} alt={show.name} className="w-full object-cover" style={{ border: '1px solid rgba(255,110,199,0.3)' }} />
            ) : (
              <div className="aspect-[2/3] flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d0a50)', border: '1px solid rgba(255,110,199,0.3)' }}>
                <Tv2 className="w-16 h-16 text-vp-pink/40" />
                <span className="font-retro text-vp-pink text-center px-4">{show.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="font-pixel text-2xl sm:text-3xl gradient-text leading-tight">{show.name}</h1>
            {show.network && (
              <div className="font-retro text-vp-cyan text-lg mt-1 glow-cyan">{show.network}</div>
            )}
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            {show.genres.map(g => (
              <span key={g} className="vp-badge-purple font-orb text-[9px] px-2 py-1">{g}</span>
            ))}
            <span className={`vp-badge font-orb text-[9px] px-2 py-1 ${show.status === 'Running' ? 'border-green-500/50 text-green-400 bg-green-500/10' : ''}`}>
              {show.status === 'Running' ? '● ' : '○ '}{show.status?.toUpperCase()}
            </span>
            {show.premiered && (
              <span className="vp-badge-cyan font-orb text-[9px] px-2 py-1 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                {show.premiered.slice(0,4)}
              </span>
            )}
            {show.rating && (
              <span className="vp-badge flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                {show.rating}/10
              </span>
            )}
          </div>

          {/* Summary */}
          {show.summary && (
            <p className="font-grotesk text-purple-200/80 text-sm leading-relaxed max-w-prose">{show.summary}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className={savedRecord ? 'vp-btn-secondary flex items-center gap-2' : 'vp-btn-primary flex items-center gap-2'}>
              {savedRecord
                ? <><Check className="w-4 h-4" /> SAVED</>
                : <><Plus className="w-4 h-4" /> ADD TO MY SHOWS</>
              }
            </button>
            {show.url && (
              <a href={show.url} target="_blank" rel="noopener noreferrer"
                className="vp-btn-secondary flex items-center gap-2">
                <Globe className="w-4 h-4" /> TVMAZE PAGE
              </a>
            )}
          </div>

          {/* Affiliate / Streaming Links */}
          <AffiliateLinks showId={show.id} showName={show.name} />

          {/* Cast */}
          {show.cast?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5 text-vp-purple" />
                <span className="font-orb text-[10px] text-vp-purple tracking-widest">CAST</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {show.cast.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 vp-card px-3 py-2">
                    {c.image
                      ? <img src={c.image} alt={c.name} className="w-8 h-8 object-cover rounded-full" style={{ border: '1px solid rgba(255,110,199,0.4)' }} />
                      : <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ background: 'linear-gradient(135deg,#1a0a2e,#2d0a50)', border: '1px solid rgba(255,110,199,0.3)' }}>👤</div>
                    }
                    <div>
                      <div className="font-grotesk text-xs text-white font-medium">{c.name}</div>
                      <div className="font-retro text-vp-pink text-sm">{c.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Episodes */}
      {show.episodes.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="font-orb text-[10px] text-vp-cyan tracking-widest glow-cyan">EPISODES</span>
            {/* Season tabs */}
            <div className="flex gap-1 flex-wrap">
              {seasons.map(s => (
                <button key={s} onClick={() => setSelectedSeason(s)}
                  className={`vp-tab ${selectedSeason === s ? 'active' : ''}`}>
                  S{String(s).padStart(2,'0')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {episodesForSeason.map(ep => <EpisodeRow key={ep.id} episode={ep} />)}
          </div>
        </section>
      )}
    </Layout>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-56 flex-shrink-0">
        <div className="aspect-[2/3] vp-skeleton" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-8 vp-skeleton rounded w-2/3" />
        <div className="h-4 vp-skeleton rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-6 w-16 vp-skeleton rounded" />
          <div className="h-6 w-16 vp-skeleton rounded" />
        </div>
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-4 vp-skeleton rounded" />)}
        </div>
      </div>
    </div>
  );
}