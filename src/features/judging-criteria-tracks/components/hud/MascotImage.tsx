import React, { useState, useEffect } from 'react';
import type { MascotState } from './mobileNavigationConfig';
import { MASCOT_STATES } from './mobileNavigationConfig';

interface MascotImageProps {
  state: MascotState;
  size?: number; // size in pixels (e.g. 48)
  className?: string;
}

// 8x8 pixel matrix patterns for retro gaming fallback when PNGs are pending upload
const MASCOT_PIXEL_MATRICES: Record<MascotState, number[][]> = {
  ready: [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 0, 1, 1],
  ],
  thinking: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 2, 0, 0],
  ],
  building: [
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 0, 1, 1],
  ],
  loading: [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
  success: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 0, 0, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
  ],
  error: [
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 0, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 0, 0],
    [0, 0, 1, 2, 2, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
  ],
};

export const MascotImage: React.FC<MascotImageProps> = ({
  state,
  size = 48,
  className = '',
}) => {
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const config = MASCOT_STATES[state];
  const matrix = MASCOT_PIXEL_MATRICES[state] || MASCOT_PIXEL_MATRICES.ready;

  useEffect(() => {
    setLoadFailed(false);
  }, [state]);

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {!loadFailed && config?.src ? (
        <img
          src={config.src}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_8px_rgba(195,249,55,0.4)] transition-transform duration-200"
          onError={() => setLoadFailed(true)}
          referrerPolicy="no-referrer"
          draggable={false}
        />
      ) : (
        /* CSS Pixel-Grid Fallback Matrix */
        <div
          className="pixel-mascot-fallback"
          style={{ width: size * 0.72, height: size * 0.72 }}
        >
          {matrix.flatMap((row, rIdx) =>
            row.map((val, cIdx) => {
              let dotClass = 'pixel-dot-dim';
              if (val === 1) dotClass = 'pixel-dot-active';
              else if (val === 2) dotClass = 'pixel-dot-pink';
              return <div key={`${rIdx}-${cIdx}`} className={dotClass} />;
            })
          )}
        </div>
      )}
    </div>
  );
};
