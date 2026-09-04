"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationsMobileCards from "@/components/admin/ApplicationsMobileCards";
import StatusChangeModal from "@/components/admin/StatusChangeModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import {
  Search,
  Download,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Filter,
  Layers,
} from "lucide-react";
import { formatNumber } from "@/lib/admin/formatters";

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialized from URL search params
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [currentStatus, setCurrentStatus] = useState(searchParams.get("current_status") || "");
  const [hasVideo, setHasVideo] = useState(searchParams.get("has_video") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "submitted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("sort_order") as any) || "desc");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "20", 10));

  const [showFilters, setShowFilters] = useState(false);

  // Data state
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [quickModalApp, setQuickModalApp] = useState<ApplicationListItem | null>(null);
  const [bulkStatus, setBulkStatus] = useState<ExtendedApplicationStatus | "">("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync state with URL params
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (level) params.set("level", level);
    if (status) params.set("status", status);
    if (city) params.set("city", city);
    if (gender && gender !== "all") params.set("gender", gender);
    if (currentStatus) params.set("current_status", currentStatus);
    if (hasVideo) params.set("has_video", hasVideo);
    if (sortBy !== "submitted_at") params.set("sort_by", sortBy);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (page > 1) params.set("page", String(page));
    if (limit !== 20) params.set("limit", String(limit));
    router.replace(`/admin/applications?${params.toString()}`);
  }, [search, level, status, city, gender, currentStatus, hasVideo, sortBy, sortOrder, page, limit, router]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (level) params.set("level", level);
      if (status) params.set("status", status);
      if (city) params.set("city", city);
      if (gender && gender !== "all") params.set("gender", gender);
      if (currentStatus) params.set("current_status", currentStatus);
      if (hasVideo) params.set("has_video", hasVideo);
      params.set("sort_by", sortBy);
      params.set("sort_order", sortOrder);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, level, status, city, gender, currentStatus, hasVideo, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchApplications();
    updateUrl();
  }, [fetchApplications, updateUrl]);

  // Count active filters
  const activeFiltersCount = [level, status, city, currentStatus, hasVideo, gender && gender !== "all" ? gender : ""].filter(Boolean).length;

  function handleResetFilters() {
    setSearchInput("");
    setSearch("");
    setLevel("");
    setStatus("");
    setCity("");
    setGender("");
    setCurrentStatus("");
    setHasVideo("");
    setSortBy("submitted_at");
    setSortOrder("desc");
    setPage(1);
  }

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

  // Column sort toggle
  function handleSortChange(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  }

  // Bulk status update
  async function handleBulkStatusChange() {
    if (!bulkStatus || selectedIds.length === 0) return;
    if (!confirm(`هل أنت متأكد من تغيير حالة ${selectedIds.length} طلب إلى الحالة المحددة؟`)) {
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_ids: selectedIds,
          new_status: bulkStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        setBulkStatus("");
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

  // CSV Export
  async function handleExportCSV() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_ids: selectedIds.length > 0 ? selectedIds : undefined,
          status: status || undefined,
          level: level || undefined,
        }),
      });

      if (!res.ok) {
        alert("تعذر تصدير البيانات.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buildx_applications_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("حدث خطأ أثناء تحميل ملف CSV.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Page Header Bar ────────────────────────────────────────── */}
      <AdminPageHeader
        title="طلبات التسجيل"
        subtitle="تصفّح، ابحث، وافرز طلبات المتقدمين لمعسكر BUILDx."
        badge={
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 numeric-value">
            {formatNumber(total)} نتيجة
          </span>
        }
        onRefresh={fetchApplications}
        isRefreshing={loading}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-admin-md border transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#c3f937]/10 text-[#c3f937] border-[#c3f937]/30"
                  : "bg-white/[0.04] text-slate-200 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>الفلاتر</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#c3f937] text-[#0c1018] text-[11px] font-bold flex items-center justify-center numeric-value">
                  {formatNumber(activeFiltersCount)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-sm shadow-[#c3f937]/15 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>تصدير CSV</span>
            </button>
          </>
        }
      />

      {/* ── Search Bar with Instant Debounce ────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="ابحث بالاسم، رقم الطلب، البريد، الجوال، المدينة، الجهة، أو التخصص..."
          className="w-full h-12 pr-12 pl-10 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#c3f937] transition-all shadow-inner"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Collapsible Filters Panel ──────────────────────────────── */}
      {showFilters && (
        <div className="bento-card p-5 space-y-4 border-[#c3f937]/25">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Filter className="w-4 h-4 text-[#c3f937]" />
              <span>تصفية النتائج المتقدمة</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الفلاتر ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Level Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">المستوى</label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="" className="bg-[#121622]">جميع المستويات</option>
                <option value="foundation" className="bg-[#121622]">مبتدئ (Foundation)</option>
                <option value="practitioner" className="bg-[#121622]">ممارس (Practitioner)</option>
                <option value="advanced" className="bg-[#121622]">متقدم (Advanced)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">حالة الطلب</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="" className="bg-[#121622]">جميع الحالات</option>
                <option value="submitted" className="bg-[#121622]">طلب جديد</option>
                <option value="under_review" className="bg-[#121622]">قيد المراجعة</option>
                <option value="preliminary_candidate" className="bg-[#121622]">مرشح مبدئيًا</option>
                <option value="accepted" className="bg-[#121622]">مقبول</option>
                <option value="confirmed" className="bg-[#121622]">مؤكد الحضور</option>
                <option value="waitlisted" className="bg-[#121622]">قائمة الانتظار</option>
                <option value="rejected" className="bg-[#121622]">غير مقبول</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">الجنس</label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="" className="bg-[#121622]">جميع المشاركين</option>
                <option value="male" className="bg-[#121622]">ذكر</option>
                <option value="female" className="bg-[#121622]">أنثى</option>
                <option value="unspecified" className="bg-[#121622]">غير محدد</option>
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">المدينة</label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                placeholder="تصفية حسب المدينة..."
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#c3f937]"
              />
            </div>

            {/* Current Occupation Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">الحالة المهنية</label>
              <select
                value={currentStatus}
                onChange={(e) => {
                  setCurrentStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="" className="bg-[#121622]">جميع الحالات المهنية</option>
                <option value="student" className="bg-[#121622]">طالب/ـة</option>
                <option value="graduate" className="bg-[#121622]">خريج/ـة</option>
                <option value="employed" className="bg-[#121622]">موظف/ـة</option>
                <option value="job_seeker" className="bg-[#121622]">باحث/ـة عن عمل</option>
                <option value="other" className="bg-[#121622]">أخرى</option>
              </select>
            </div>

            {/* Video Presence Filter */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">وجود فيديو (متقدم)</label>
              <select
                value={hasVideo}
                onChange={(e) => {
                  setHasVideo(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="" className="bg-[#121622]">الكل</option>
                <option value="yes" className="bg-[#121622]">يوجد رابط فيديو</option>
                <option value="no" className="bg-[#121622]">بدون فيديو</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Actions Floating / Sticky Bar ─────────────────────── */}
      {selectedIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#1a2032] border border-[#c3f937]/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold flex items-center justify-center text-xs">
              {selectedIds.length}
            </span>
            <span className="text-sm font-bold text-white">
              تم تحديد {selectedIds.length} طلب
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as ExtendedApplicationStatus)}
              className="h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c3f937]"
            >
              <option value="" className="bg-[#121622]">اختر حالة جماعية جديدة...</option>
              <option value="under_review" className="bg-[#121622]">قيد المراجعة</option>
              <option value="preliminary_candidate" className="bg-[#121622]">مرشح مبدئيًا</option>
              <option value="accepted" className="bg-[#121622]">مقبول</option>
              <option value="confirmed" className="bg-[#121622]">مؤكد الحضور</option>
              <option value="waitlisted" className="bg-[#121622]">قائمة الانتظار</option>
              <option value="rejected" className="bg-[#121622]">غير مقبول</option>
            </select>

            <button
              type="button"
              onClick={handleBulkStatusChange}
              disabled={!bulkStatus || bulkLoading}
              className="px-4 h-10 rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {bulkLoading ? "جارٍ التحديث..." : "تطبيق على المحدد"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* ── Table & Cards View ─────────────────────────────────────── */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bento-card animate-pulse">
          جارٍ تحميل الطلبات...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 flex justify-center">
          <AdminEmptyState
            title="لا توجد طلبات مطابقة"
            description="لم يتم العثور على أي متقدم يطابق معايير البحث أو الفلاتر المحددة حاليًا."
            onRefresh={fetchApplications}
            isRefreshing={loading}
            showAllLink={false}
          />
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
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          <ApplicationsMobileCards
            items={items}
            onQuickStatusChange={(app) => setQuickModalApp(app)}
          />

          {/* ── Real Pagination Controls ───────────────────────────── */}
          <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>عرض</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 px-2 rounded-lg bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:outline-none"
              >
                <option value={10} className="bg-[#121622]">10</option>
                <option value={20} className="bg-[#121622]">20</option>
                <option value={50} className="bg-[#121622]">50</option>
                <option value={100} className="bg-[#121622]">100</option>
              </select>
              <span>طلب لكل صفحة • الإجمالي: <span className="numeric-value font-mono">{formatNumber(total)}</span></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <span className="text-xs font-mono text-slate-300 px-2 numeric-value">
                صفحة {formatNumber(page)} من {formatNumber(totalPages)}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Quick Status Change Modal */}
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

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">جارٍ التحميل...</div>}>
      <ApplicationsContent />
    </Suspense>
  );
}
