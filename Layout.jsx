import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

const SERVICES = ['Netflix', 'Hulu', 'HBO Max', 'Disney+', 'Prime Video', 'Apple TV+', 'Peacock', 'Paramount+', 'Other'];

export default function AffiliateLinks({ showId, showName }) {
  const [links, setLinks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ service_name: 'Netflix', url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.AffiliateLink.filter({ show_id: showId }).then(setLinks).catch(() => {});
  }, [showId]);

  const handleAdd = async () => {
    if (!form.url.trim()) return;
    setSaving(true);
    const record = await base44.entities.AffiliateLink.create({
      show_id: showId,
      show_name: showName,
      service_name: form.service_name,
      url: form.url.trim(),
    });
    setLinks(prev => [...prev, record]);
    setForm({ service_name: 'Netflix', url: '' });
    setAdding(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.AffiliateLink.delete(id);
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="w-3.5 h-3.5 text-vp-cyan" />
        <span className="font-orb text-[10px] text-vp-cyan tracking-widest">STREAM ON</span>
        <button
          onClick={() => setAdding(a => !a)}
          className="ml-auto vp-btn-secondary py-1 px-3 text-[9px] flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> ADD LINK
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="vp-card p-4 mb-3 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-shrink-0">
              <label className="font-orb text-[9px] text-vp-purple tracking-widest block mb-1">SERVICE</label>
              <select
                value={form.service_name}
                onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                className="vp-input py-1.5 text-xs font-orb"
                style={{ fontSize: 10, minWidth: 140 }}
              >
                {SERVICES.map(s => (
                  <option key={s} value={s} style={{ background: '#0d0a1a' }}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="font-orb text-[9px] text-vp-purple tracking-widest block mb-1">AFFILIATE URL</label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://your-affiliate-link.com/..."
                className="vp-input py-1.5 text-xs"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving || !form.url.trim()}
              className="vp-btn-primary py-1.5 px-4 text-[10px] disabled:opacity-40">
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
            <button onClick={() => setAdding(false)} className="vp-btn-secondary py-1.5 px-4 text-[10px]">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Links list */}
      {links.length === 0 && !adding ? (
        <div className="vp-card px-4 py-3 text-center">
          <p className="font-retro text-purple-500 text-sm">No streaming links added yet. Click ADD LINK to add your affiliate links.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-2 group"
              style={{ background: 'rgba(255,110,199,0.08)', border: '1px solid rgba(255,110,199,0.25)', padding: '6px 12px' }}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-orb text-[10px] text-vp-pink hover:text-white transition-colors tracking-wider"
              >
                <ExternalLink className="w-3 h-3" />
                {link.service_name}
              </a>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-purple-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}