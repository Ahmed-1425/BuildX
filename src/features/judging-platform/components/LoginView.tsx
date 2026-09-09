// =============================================================================
// BUILDx Judging Platform - Secure Judge Login
// =============================================================================

import React, { useState } from 'react';
import { useJudging } from '../context/JudgingContext';
import { ShieldCheck, Lock, UserCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useJudging();

  const judgesList = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'أحمد الرشيد', role: 'محكم' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'إقبال الدلامي', role: 'محكمة' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'عبدالعزيز بن نشوان', role: 'محكم' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'أضواء الغامدي', role: 'محكمة' },
    { id: '99999999-9999-9999-9999-999999999999', name: 'إدارة التحكيم (Admin)', role: 'مسؤول النظام' },
  ];

  const [selectedJudgeId, setSelectedJudgeId] = useState<string>(judgesList[0].id);
  const [pin, setPin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [logoError, setLogoError] = useState(false);

  const handleKeyClick = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length !== 4) {
      setErrorMessage('الرجاء إدخال الرمز السري المكون من 4 أرقام.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await login(selectedJudgeId, pin);

    if (!result.success) {
      setErrorMessage(result.error || 'تعذر التحقق من الرمز السري.');
      if (typeof result.attemptsRemaining === 'number') {
        setAttemptsLeft(result.attemptsRemaining);
      }
      setPin('');
    }
    setLoading(false);
  };

  const selectedJudge = judgesList.find((j) => j.id === selectedJudgeId);

  return (
    <div className="min-h-screen bg-[#0c1018] flex flex-col justify-center items-center px-4 py-12 relative selection:bg-[#c3f937] selection:text-[#0c1018]">
      {/* Background cyber accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#34155f]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#c3f937]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#121826]/90 backdrop-blur-xl border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {!logoError ? (
            <img
              src="/assets/judging-platform/logo.png"
              alt="BUILDx"
              onError={() => setLogoError(true)}
              className="h-12 w-auto mb-3 object-contain"
            />
          ) : (
            <div className="h-12 px-4 mb-3 flex items-center rounded-xl bg-[#34155f] border border-[#a855f7]/40 text-[#c3f937] font-tech font-bold text-2xl tracking-widest">
              BUILDx
            </div>
          )}
          <h1 className="text-xl font-bold text-[#e7edfd] font-arabic">
            بوابة تسجيل دخول لجنة التحكيم
          </h1>
          <p className="text-xs text-[#e7edfd]/70 mt-1 font-arabic">
            هاكاثون BUILDx — نظام التقييم ورصد الدرجات الآمن
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-right">
              <span>{errorMessage}</span>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <div className="mt-1 font-tech text-[11px] text-amber-300">
                  Remaining attempts: {attemptsLeft}
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judge Selection Dropdown/Cards */}
          <div>
            <label className="block text-xs font-semibold text-[#e7edfd]/80 mb-2 text-right">
              اختر المحكم
            </label>
            <div className="grid grid-cols-1 gap-2">
              {judgesList.map((judge) => {
                const isSelected = selectedJudgeId === judge.id;
                return (
                  <button
                    key={judge.id}
                    type="button"
                    onClick={() => {
                      setSelectedJudgeId(judge.id);
                      setPin('');
                      setErrorMessage(null);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#c3f937]/10 border-[#c3f937] text-[#c3f937] shadow-[0_0_15px_rgba(195,249,55,0.1)]'
                        : 'bg-[#0c1018]/60 border-[#e7edfd]/10 text-[#e7edfd]/75 hover:bg-[#e7edfd]/5'
                    }`}
                  >
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#182030] text-[#e7edfd]/60 border border-[#e7edfd]/10 font-tech">
                      {judge.role}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold">{judge.name}</span>
                      <UserCheck
                        className={`w-4 h-4 ${isSelected ? 'text-[#c3f937]' : 'text-transparent'}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PIN Input Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#e7edfd]/50 font-tech">4 DIGITS SECURE PIN</span>
              <label className="text-xs font-semibold text-[#e7edfd]/80">الرمز السري (PIN)</label>
            </div>

            <div className="flex justify-center items-center gap-3 py-3 px-4 rounded-2xl bg-[#0c1018] border border-[#e7edfd]/15">
              {[0, 1, 2, 3].map((index) => {
                const filled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-[#c3f937] shadow-[0_0_10px_#c3f937] scale-110'
                        : 'bg-[#182030] border border-[#e7edfd]/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyClick(digit)}
                className="h-12 rounded-xl bg-[#182030]/80 hover:bg-[#1f2a40] active:scale-95 border border-[#e7edfd]/10 text-lg font-tech font-bold text-[#e7edfd] transition-all flex items-center justify-center cursor-pointer hover:border-[#c3f937]/40"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-[#182030]/40 hover:bg-red-950/40 text-xs font-arabic text-[#e7edfd]/60 hover:text-red-300 border border-[#e7edfd]/10 transition-all flex items-center justify-center cursor-pointer"
            >
              مسح
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="h-12 rounded-xl bg-[#182030]/80 hover:bg-[#1f2a40] active:scale-95 border border-[#e7edfd]/10 text-lg font-tech font-bold text-[#e7edfd] transition-all flex items-center justify-center cursor-pointer hover:border-[#c3f937]/40"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-[#182030]/40 hover:bg-[#1f2a40] text-sm text-[#e7edfd]/80 border border-[#e7edfd]/10 transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className={`w-full py-3.5 rounded-2xl font-arabic font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              loading || pin.length !== 4
                ? 'bg-[#182030] text-[#e7edfd]/40 border border-[#e7edfd]/10 cursor-not-allowed'
                : 'bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] shadow-[0_0_20px_rgba(195,249,55,0.25)] active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#0c1018] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>دخول إلى لوحة التحكيم</span>
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-8 pt-6 border-t border-[#e7edfd]/10 flex items-center justify-between text-[11px] text-[#e7edfd]/50">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#c3f937]" />
            <span>نظام تشفير PIN أحادي الاتجاه</span>
          </div>
          <span className="font-tech text-[#c3f937]/80">BUILDx SECURE</span>
        </div>
      </div>
    </div>
  );
};
