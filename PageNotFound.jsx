import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, minimal = false, fullWidth = false }) {
  return (
    <div className="min-h-screen flex flex-col scanlines" style={{ background: 'var(--vp-dark)' }}>
      {!minimal && <Navbar />}
      <main className={`flex-1 w-full ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children}
      </main>
      {!minimal && <Footer />}
    </div>
  );
}