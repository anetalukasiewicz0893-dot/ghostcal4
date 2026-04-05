import React from 'react';

export default function ShowCardSkeleton() {
  return (
    <div className="vp-card overflow-hidden">
      <div className="aspect-[2/3] vp-skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 vp-skeleton rounded-sm w-3/4" />
        <div className="h-3 vp-skeleton rounded-sm w-1/2" />
      </div>
    </div>
  );
}