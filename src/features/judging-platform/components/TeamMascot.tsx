// =============================================================================
// BUILDx Mascot Component with Reliable Fallback & No Distorting Filters
// =============================================================================

import React, { useState } from 'react';

interface TeamMascotProps {
  src: string;
  teamCode: string;
  className?: string;
  alt?: string;
}

export function resolveMascotUrl(src?: string, teamCode?: string): string {
  const str = (src || '').toLowerCase();
  
  if (str.includes('ready') || str.includes('الاستعداد')) {
    return '/assets/judging-platform/mascots/ready.png';
  }
  if (str.includes('thinking') || str.includes('التفكير')) {
    return '/assets/judging-platform/mascots/thinking.png';
  }
  if (str.includes('building') || str.includes('بناء')) {
    return '/assets/judging-platform/mascots/building.png';
  }
  if (str.includes('loading') || str.includes('معالجة')) {
    return '/assets/judging-platform/mascots/loading.png';
  }
  if (str.includes('success') || str.includes('اكتمال')) {
    return '/assets/judging-platform/mascots/success.png';
  }
  if (str.includes('error') || str.includes('خطأ')) {
    return '/assets/judging-platform/mascots/error.png';
  }

  // Fallback based on teamCode if available
  if (teamCode) {
    const code = teamCode.trim();
    if (code === '10') return '/assets/judging-platform/mascots/ready.png';
    if (code === '20') return '/assets/judging-platform/mascots/thinking.png';
    if (code === '30' || code === '70') return '/assets/judging-platform/mascots/building.png';
    if (code === '40') return '/assets/judging-platform/mascots/loading.png';
    if (code === '50' || code === '80') return '/assets/judging-platform/mascots/success.png';
    if (code === '60') return '/assets/judging-platform/mascots/error.png';
  }

  return src || '/assets/judging-platform/mascots/ready.png';
}

export const TeamMascot: React.FC<TeamMascotProps> = ({
  src,
  teamCode,
  className = 'w-16 h-16',
  alt = 'Team Mascot',
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = resolveMascotUrl(src, teamCode);

  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`${className} rounded-xl bg-[#182030] border border-[#c3f937]/30 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(195,249,55,0.1)]`}
        title={`الفريق ${teamCode}`}
      >
        <span className="text-[10px] text-[#e7edfd]/60 font-arabic">الفريق</span>
        <span className="font-tech text-lg font-bold text-[#c3f937] leading-none">{teamCode}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${className} object-contain select-none transition-transform duration-300 hover:scale-105`}
      loading="lazy"
    />
  );
};
