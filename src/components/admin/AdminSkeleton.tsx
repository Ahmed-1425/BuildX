import React from "react";

export default function AdminSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/5 rounded-xl" />
          <div className="h-4 w-96 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-white/5 rounded-xl" />
          <div className="h-10 w-40 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* KPI Stats Grid Skeleton (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[132px] p-5 rounded-2xl border border-white/5 bg-[rgba(24,29,40,0.5)] flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-8 w-8 bg-white/5 rounded-lg" />
            </div>
            <div className="h-10 w-20 bg-white/5 rounded-xl mt-4" />
          </div>
        ))}
      </div>

      {/* 12-column Section Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-80 rounded-2xl border border-white/5 bg-[rgba(24,29,40,0.5)] p-6" />
        <div className="lg:col-span-7 h-80 rounded-2xl border border-white/5 bg-[rgba(24,29,40,0.5)] p-6" />
      </div>
    </div>
  );
}
