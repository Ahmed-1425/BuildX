// =============================================================================
// BUILDx Judging Platform Header - Streamlined & Focused Design
// =============================================================================

import React, { useState } from 'react';
import { useJudging } from '../context/JudgingContext';
import {
  LayoutDashboard,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  Database,
  Radio,
} from 'lucide-react';
import { SupabaseModal } from './SupabaseModal';

export const Header: React.FC = () => {
  const {
    currentJudge,
    connectionStatus,
    supabaseStatus,
    logout,
    currentPath,
    navigate,
  } = useJudging();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Clean, focused navigation tabs:
  const navItems = [
    {
      label: 'الفرق والتقييم',
      path: '/judging/dashboard',
      icon: LayoutDashboard,
      isActive: currentPath === '/judging/dashboard' || currentPath === '/judging/teams' || currentPath.startsWith('/judging/evaluation'),
    },
    {
      label: 'النتائج النهائية',
      path: '/judging/results',
      icon: Trophy,
      isActive: currentPath === '/judging/results' || currentPath === '/judging/leaderboard',
    },
    ...(currentJudge?.role === 'admin'
      ? [
          {
            label: 'الإعدادات',
            path: '/judging/settings',
            icon: Settings,
            isActive: currentPath === '/judging/settings',
          },
        ]
      : []),
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0c1018]/95 backdrop-blur-md border-b border-[#e7edfd]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Right (Start in RTL): Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => handleNavClick('/judging/dashboard')}
          >
            {!logoError ? (
              <img
                src="/assets/judging-platform/logo.png"
                alt="BUILDx"
                onError={() => setLogoError(true)}
                className="h-8 sm:h-9 w-auto object-contain transition-transform hover:scale-105"
              />
            ) : (
              <div className="h-8 px-2.5 flex items-center rounded-lg bg-[#34155f] border border-[#a855f7]/40 text-[#c3f937] font-tech font-bold text-lg">
                BUILDx
              </div>
            )}
            <div className="h-4 w-px bg-[#e7edfd]/20" />
            <span className="text-xs sm:text-sm font-bold text-[#e7edfd] font-arabic tracking-wide">
              منصة التحكيم
            </span>
          </div>

          {/* Center: Simplified Clean Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    item.isActive
                      ? 'bg-[#c3f937] text-[#0c1018] font-bold shadow-[0_0_15px_rgba(195,249,55,0.25)]'
                      : 'text-[#e7edfd]/70 hover:text-[#e7edfd] hover:bg-[#e7edfd]/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-arabic">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Left (End in RTL): Supabase Live Status + Judge Badge + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Supabase Live Realtime Button / Status Badge */}
            <button
              onClick={() => setSupabaseModalOpen(true)}
              title="انقر لفحص وإعداد اتصال Supabase Realtime"
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-arabic transition-all cursor-pointer ${
                supabaseStatus === 'connected'
                  ? 'bg-[#c3f937]/10 hover:bg-[#c3f937]/20 border-[#c3f937]/30 text-[#c3f937]'
                  : supabaseStatus === 'reconnecting'
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  : 'bg-[#121826] hover:bg-[#151c2e] border-[#e7edfd]/15 text-[#e7edfd]/70'
              }`}
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-bold">
                {supabaseStatus === 'connected' ? 'سوبربيس متصل' : supabaseStatus === 'reconnecting' ? 'جارٍ المزامنة' : 'ربط سوبربيس'}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  supabaseStatus === 'connected'
                    ? 'bg-[#c3f937] shadow-[0_0_8px_#c3f937]'
                    : supabaseStatus === 'reconnecting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-zinc-500'
                }`}
              />
            </button>

            {/* Current Judge Profile Badge */}
            {currentJudge && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121826] border border-[#e7edfd]/10">
                <div className="w-6 h-6 rounded-md bg-[#34155f] text-[#c3f937] flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#e7edfd] font-arabic leading-tight">
                    {currentJudge.name}
                  </span>
                  <span className="text-[9px] text-[#c3f937] font-tech leading-none">
                    {currentJudge.role === 'admin' ? 'ADMIN' : 'JUDGE'}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            {currentJudge && (
              <button
                onClick={logout}
                title="تسجيل الخروج"
                className="p-2 rounded-xl text-[#e7edfd]/50 hover:text-[#fb50c3] hover:bg-[#fb50c3]/10 border border-transparent transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#e7edfd]/80 hover:bg-[#e7edfd]/10 border border-[#e7edfd]/10 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c1018] border-b border-[#e7edfd]/15 px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.isActive
                      ? 'bg-[#c3f937] text-[#0c1018] font-bold'
                      : 'text-[#e7edfd]/80 hover:bg-[#e7edfd]/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-arabic">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </>
  );
};
