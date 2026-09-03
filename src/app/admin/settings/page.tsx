"use client";
import React, { useState, useEffect } from "react";
import RegistrationToggleBadge from "@/components/admin/RegistrationToggleBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Settings, Users, Terminal, Copy, Check, ShieldCheck, UserCheck } from "lucide-react";

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "تعذر جلب الإعدادات.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleUpdateAdminUser(userId: string, updates: { role?: string; is_active?: boolean }) {
    setSavingUserId(userId);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_user_id: userId,
          ...updates,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev: any) => ({
          ...prev,
          admin_users: prev.admin_users.map((u: any) => (u.id === userId ? { ...u, ...updates } : u)),
        }));
      } else {
        alert(json.error || "تعذر تحديث الحساب الإداري.");
      }
    } catch {
      alert("حدث خطأ في الاتصال.");
    } finally {
      setSavingUserId(null);
    }
  }

  const sqlCode = `insert into public.admin_users (id, full_name, role, is_active)
select id, 'اسم المدير هنا', 'super_admin', true
from auth.users
where email = 'PUT_ADMIN_EMAIL_HERE'
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = excluded.role,
  is_active = excluded.is_active;`;

  function handleCopySql() {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 bg-[rgba(24,29,40,0.5)] rounded-3xl border border-white/5 animate-pulse" dir="rtl">
        جارٍ تحميل الإعدادات...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-300 max-w-xl mx-auto my-12 space-y-4" dir="rtl">
        <h2 className="text-xl font-bold text-white">تعذر فتح صفحة الإعدادات</h2>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const isSuperAdmin = data.current_user?.role === "super_admin";

  return (
    <div className="space-y-8" dir="rtl">
      {/* Page Header */}
      <AdminPageHeader
        title="إعدادات النظام وإدارة الصلاحيات"
        subtitle="التحكم في حالة التسجيل العام وإدارة أدوار وحسابات فريق العمل."
        onRefresh={fetchSettings}
        isRefreshing={loading}
      />

      {/* Registration Status Toggle Card */}
      <div className="p-6 sm:p-8 bg-[rgba(24,29,40,0.85)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-white">
              حالة باب التسجيل العام في المعسكر
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              يمكنك إغلاق باب التسجيل في أي لحظة. عند الإغلاق، سيتم إيقاف استقبال الطلبات في الخادم، وستعرض صفحة
              التسجيل إشعاراً بأن باب التسجيل مغلق حالياً، دون التأثير على إمكانية استعراض وتعديل الطلبات السابقة في لوحة الإدارة.
            </p>
          </div>
          <RegistrationToggleBadge
            isOpen={data.registration_open}
            canEdit={data.current_user?.role !== "reviewer"}
            onToggle={(nextState) => setData((prev: any) => ({ ...prev, registration_open: nextState }))}
          />
        </div>
      </div>

      {/* Admin Users Table (Super Admin only) */}
      {isSuperAdmin && (
        <div className="p-6 sm:p-8 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                <span>حسابات الإدارة والصلاحيات</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                إدارة أدوار فريق العمل وتفعيل أو تعطيل الحسابات (يتم إنشاء الحساب في Supabase Auth أولاً).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
            <table className="w-full text-right text-sm text-slate-300">
              <thead className="bg-white/[0.03] border-b border-white/10 text-xs text-slate-400 font-bold">
                <tr>
                  <th className="p-4">الاسم</th>
                  <th className="p-4">البريد الإلكتروني</th>
                  <th className="p-4">الدور والصلاحية</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data.admin_users || []).map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">{u.full_name}</td>
                    <td className="p-4 font-mono text-xs text-slate-400" dir="ltr">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateAdminUser(u.id, { role: e.target.value })}
                        disabled={savingUserId === u.id || u.id === data.current_user?.id}
                        className="bg-[#0c1018] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c3f937]"
                      >
                        <option value="super_admin">مدير عام (Super Admin)</option>
                        <option value="admin">مدير (Admin)</option>
                        <option value="reviewer">محكم (Reviewer)</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          u.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {u.is_active ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {u.id !== data.current_user?.id ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateAdminUser(u.id, { is_active: !u.is_active })}
                          disabled={savingUserId === u.id}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            u.is_active
                              ? "border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                              : "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {u.is_active ? "تعطيل الحساب" : "تفعيل الحساب"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">حسابك الحالي</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SQL Quick Helper Card */}
      <div className="p-6 sm:p-8 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
            <h3 className="text-base font-bold text-white">إضافة مستخدم إداري جديد عبر SQL</h3>
          </div>
          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          بعد إنشاء الحساب يدويًا من <code>Supabase Dashboard → Authentication → Users</code>، يمكنك تشغيل هذا الكود في
          SQL Editor لمنحه الصلاحية الإدارية:
        </p>

        <pre className="p-4 bg-[#05070a] border border-white/10 rounded-2xl text-xs text-[#c3f937] font-mono overflow-x-auto leading-relaxed" dir="ltr">
{sqlCode}
        </pre>
      </div>
    </div>
  );
}
