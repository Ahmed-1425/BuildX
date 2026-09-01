"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type PixelVariant = "1" | "2" | "3";
type PixelColor = "volt" | "pink" | "white" | "dark";

interface PixelDecorationProps {
  variant?: PixelVariant;
  color?: PixelColor;
  className?: string;
  size?: number;
  opacity?: number;
  animate?: boolean;
}

export default function PixelDecoration({
  variant = "1",
  color = "volt",
  className = "",
  size = 32,
  opacity = 0.3,
  animate = false,
}: PixelDecorationProps) {
  const src = `/assets/icons/pixel/pixel-${variant}-${color}.png`;

  const content = (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={`object-contain pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={className}>{content}</div>;
}
