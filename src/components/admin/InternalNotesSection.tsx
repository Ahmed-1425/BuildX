"use client";
import React, { useState } from "react";
import type { ApplicationNote } from "@/types/admin";
import { Pin, Trash2, Send } from "lucide-react";

interface Props {
  applicationId: string;
  notes: ApplicationNote[];
  currentUserId: string;
  isSuperAdmin: boolean;
  onNoteAdded: (note: ApplicationNote) => void;
  onNoteDeleted: (noteId: string) => void;
}

export default function InternalNotesSection({
  applicationId,
  notes,
  currentUserId,
  isSuperAdmin,
  onNoteAdded,
  onNoteDeleted,
}: Props) {
  const [noteText, setNoteText] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: noteText.trim(),
          is_pinned: isPinned,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onNoteAdded(data.note);
        setNoteText("");
        setIsPinned(false);
      } else {
        alert(data.error || "تعذر إضافة الملاحظة.");
      }
    } catch {
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(noteId: string) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الملاحظة؟")) return;

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/notes?note_id=${noteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onNoteDeleted(noteId);
      } else {
        alert(data.error || "تعذر حذف الملاحظة.");
      }
    } catch {
      alert("حدث خطأ أثناء الحذف.");
    }
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Add note input */}
      <form onSubmit={handleAddNote} className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3">
        <textarea
          rows={2}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="أضف ملاحظة داخلية سرية لفريق الفرز..."
          className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
        />
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded bg-[#0c1018] border-white/20 text-[#c3f937] focus:ring-[#c3f937]"
            />
            <span className="flex items-center gap-1">
              <Pin className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />
              <span>تثبيت في أعلى الملاحظات</span>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading || !noteText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#c3f937] text-[#0c1018] rounded-xl hover:bg-[#c3f937]/90 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
            <span>{loading ? "جارٍ الإضافة..." : "إضافة ملاحظة"}</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <p className="text-center py-6 text-xs text-slate-500">لا توجد ملاحظات داخلية مسجلة بعد.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => {
            const canDelete = n.author_id === currentUserId || isSuperAdmin;
            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.is_pinned
                    ? "bg-yellow-500/5 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {n.is_pinned && <Pin className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />}
                    <span className="text-xs font-bold text-white">{n.author_name}</span>
                    <span className="text-[10px] text-slate-500" dir="ltr">
                      {new Date(n.created_at).toLocaleDateString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Riyadh",
                      })}
                    </span>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="حذف الملاحظة"
                      aria-label="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{n.note}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
