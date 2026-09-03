"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationsMobileCards from "@/components/admin/ApplicationsMobileCards";
import StatusChangeModal from "@/components/admin/StatusChangeModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  Search,
  Download,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialized from URL search params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [teamEnv, setTeamEnv] = useState(searchParams.get("team_env") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "submitted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("sort_order") as any) || "desc");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "20", 10));

  // Data state
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [quickModalApp, setQuickModalApp] = useState<ApplicationListItem | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Sync state with URL params
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (level) params.set("level", level);
    if (status) params.set("status", status);
    if (city) params.set("city", city);
    if (teamEnv) params.set("team_env", teamEnv);
    if (sortBy !== "submitted_at") params.set("sort_by", sortBy);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (page > 1) params.set("page", String(page));
    if (limit !== 20) params.set("limit", String(limit));
    router.replace(`/admin/applications?${params.toString()}`);
  }, [search, level, status, city, teamEnv, sortBy, sortOrder, page, limit, router]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (level) params.set("level", level);
      if (status) params.set("status", status);
      if (city) params.set("city", city);
      if (teamEnv) params.set("team_env", teamEnv);
      params.set("sort_by", sortBy);
      params.set("sort_order", sortOrder);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, level, status, city, teamEnv, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
      updateUrl();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchApplications, updateUrl]);

  // Selection handlers
  function handleSelectToggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleSelectAllToggle() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  }

  // Bulk status update
  async function handleBulkStatusChange(newStatus: ExtendedApplicationStatus) {
    if (selectedIds.length === 0) return;
    if (!confirm(`هل أنت متأكد من تغيير حالة ${selectedIds.length} طلب إلى "${newStatus}"؟`)) {
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_ids: selectedIds,
          new_status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        fetchApplications();
      } else {
        alert(data.error || "تعذر التحديث الجماعي.");
      }
    } catch {
      alert("حدث خطأ أثناء تنفيذ الإجراء الجماعي.");
    } finally {
      setBulkLoading(false);
    }
  }

  // Export CSV
  async function handleExportCSV(onlySelected = false) {
    try {
      const payload: any = {};
      if (onlySelected && selectedIds.length > 0) {
        payload.application_ids = selectedIds;
      } else {
        if (level) payload.level = level;
        if (status) payload.status = status;
      }

      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("تعذر تصدير البيانات.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buildx-applications-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("حدث خطأ أثناء التصدير.");
    }
  }

  function handleClearFilters() {
    setSearch("");
    setLevel("");
    setStatus("");
    setCity("");
    setTeamEnv("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(search || level || status || city || teamEnv);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Header & Export */}
      <AdminPageHeader
        title="إدارة طلبات التسجيل"
        subtitle={`إجمالي نتائج الفرز: ${total} طلب مسجل`}
        onRefresh={fetchApplications}
        isRefreshing={loading}
        actions={
          <button
            type="button"
            onClick={() => handleExportCSV(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] transition-all shadow-lg shadow-[#c3f937]/20"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>تصدير الكل (CSV)</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-5 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث بالاسم، رقم الطلب، البريد، الجوال، الجهة..."
              className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl pr-10 pl-4 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl px-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#c3f937]"
            >
              <option value="">جميع المستويات</option>
              <option value="foundation">مبتدئ (Foundation)</option>
              <option value="practitioner">ممارس (Practitioner)</option>
              <option value="advanced">متقدم (Advanced)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl px-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#c3f937]"
            >
              <option value="">جميع الحالات</option>
              <option value="submitted">طلب جديد</option>
              <option value="under_review">قيد المراجعة</option>
              <option value="preliminary_candidate">مرشح مبدئي</option>
              <option value="accepted">مقبول</option>
              <option value="waitlisted">قائمة الانتظار</option>
              <option value="rejected">غير مقبول</option>
              <option value="confirmed">تم تأكيد القبول</option>
              <option value="withdrawn">منسحب</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-");
                setSortBy(sb);
                setSortOrder(so as any);
              }}
              className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl px-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#c3f937]"
            >
              <option value="submitted_at-desc">الأحدث تقديماً</option>
              <option value="submitted_at-asc">الأقدم تقديماً</option>
              <option value="full_name-asc">الاسم (أ - ي)</option>
              <option value="updated_at-desc">آخر تحديث</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>الفلاتر النشطة:</span>
            </span>
            {search && <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200">بحث: {search}</span>}
            {level && <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200">المستوى: {level}</span>}
            {status && <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200">الحالة: {status}</span>}
            {city && <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200">المدينة: {city}</span>}
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold mr-auto"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>مسح جميع الفلاتر</span>
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Bar (when selectedIds > 0) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <span>تم تحديد</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f937] text-[#0c1018] font-mono font-bold">
              {selectedIds.length}
            </span>
            <span>طلب:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleBulkStatusChange("under_review")}
              disabled={bulkLoading}
              className="px-3 py-2 rounded-xl bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 font-bold"
            >
              نقل لقيد المراجعة
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("preliminary_candidate")}
              disabled={bulkLoading}
              className="px-3 py-2 rounded-xl bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 border border-yellow-500/30 font-bold"
            >
              نقل لمرشح مبدئي
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("accepted")}
              disabled={bulkLoading}
              className="px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold"
            >
              نقل لمقبول
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("waitlisted")}
              disabled={bulkLoading}
              className="px-3 py-2 rounded-xl bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 border border-orange-500/30 font-bold"
            >
              نقل لقائمة الانتظار
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("rejected")}
              disabled={bulkLoading}
              className="px-3 py-2 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-bold"
            >
              نقل لغير مقبول
            </button>
            <button
              type="button"
              onClick={() => handleExportCSV(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 font-bold"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>تصدير المحددين</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table / Mobile Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-[rgba(24,29,40,0.5)] rounded-3xl border border-white/5 animate-pulse">
          جارٍ تحميل الطلبات...
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <ApplicationsTable
              items={items}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAllToggle={handleSelectAllToggle}
              onQuickStatusChange={(app) => setQuickModalApp(app)}
            />
          </div>
          <ApplicationsMobileCards
            items={items}
            onQuickStatusChange={(app) => setQuickModalApp(app)}
          />
        </>
      )}

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-2xl text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <span>عرض</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#0c1018] border border-white/15 rounded-lg p-1.5 text-white"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>طلب لكل صفحة</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-white/10 text-slate-300 disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span>السابق</span>
          </button>
          <span className="font-mono text-slate-300 px-3">
            صفحة {page} من {totalPages || 1}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-white/10 text-slate-300 disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Quick Status Modal */}
      {quickModalApp && (
        <StatusChangeModal
          applicationId={quickModalApp.id}
          candidateName={quickModalApp.full_name}
          currentStatus={quickModalApp.application_status}
          updatedAt={quickModalApp.updated_at}
          onSuccess={() => {
            setQuickModalApp(null);
            fetchApplications();
          }}
          onClose={() => setQuickModalApp(null)}
        />
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-400 bg-[rgba(24,29,40,0.5)] rounded-3xl border border-white/5 animate-pulse">جارٍ تحميل لوحة الطلبات...</div>}>
      <ApplicationsContent />
    </Suspense>
  );
}
