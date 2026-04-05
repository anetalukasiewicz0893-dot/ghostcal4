// TVMaze API — free, no key required
const BASE = 'https://api.tvmaze.com';

export const tvmaze = {
  // Search shows by query
  search: async (query) => {
    const res = await fetch(`${BASE}/search/shows?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.map(r => normalizeShow(r.show));
  },

  // Get a single show by ID
  getShow: async (id) => {
    const res = await fetch(`${BASE}/shows/${id}?embed[]=episodes&embed[]=cast`);
    const data = await res.json();
    return normalizeShow(data);
  },

  // Get episodes for a show
  getEpisodes: async (id) => {
    const res = await fetch(`${BASE}/shows/${id}/episodes`);
    const data = await res.json();
    return data.map(normalizeEpisode);
  },

  // Schedule — what's on today (US)
  getSchedule: async () => {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`${BASE}/schedule?country=US&date=${today}`);
    const data = await res.json();
    return data.slice(0, 40).map(e => normalizeShow(e.show));
  },

  // "Trending" — page 0 of shows index sorted by weight
  getTrending: async () => {
    const res = await fetch(`${BASE}/shows?page=0`);
    const data = await res.json();
    return data
      .filter(s => s.image && s.rating?.average)
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 20)
      .map(normalizeShow);
  },

  // Upcoming episodes for a show (airing after today)
  getUpcoming: async (id) => {
    const episodes = await tvmaze.getEpisodes(id);
    const now = new Date();
    return episodes.filter(e => e.airdate && new Date(e.airdate) > now);
  },
};

function normalizeShow(s) {
  return {
    id:       s.id,
    name:     s.name,
    summary:  stripHtml(s.summary ?? ''),
    genres:   s.genres ?? [],
    status:   s.status ?? '',
    language: s.language ?? '',
    rating:   s.rating?.average ?? null,
    network:  s.network?.name ?? s.webChannel?.name ?? '',
    premiered:s.premiered ?? '',
    image:    s.image?.medium ?? s.image?.original ?? null,
    imageLg:  s.image?.original ?? s.image?.medium ?? null,
    url:      s.url ?? '',
    // embedded data if fetched with ?embed
    episodes: s._embedded?.episodes?.map(normalizeEpisode) ?? [],
    cast:     s._embedded?.cast?.slice(0, 8).map(c => ({
      name:      c.person?.name,
      character: c.character?.name,
      image:     c.person?.image?.medium ?? null,
    })) ?? [],
  };
}

function normalizeEpisode(e) {
  return {
    id:      e.id,
    name:    e.name,
    season:  e.season,
    number:  e.number,
    airdate: e.airdate,
    runtime: e.runtime,
    summary: stripHtml(e.summary ?? ''),
    image:   e.image?.medium ?? null,
  };
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}