import React from 'react';
import { Link } from 'react-router-dom';
import { Tv2, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(61,32,96,0.5)', background: 'rgba(7,5,15,0.97)' }}>
      {/* Gradient top line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ff6ec7, #b44fff, #00f5ff, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#ff6ec7,#b44fff)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
                <Tv2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-pixel text-vp-pink text-xs glow-pink">TV TRACKER</span>
            </div>
            <p className="font-retro text-purple-400/60 text-base leading-relaxed">
              Track every episode.<br />
              Never miss a moment.<br />
              Est. {year}.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="font-orb text-[10px] text-vp-cyan tracking-widest mb-4 glow-cyan">NAVIGATE</div>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/shows' },
                { label: 'My Shows', to: '/my-shows' },
                { label: 'Register', to: '/register' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="font-grotesk text-sm text-purple-400/60 hover:text-vp-pink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System info */}
          <div>
            <div className="font-orb text-[10px] text-vp-purple tracking-widest mb-4 glow-purple">SYSTEM INFO</div>
            <div className="font-retro text-purple-400/50 text-base space-y-1">
              <div>VER 1.0.0 // STABLE</div>
              <div>POWERED BY TVMAZE API</div>
              <div>BEST VIEWED AT 1440×900</div>
              <div>© {year} TV TRACKER</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-vp-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-retro text-purple-500/40 text-sm">
            DATA PROVIDED BY TVMAZE.COM — FREE & OPEN API
          </div>
          <div className="flex items-center gap-1.5 font-retro text-sm text-purple-500/40">
            MADE WITH <Heart className="w-3 h-3 text-vp-pink fill-current" /> AND NEON
          </div>
        </div>
      </div>
    </footer>
  );
}