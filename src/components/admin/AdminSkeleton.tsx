import React from "react";

type SkeletonVariant = "dashboard" | "list" | "review";

interface Props {
  variant?: SkeletonVariant;
}

export default function AdminSkeleton({ variant = "dashboard" }: Props) {
  if (variant === "list") {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-white/[0.04] rounded-xl" />
            <div className="h-4 w-80 bg-white/[0.03] rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-28 bg-white/[0.04] rounded-xl" />
            <div className="h-11 w-28 bg-white/[0.04] rounded-xl" />
          </div>
        </div>
        {/* Search */}
        <div className="h-11 w-full bg-white/[0.03] rounded-xl" />
        {/* Table rows */}
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[82px] bg-white/[0.02] rounded-xl border border-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "review") {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        {/* Hero header */}
        <div className="h-40 bg-white/[0.03] rounded-3xl" />
        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <div className="h-24 bg-white/[0.03] rounded-2xl" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[94px] bg-white/[0.02] rounded-2xl border border-white/[0.04]" />
            ))}
          </div>
          <div className="xl:col-span-4">
            <div className="h-[500px] bg-white/[0.03] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Dashboard skeleton (default)
  return (
    <div className="space-y-8 animate-pulse" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2.5">
          <div className="h-9 w-56 bg-white/[0.04] rounded-xl" />
          <div className="h-4 w-96 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-32 bg-white/[0.04] rounded-xl" />
          <div className="h-11 w-40 bg-white/[0.04] rounded-xl" />
        </div>
      </div>

      {/* KPI Grid (6 cards in 3-col) */}
      <div className="metrics-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="kpi-card bento-card"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/[0.05] rounded-xl" />
              <div className="h-4 w-24 bg-white/[0.04] rounded" />
            </div>
            <div className="h-12 w-20 bg-white/[0.05] rounded-xl" />
            <div className="h-3 w-40 bg-white/[0.03] rounded pt-1 border-t border-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Bento grid */}
      <div className="dashboard-bento-grid">
        <div className="col-span-12 lg:col-span-8 h-72 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 lg:col-span-4 h-72 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 lg:col-span-6 h-64 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 lg:col-span-6 h-64 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 lg:col-span-6 h-56 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 lg:col-span-6 h-56 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
        <div className="col-span-12 h-60 bg-white/[0.03] rounded-2xl border border-white/[0.04]" />
      </div>
    </div>
  );
}
