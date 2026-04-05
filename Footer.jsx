import React from 'react';
import { Link } from 'react-router-dom';
import { Tv } from 'lucide-react';

export default function AuthCard({ title, subtitle, footer, children }) {
  return (
    <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-xl p-8 space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          <Tv className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>

      {/* Form slot */}
      {children}

      {/* Footer link */}
      {footer && (
        <p className="text-center text-sm text-gray-500">
          {footer.text}{' '}
          <Link to={footer.linkTo} className="text-indigo-400 hover:text-indigo-300 font-medium">
            {footer.linkLabel}
          </Link>
        </p>
      )}
    </div>
  );
}