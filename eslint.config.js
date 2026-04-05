/**
 * base44Client.js — localStorage shim for Cloudflare Pages deployment.
 * Replaces the @base44/sdk with a simple CRUD store backed by localStorage.
 */

let idCounter = Date.now();
const uid = () => String(++idCounter);

function makeStore(name) {
  const key = `ghostcal_${name}`;
  const load = () => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  };
  const save = (rows) => localStorage.setItem(key, JSON.stringify(rows));

  return {
    list: async (sortField) => {
      let rows = load();
      if (sortField) {
        const desc = sortField.startsWith('-');
        const field = desc ? sortField.slice(1) : sortField;
        rows = [...rows].sort((a, b) => {
          const av = a[field] ?? '';
          const bv = b[field] ?? '';
          return desc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
        });
      }
      return rows;
    },
    filter: async (predicate) => {
      const rows = load();
      return rows.filter(row =>
        Object.entries(predicate).every(([k, v]) => row[k] === v)
      );
    },
    create: async (data) => {
      const rows = load();
      const record = { id: uid(), created_date: new Date().toISOString(), ...data };
      rows.push(record);
      save(rows);
      return record;
    },
    update: async (id, data) => {
      const rows = load();
      const idx = rows.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Not found');
      rows[idx] = { ...rows[idx], ...data };
      save(rows);
      return rows[idx];
    },
    delete: async (id) => {
      const rows = load();
      save(rows.filter(r => r.id !== id));
    },
  };
}

export const base44 = {
  entities: {
    SavedShow: makeStore('SavedShow'),
    Event: makeStore('Event'),
    AffiliateLink: makeStore('AffiliateLink'),
  },
  auth: {
    me: async () => ({ id: 'local', email: 'local@ghostcal.app', full_name: 'Local User' }),
    logout: () => {},
    redirectToLogin: () => {},
  },
};
