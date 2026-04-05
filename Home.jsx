import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Tv2, Sparkles } from 'lucide-react';

export default function Register() {
  return (
    <Layout minimal>
      <div className="min-h-screen flex items-center justify-center p-4 grid-bg"
        style={{ background: 'var(--vp-darker)' }}>
        {/* Ambient glows */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,110,199,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="vp-window w-full max-w-sm relative z-10 fade-up">
          {/* Window title bar */}
          <div className="vp-window-title">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              TV_TRACKER — NEW_USER.EXE
            </div>
            <div className="flex gap-1.5">
              <span className="vp-window-btn" style={{ background: '#4ade80' }} />
              <span className="vp-window-btn" style={{ background: '#fbbf24' }} />
              <span className="vp-window-btn" style={{ background: '#f87171' }} />
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Logo */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto flex items-center justify-center pulse-glow"
                style={{ background: 'linear-gradient(135deg,#ff6ec7,#b44fff)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
                <Tv2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-pixel text-sm gradient-text">CREATE ACCOUNT</h1>
              <p className="font-retro text-purple-400 text-base">Join the tracker universe</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-orb text-[10px] text-vp-cyan tracking-widest block mb-1">DISPLAY NAME</label>
                <input type="text" placeholder="Jane Doe" className="vp-input" />
              </div>
              <div>
                <label className="font-orb text-[10px] text-vp-cyan tracking-widest block mb-1">EMAIL ADDRESS</label>
                <input type="email" placeholder="you@example.com" className="vp-input" />
              </div>
              <div>
                <label className="font-orb text-[10px] text-vp-cyan tracking-widest block mb-1">PASSWORD</label>
                <input type="password" placeholder="••••••••" className="vp-input" />
              </div>
            </div>

            <button className="vp-btn-primary w-full justify-center flex items-center gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              CREATE ACCOUNT
            </button>

            <p className="font-retro text-center text-purple-500 text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-vp-pink hover:text-vp-purple transition-colors">Sign in →</Link>
            </p>

            {/* Footer note */}
            <div className="vp-badge-cyan text-center font-retro text-sm py-2 block w-full">
              ✦ AUTHENTICATION MANAGED BY PLATFORM ✦
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}