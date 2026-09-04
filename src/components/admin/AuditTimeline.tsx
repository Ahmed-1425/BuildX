"use client";
import type { StatusHistoryEntry } from "@/types/admin";
import StatusBadge from "./StatusBadge";
import { formatDateTimeArabic } from "@/lib/admin/formatters";

interface Props {
  history: StatusHistoryEntry[];
}

export default function AuditTimeline({ history }: Props) {
  if (history.length === 0) {
    return <p className="text-center py-6 text-xs text-slate-500">لا يوجد سجل تاريخي بعد.</p>;
  }

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:top-2 before:bottom-2 before:right-2 before:w-0.5 before:bg-primary/25">
      {history.map((entry) => (
        <div key={entry.id} className="relative pr-6">
          {/* Dot */}
          <span className="absolute right-0.5 top-1.5 w-3 h-3 rounded-full bg-lime border-2 border-[#0c1018] shadow-[0_0_8px_#c3f937]" />

          <div className="p-3.5 bg-[#0c1018]/60 border border-primary/20 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{entry.actor_name}</span>
                <span className="text-xs text-slate-400">غيّر الحالة إلى:</span>
                <StatusBadge status={entry.new_status} size="sm" />
              </div>
              <span className="text-xs text-slate-400 font-mono numeric-value" dir="ltr">
                {formatDateTimeArabic(entry.created_at)}
              </span>
            </div>

            {entry.previous_status && (
              <p className="text-[11px] text-slate-400">
                الحالة السابقة: <span className="text-slate-300">{entry.previous_status}</span>
              </p>
            )}

            {entry.note && (
              <p className="text-xs text-slate-200 bg-primary/10 p-2 rounded-lg border border-primary/15 italic">
                &ldquo;{entry.note}&rdquo;
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
