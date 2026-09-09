import React from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { AssetPlaceholder } from './AssetPlaceholder';
import { Info, Sparkles } from 'lucide-react';

interface ReminderCardProps {
  lang: Language;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section id="judging-reminder-section" className="py-6 sm:py-10">
      <div className="judging-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-[1120px] mx-auto rounded-[24px] sm:rounded-[30px] p-6 sm:p-9 md:p-11 border border-[#fb50c3]/30 bg-gradient-to-br from-[#202135]/90 via-[#171328]/85 to-[#0c1018]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
        >
          {/* Subtle pink-purple ambient glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.28, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 -right-10 -translate-y-1/2 w-64 h-64 bg-[#fb50c3]/20 blur-3xl pointer-events-none rounded-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-6 md:gap-8 items-center relative z-10">
            {/* Text column */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fb50c3]/15 border border-[#fb50c3]/30 text-[#fb50c3] text-xs font-bold w-fit mb-3">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? 'ملاحظة جوهرية للمشاركين' : 'Key Note for Builders'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#e7edfd] tracking-tight mb-3">
                {isAr ? 'تذكّر' : 'Remember'}
              </h3>

              <p className="text-base sm:text-lg text-[#e7edfd]/90 leading-[1.85] font-normal">
                {isAr
                  ? 'لا يعتمد التقييم على جمال الفكرة وحده؛ المنتج القابل للاستخدام، ووضوح أثره، وجودة تنفيذه، وتوازن مساهمات الفريق جميعها أجزاء أساسية من النتيجة.'
                  : 'Evaluation does not hinge on idea appeal alone; a usable product, measurable impact, technical execution quality, and balanced team contributions are all indispensable pillars of your final score.'}
              </p>
            </div>

            {/* Mascot Column with gentle floating animation */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
              }}
              className="flex justify-center shrink-0"
            >
              <div className="w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center relative select-none">
                <div className="absolute inset-0 bg-radial from-[#fb50c3]/20 via-[#c3f937]/10 to-transparent blur-2xl rounded-full" />
                <img
                  src="https://i.ibb.co/Cf0H0G8/Building.png"
                  alt="BUILDx Mascot"
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_24px_rgba(251,80,195,0.4)]"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
