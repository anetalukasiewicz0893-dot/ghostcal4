import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ShowCard from '@/components/tv/ShowCard';
import ShowCardSkeleton from '@/components/tv/ShowCardSkeleton';
import { tvmaze } from '@/lib/tvmaze';
import { base44 } from '@/api/base44Client';
import { Search, Zap, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  // Load trending
  useEffect(() => {
    tvmaze.getTrending().then(shows => {
      setTrending(shows);
      setLoadingTrending(false);
    });
  }, []);

  // Load user's saved shows
  useEffect(() => {
    base44.entities.SavedShow.list().then(saved => {
      setSavedIds(new Set(saved.map(s => s.show_id)));
    }).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    const results = await tvmaze.search(query);
    setSearchResults(results);
    setLoadingSearch(false);
  };

  const handleSave = async (show) => {
    if (savedIds.has(show.id)) return;
    await base44.entities.SavedShow.create({
      show_id:     show.id,
      show_name:   show.name,
      show_image:  show.image,
      show_genres: show.genres,
      show_status: show.status,
      show_rating: show.rating,
      watch_status: 'plan_to_watch',
    });
    setSavedIds(prev => new Set([...prev, show.id]));
  };

  const displayShows = searchResults ?? trending;
  const isLoading = searchResults ? loadingSearch : loadingTrending;

  return (
    <Layout>
      {/* Hero */}
      <section className="text-center py-16 relative">
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,110,199,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 space-y-4 fade-up">
          <div className="font-pixel text-[10px] text-vp-cyan tracking-widest glow-cyan mb-4">
            ✦ WELCOME TO ✦
          </div>
          <h1 className="font-pixel text-3xl sm:text-4xl leading-tight">
            <span className="gradient-text">GHOSTCAL</span>
          </h1>
          <p className="font-retro text-xl text-purple-300/70 max-w-md mx-auto">
            Your appointments… from beyond the grave
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center max-w-xl mx-auto mt-8 gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vp-purple/60 pointer-events-none" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="SEARCH FOR A SHOW..."
                className="vp-input pl-12 py-3 font-orb tracking-wider"
                style={{ fontSize: 12 }}
              />
            </div>
            <button type="submit" className="vp-btn-primary py-3 px-6 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* Results / Trending */}
      <section className="pb-16">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            {searchResults
              ? <><Sparkles className="w-4 h-4 text-vp-pink" /><span className="font-orb text-xs tracking-widest text-vp-pink">SEARCH RESULTS</span></>
              : <><TrendingUp className="w-4 h-4 text-vp-cyan" /><span className="font-orb text-xs tracking-widest text-vp-cyan">TOP RATED SHOWS</span></>
            }
          </div>
          {searchResults && (
            <button onClick={() => { setSearchResults(null); setQuery(''); }}
              className="ml-auto font-orb text-[10px] text-purple-500 hover:text-vp-pink tracking-wider transition-colors">
              ← CLEAR RESULTS
            </button>
          )}
        </div>

        {/* Empty search */}
        {searchResults && searchResults.length === 0 && !loadingSearch && (
          <div className="vp-window text-center py-16 px-8">
            <div className="font-pixel text-vp-pink text-sm mb-4">NO SIGNAL</div>
            <p className="font-retro text-xl text-purple-400">
              No shows found for "{query}". Try a different search.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <ShowCardSkeleton key={i} />)
            : displayShows.map(show => (
                <ShowCard
                  key={show.id}
                  show={show}
                  isSaved={savedIds.has(show.id)}
                  onSave={handleSave}
                />
              ))
          }
        </div>
      </section>
    </Layout>
  );
}