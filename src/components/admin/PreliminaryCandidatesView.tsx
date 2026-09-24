"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { ApplicationListItem } from "@/types/admin";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsMobileCards from "./ApplicationsMobileCards";
import StatusChangeModal from "./StatusChangeModal";
import AdminEmptyState from "./AdminEmptyState";
import AdminSkeleton from "./AdminSkeleton";
import AdminPagination from "./ui/AdminPagination";
import AdminDataToolbar from "./ui/AdminDataToolbar";
import AdminPageHeader from "./AdminPageHeader";
import { formatNumber } from "@/lib/admin/formatters";
import { Download, SlidersHorizontal, RotateCcw, Inbox, RefreshCw } from "lucide-react";

export default function PreliminaryCandidatesView() {
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickModalApp, setQuickModalApp] = useState<ApplicationListItem | null>(null);

  // Search, Filters & Sorting
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [exporting, setExporting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch applications based on current filters and sort order
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "preliminary_candidate");
      if (search) params.set("search", search);
      if (level) params.set("level", level);
      if (gender) params.set("gender", gender);
      params.set("sort_by", "submitted_at");
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
      console.error("Preliminary candidates fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, level, gender, sortOrder, page, limit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Checkbox selection
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

  // Handle table header sort toggle
  function handleSortChange(column: string) {
    if (column === "submitted_at") {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      setPage(1);
    }
  }

  // Filter change handlers that reset to page 1
  function handleLevelChange(newLevel: string) {
    setLevel(newLevel);
    setPage(1);
  }

  function handleGenderChange(newGender: string) {
    setGender(newGender);
    setPage(1);
  }

  function handleSortOrderChange(newOrder: "asc" | "desc") {
    setSortOrder(newOrder);
    setPage(1);
  }

  // Clear all filters back to default values
  function handleResetFilters() {
    setLevel("");
    setGender("");
    setSortOrder("desc");
    setPage(1);
  }

  // Active filters calculation
  const isDateSortCustom = sortOrder !== "desc";
  const hasActiveFilters = Boolean(level || gender || isDateSortCustom);
  const activeFiltersCount = (level ? 1 : 0) + (gender ? 1 : 0) + (isDateSortCustom ? 1 : 0);

  // Export CSV respecting currently filtered records
  async function handleExportCSV() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_ids: selectedIds.length > 0 ? selectedIds : undefined,
          status: "preliminary_candidate",
          level: level || undefined,
          gender: gender || undefined,
          sort_order: sortOrder,
          search: search || undefined,
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
      a.download = `buildx_preliminary_candidates_${new Date().toISOString().slice(0, 10)}.csv`;
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
      {/* Page Header */}
      <AdminPageHeader
        title="المرشحون مبدئيًا"
        subtitle="قائمة المتقدمين الذين تم فرزهم وترشيحهم للمرحلة التالية قبل اعتماد القبول النهائي."
        badge={
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 numeric-value">
            {formatNumber(total)} مرشح
          </span>
        }
        onRefresh={fetchItems}
        isRefreshing={loading}
        actions={
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-sm shadow-[#c3f937]/15 cursor-pointer disabled:opacity-50"
            id="btn-export-preliminary-csv"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>
        }
      />

      {/* Unified Toolbar */}
      <AdminDataToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="ابحث بالاسم، رقم الطلب، المدينة، أو التخصص..."
        totalCount={total}
        activeFiltersCount={activeFiltersCount}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onRefresh={fetchItems}
        isRefreshing={loading}
        onExport={handleExportCSV}
        isExporting={exporting}
      />

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="bento-card p-4 sm:p-5 border-[#c3f937]/25 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <SlidersHorizontal className="w-4 h-4 text-[#c3f937]" />
              <span>تصفية وفرز المرشحين مبدئيًا</span>
              {activeFiltersCount > 0 && (
                <span className="text-xs text-slate-400 font-normal">
                  ({activeFiltersCount} فلتر نشط)
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
                id="btn-clear-filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح الفلاتر</span>
              </button>
            )}
          </div>

          {/* 3 Fields in 1 Row on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. ترتيب تاريخ التقديم */}
            <div className="space-y-1.5 text-right">
              <label htmlFor="filter-sort-order" className="text-xs font-semibold text-slate-300 block">
                ترتيب التقديم
              </label>
              <select
                id="filter-sort-order"
                value={sortOrder}
                onChange={(e) => handleSortOrderChange(e.target.value as "asc" | "desc")}
                className="w-full h-11 px-3.5 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c3f937] transition-colors cursor-pointer"
              >
                <option value="desc" className="bg-[#121622]">الأحدث أولًا</option>
                <option value="asc" className="bg-[#121622]">الأقدم أولًا</option>
              </select>
            </div>

            {/* 2. فلتر المستوى */}
            <div className="space-y-1.5 text-right">
              <label htmlFor="filter-level" className="text-xs font-semibold text-slate-300 block">
                المستوى
              </label>
              <select
                id="filter-level"
                value={level}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c3f937] transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#121622]">جميع المستويات</option>
                <option value="foundation" className="bg-[#121622]">مبتدئ (Foundation)</option>
                <option value="practitioner" className="bg-[#121622]">ممارس (Practitioner)</option>
                <option value="advanced" className="bg-[#121622]">متقدم (Advanced)</option>
              </select>
            </div>

            {/* 3. فلتر الجنس */}
            <div className="space-y-1.5 text-right">
              <label htmlFor="filter-gender" className="text-xs font-semibold text-slate-300 block">
                الجنس
              </label>
              <select
                id="filter-gender"
                value={gender}
                onChange={(e) => handleGenderChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c3f937] transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#121622]">الجميع</option>
                <option value="male" className="bg-[#121622]">ذكر</option>
                <option value="female" className="bg-[#121622]">أنثى</option>
                <option value="unspecified" className="bg-[#121622]">غير محدد</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table / Cards / Empty State */}
      {loading ? (
        <AdminSkeleton variant="list" />
      ) : items.length === 0 ? (
        hasActiveFilters || search ? (
          <div className="bento-card p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto border-white/10 my-6">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6 text-[#c3f937]" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                لا يوجد مرشحون يطابقون الفلاتر المحددة
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                لم يتم العثور على أي مرشح مبدئي يطابق خيارات التصفية أو البحث الحالية. يمكنك مسح الفلاتر للعودة لكامل القائمة.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                  setSearchInput("");
                }}
                className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-sm shadow-[#c3f937]/15 cursor-pointer"
                id="btn-empty-clear-filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span>مسح الفلاتر</span>
              </button>
              <button
                type="button"
                onClick={fetchItems}
                disabled={loading}
                className="btn-admin-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 text-[#c3f937] ${loading ? "animate-spin" : ""}`} />
                <span>تحديث البيانات</span>
              </button>
            </div>
          </div>
        ) : (
          <AdminEmptyState
            title="لا يوجد متقدمون في مرحلة «المرشحون مبدئيًا»"
            description="لم يتم تصنيف أو فرز أي طلبات مطابقة ضمن هذه المرحلة حتى الآن."
            onRefresh={fetchItems}
            isRefreshing={loading}
            showAllLink={true}
          />
        )
      ) : (
        <>
          <div className="hidden lg:block">
            <ApplicationsTable
              items={items}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAllToggle={handleSelectAllToggle}
              onQuickStatusChange={(app) => setQuickModalApp(app)}
              sortBy="submitted_at"
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          <ApplicationsMobileCards
            items={items}
            onQuickStatusChange={(app) => setQuickModalApp(app)}
          />

          {/* Pagination */}
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
            fetchItems();
          }}
          onClose={() => setQuickModalApp(null)}
        />
      )}
    </div>
  );
}
