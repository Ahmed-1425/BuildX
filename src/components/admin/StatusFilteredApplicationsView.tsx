"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsMobileCards from "./ApplicationsMobileCards";
import StatusChangeModal from "./StatusChangeModal";
import AdminEmptyState from "./AdminEmptyState";
import AdminSkeleton from "./AdminSkeleton";
import AdminPagination from "./ui/AdminPagination";
import AdminDataToolbar from "./ui/AdminDataToolbar";
import AdminPageHeader from "./AdminPageHeader";
import { formatNumber } from "@/lib/admin/formatters";
import { Download } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  targetStatus: ExtendedApplicationStatus;
}

export default function StatusFilteredApplicationsView({
  title,
  subtitle,
  targetStatus,
}: Props) {
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickModalApp, setQuickModalApp] = useState<ApplicationListItem | null>(null);

  // Search & Sorting & Pagination
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("submitted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", targetStatus);
      if (search) params.set("search", search);
      if (level) params.set("level", level);
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
      console.error("Status fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [targetStatus, search, level, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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

  function handleSortChange(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  }

  // Export CSV for this status
  async function handleExportCSV() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_ids: selectedIds.length > 0 ? selectedIds : undefined,
          status: targetStatus,
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
      a.download = `buildx_${targetStatus}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("حدث خطأ أثناء تحميل ملف CSV.");
    } finally {
      setExporting(false);
    }
  }

  const activeFiltersCount = (level ? 1 : 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        badge={
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 numeric-value">
            {formatNumber(total)} متقدم
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
        onToggleFilters={() => setShowFilters(!showFilters)}
        onRefresh={fetchItems}
        isRefreshing={loading}
        onExport={handleExportCSV}
        isExporting={exporting}
      />

      {/* Level Filter (shown when filters toggled) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">المستوى</label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c3f937]"
            >
              <option value="" className="bg-[#121622]">جميع المستويات</option>
              <option value="foundation" className="bg-[#121622]">مبتدئ (Foundation)</option>
              <option value="practitioner" className="bg-[#121622]">ممارس (Practitioner)</option>
              <option value="advanced" className="bg-[#121622]">متقدم (Advanced)</option>
            </select>
          </div>
        </div>
      )}

      {/* Table / Cards / Empty State */}
      {loading ? (
        <AdminSkeleton variant="list" />
      ) : items.length === 0 ? (
        <AdminEmptyState
          title={`لا يوجد متقدمون في مرحلة «${title}»`}
          description="لم يتم تصنيف أو فرز أي طلبات مطابقة ضمن هذه المرحلة حتى الآن."
          onRefresh={fetchItems}
          isRefreshing={loading}
          showAllLink={true}
        />
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
