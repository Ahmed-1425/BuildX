"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { ApplicationListItem, ExtendedApplicationStatus } from "@/types/admin";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsMobileCards from "./ApplicationsMobileCards";
import StatusChangeModal from "./StatusChangeModal";
import AdminPageHeader from "./AdminPageHeader";

interface Props {
  title: string;
  subtitle: string;
  targetStatus: ExtendedApplicationStatus | ExtendedApplicationStatus[];
  showWhatsAppButton?: boolean;
}

export default function StatusFilteredApplicationsView({
  title,
  subtitle,
  targetStatus,
}: Props) {
  const [items, setItems] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickModalApp, setQuickModalApp] = useState<ApplicationListItem | null>(null);

  const statusQuery = Array.isArray(targetStatus) ? targetStatus[0] : targetStatus;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${statusQuery}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusQuery]);

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

  return (
    <div className="space-y-8" dir="rtl">
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        onRefresh={fetchItems}
        isRefreshing={loading}
        actions={
          <div className="text-left font-mono bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400 block">إجمالي المرشحين</span>
            <span className="text-2xl font-bold text-[#c3f937]">{total}</span>
          </div>
        }
      />

      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-[rgba(24,29,40,0.5)] rounded-3xl border border-white/5 animate-pulse">
          جارٍ التحميل...
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
