"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsMobileCards from "./ApplicationsMobileCards";
import StatusChangeModal from "./StatusChangeModal";
import AdminEmptyState from "./AdminEmptyState";
import {
  Search,
  RefreshCw,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { formatNumber } from "@/lib/admin/formatters";
import AdminPageHeader from "./AdminPageHeader";

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

      {/* Search & Level Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث بالاسم، رقم الطلب، المدينة، أو التخصص..."
            className="w-full h-11 pr-11 pl-10 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#c3f937]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="sm:col-span-4">
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-3 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c3f937]"
          >
            <option value="" className="bg-[#121622]">جميع المستويات</option>
            <option value="foundation" className="bg-[#121622]">مبتدئ (Foundation)</option>
            <option value="practitioner" className="bg-[#121622]">ممارس (Practitioner)</option>
            <option value="advanced" className="bg-[#121622]">متقدم (Advanced)</option>
          </select>
        </div>
      </div>

      {/* Table / Cards / Empty State */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bento-card animate-pulse">
          جارٍ تحميل قائمة المتقدمين...
        </div>
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

          {/* Pagination Controls */}
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
            fetchItems();
          }}
          onClose={() => setQuickModalApp(null)}
        />
      )}
    </div>
  );
}
