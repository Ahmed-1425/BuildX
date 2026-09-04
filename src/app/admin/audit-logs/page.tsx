"use client";
import React, { useState, useEffect } from "react";
import type { AuditLogEntry } from "@/types/admin";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ScrollText, User, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { formatDateTimeArabic, formatNumber } from "@/lib/admin/formatters";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=30`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-8" dir="rtl">
      <AdminPageHeader
        title="سجل النشاط والعمليات (Audit Log)"
        subtitle="تتبع كافة الإجراءات والتعديلات التي تمت بواسطة فريق الإدارة مع التوقيت والمنفذ."
        onRefresh={fetchLogs}
        isRefreshing={loading}
        actions={
          <div className="text-left font-mono bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400 block">إجمالي السجلات</span>
            <span className="text-2xl font-bold text-[#c3f937]">{total}</span>
          </div>
        }
      />

      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-[rgba(24,29,40,0.5)] rounded-3xl border border-white/5 animate-pulse">
          جارٍ تحميل السجل...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[rgba(24,29,40,0.78)] rounded-3xl border border-white/10">
          لا توجد سجلات نشاط مسجلة بعد.
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[rgba(24,29,40,0.78)] overflow-hidden divide-y divide-white/5 text-sm backdrop-blur-md shadow-xl">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-5 flex flex-wrap items-start justify-between gap-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="space-y-1.5 min-w-[280px]">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white text-base">{log.actor_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[#c3f937] border border-[#c3f937]/30 font-mono text-xs">
                    {log.action}
                  </span>
                </div>
                {log.note && <p className="text-slate-300 leading-relaxed text-sm">{log.note}</p>}
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs text-left" dir="ltr">
                <Clock className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" />
                <span className="numeric-value">
                  {formatDateTimeArabic(log.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-slate-400">
        <span className="numeric-value">صفحة {formatNumber(page)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span>السابق</span>
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={logs.length < 30}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
