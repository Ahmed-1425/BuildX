import React from "react";

interface AdminSectionCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function AdminSectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
  noPadding = false,
}: AdminSectionCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[rgba(24,29,40,0.78)] backdrop-blur-md shadow-xl overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div>
            {title && (
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
}
