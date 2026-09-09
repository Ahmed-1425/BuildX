import React from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { Layers, Users, Cpu, ArrowDown } from 'lucide-react';

interface TracksHeroProps {
  lang: Language;
}

export const TracksHero: React.FC<TracksHeroProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const scrollToTracks = () => {
    const el = document.getElementById('tracks-nav-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    {
      num: '03',
      labelAr: 'مسارات',
      labelEn: 'Challenge Tracks',
      accent: '#fb50c3',
      icon: Layers,
    },
    {
      num: '08',
      labelAr: 'فرق',
      labelEn: 'Competing Teams',
      accent: '#8234f9',
      icon: Users,
    },
    {
      num: '08',
      labelAr: 'منتجات رقمية',
      labelEn: 'Digital Products',
      accent: '#c3f937',
      icon: Cpu,
    },
  ];

  return (
    <section
      id="tracks-hero-section"
      className="relative pt-8 pb-12 md:pt-14 md:pb-16 overflow-hidden"
    >
      {/* Three ambient track-colored glowing orbs (Pink, Violet, Lime) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute top-6 right-[-80px] w-[380px] h-[380px] rounded-full bg-[#fb50c3]/20 blur-[130px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute top-24 left-[-60px] w-[400px] h-[400px] rounded-full bg-[#8234f9]/20 blur-[140px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[480px] h-[260px] rounded-full bg-[#c3f937]/15 blur-[120px] pointer-events-none -z-10"
      />

      <div className="tracks-container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)] gap-8 md:gap-12 lg:gap-16 items-center min-h-[420px] lg:min-h-[480px]">
          {/* Main Editorial Text Block */}
          <div className="flex flex-col items-start max-w-[760px] z-10">
            {/* System Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#202135]/85 border border-[#c3f937]/30 text-[#c3f937] text-xs font-pixel tracking-wide mb-5 shadow-sm backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-sm bg-[#c3f937] shadow-[0_0_8px_#c3f937]" />
              <span>
                {isAr
                  ? 'تحديات واقعية // منتجات رقمية'
                  : 'REAL-WORLD CHALLENGES // DIGITAL PRODUCTS'}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.15] mb-6"
            >
              {isAr ? (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-white">مسارات</span>
                  <span className="text-[#c3f937] drop-shadow-[0_0_24px_rgba(195,249,55,0.4)]">
                    التحدي
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-white">Challenge</span>
                  <span className="text-[#c3f937] drop-shadow-[0_0_24px_rgba(195,249,55,0.4)]">
                    Tracks
                  </span>
                </div>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg md:text-xl text-[#e7edfd]/90 font-medium leading-[1.8] max-w-[680px] mb-8"
            >
              {isAr
                ? 'ثلاثة مسارات مستوحاة من تحديات واقعية في قطاع الأعمال، تنطلق منها الفرق لبناء منتجات رقمية فعّالة باستخدام الذكاء الاصطناعي.'
                : 'Three tracks inspired by real-world enterprise challenges, from which teams launch to build impactful digital products powered by artificial intelligence.'}
            </motion.p>

            {/* Quick Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="flex items-center"
            >
              <motion.button
                type="button"
                onClick={scrollToTracks}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(195, 249, 55, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-sm hover:bg-[#b0e82c] transition-all duration-200 shadow-lg shadow-[#c3f937]/20 cursor-pointer group"
              >
                <Layers className="w-4 h-4 text-[#0c1018]" aria-hidden="true" />
                <span>{isAr ? 'استكشف المسارات الـ 3' : 'Explore the 3 Tracks'}</span>
                <ArrowDown
                  className="w-4 h-4 text-[#0c1018] group-hover:translate-y-1 transition-transform"
                  aria-hidden="true"
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Three-Color Visual & Verified Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, type: 'spring', bounce: 0.25 }}
            className="w-full flex justify-center lg:justify-end z-10"
          >
            <div className="buildx-glass relative w-full max-w-[380px] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between border border-white/10 shadow-2xl overflow-hidden">
              {/* Subtle visual representation of 3 tracks (Pink, Violet, Lime) */}
              <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-white/[0.08]">
                <span className="text-[11px] font-mono tracking-wider text-[#c3f937] px-2.5 py-1 rounded-md bg-[#c3f937]/10 border border-[#c3f937]/25 uppercase font-bold">
                  BUILDx // MATRIX
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fb50c3] shadow-[0_0_6px_#fb50c3]" />
                  <span className="w-2 h-2 rounded-full bg-[#8234f9] shadow-[0_0_6px_#8234f9]" />
                  <span className="w-2 h-2 rounded-full bg-[#c3f937] shadow-[0_0_6px_#c3f937]" />
                </div>
              </div>

              {/* Verified Statistics Grid */}
              <div className="grid grid-cols-1 gap-3.5 my-1">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.num + stat.labelEn}
                      initial={{ opacity: 0, x: isAr ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + idx * 0.1 }}
                      whileHover={{ x: isAr ? -4 : 4 }}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0c1018]/70 border border-white/[0.08] hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                          style={{
                            borderColor: `${stat.accent}40`,
                            backgroundColor: `${stat.accent}15`,
                            color: stat.accent,
                          }}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-[#e7edfd]">
                          {isAr ? stat.labelAr : stat.labelEn}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-0.5">
                        <span
                          className="text-2xl sm:text-3xl font-display font-extrabold"
                          style={{ color: stat.accent }}
                        >
                          {stat.num}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom tag line */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#e7edfd]/60">
                <span>{isAr ? 'نطاق التحديات' : 'Challenge Scope'}</span>
                <span className="text-[#c3f937] font-bold">
                  {isAr ? '3 مسارات حيوية' : '3 High-Impact Tracks'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
