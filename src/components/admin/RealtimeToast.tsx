"use client";
import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import { Sparkles, ArrowLeft, X } from "lucide-react";

interface NewAppEvent {
  id: string;
  full_name: string;
  level: string;
}

export default function RealtimeToast() {
  const [event, setEvent] = useState<NewAppEvent | null>(null);

  useEffect(() => {
    // Subscribe to INSERT events on applications table
    const channel = supabaseBrowser
      .channel("admin-realtime-applications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow && newRow.full_name) {
            setEvent({
              id: newRow.id,
              full_name: newRow.full_name,
              level: newRow.level,
            });

            // Auto dismiss after 7 seconds
            setTimeout(() => {
              setEvent(null);
            }, 7000);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  if (!event) return null;

  return (
    <div className="fixed top-5 inset-x-4 sm:inset-x-auto sm:left-6 z-50 animate-bounce" dir="rtl">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#181d28] border border-[#c3f937]/40 rounded-2xl shadow-2xl shadow-[#c3f937]/20 backdrop-blur-md text-right">
        <span className="flex h-3 w-3 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f937] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c3f937]" />
        </span>
        <div className="text-sm">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
            <span>وصل طلب تسجيل جديد!</span>
          </p>
          <p className="text-xs text-slate-300">
            {event.full_name} (
            {event.level === "foundation"
              ? "مبتدئ"
              : event.level === "practitioner"
              ? "ممارس"
              : "متقدم"}
            )
          </p>
        </div>
        <Link
          href={`/admin/applications/${event.id}`}
          onClick={() => setEvent(null)}
          className="mr-3 text-xs px-3 py-1.5 bg-[#c3f937] text-[#0c1018] font-bold rounded-xl hover:bg-[#c3f937]/90 transition-colors flex items-center gap-1 shrink-0"
        >
          <span>عرض الملف</span>
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => setEvent(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="إغلاق الإشعار"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
