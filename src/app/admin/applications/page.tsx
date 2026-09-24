"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationsMobileCards from "@/components/admin/ApplicationsMobileCards";
import StatusChangeModal from "@/components/admin/StatusChangeModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminDataToolbar from "@/components/admin/ui/AdminDataToolbar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import {
  Trash2,
  Filter,
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
        onRefresh={fetchApplications}
        isRefreshing={loading}
      />

      {/* ── Unified Data Toolbar ────────────────────────────────────── */}
      <AdminDataToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="ابحث بالاسم، رقم الطلب، البريد، الجوال، المدينة، الجهة، أو التخصص..."
        totalCount={total}
        activeFiltersCount={activeFiltersCount}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onRefresh={fetchApplications}
        isRefreshing={loading}
        onExport={handleExportCSV}
        isExporting={exporting}
      />

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

            {/* Sort by Submission Time */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-slate-300">ترتيب حسب وقت التقديم</label>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split(":") as [string, "asc" | "desc"];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#c3f937]"
              >
                <option value="submitted_at:desc" className="bg-[#121622]">الأحدث أولاً</option>
                <option value="submitted_at:asc" className="bg-[#121622]">الأقدم أولاً</option>
                <option value="full_name:asc" className="bg-[#121622]">الاسم (أ → ي)</option>
                <option value="full_name:desc" className="bg-[#121622]">الاسم (ي → أ)</option>
                <option value="updated_at:desc" className="bg-[#121622]">آخر تحديث</option>
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
        <AdminSkeleton variant="list" />
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

          {/* Reusable Pagination */}
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
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
