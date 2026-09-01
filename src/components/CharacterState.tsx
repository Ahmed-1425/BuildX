"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type CharacterType =
  | "ready"
  | "thinking"
  | "building"
  | "error"
  | "loading"
  | "success"
  | "hollow"
  | "hollow-volt"
  | "hollow-pink";

interface CharacterStateProps {
  state: CharacterType;
  size?: number;
  className?: string;
  animate?: boolean;
  alt?: string;
}

const CHARACTER_FILES: Record<CharacterType, string> = {
  ready: "/assets/characters/ready.png",
  thinking: "/assets/characters/thinking.png",
  building: "/assets/characters/building.png",
  error: "/assets/characters/error.png",
  loading: "/assets/characters/loading.png",
  success: "/assets/characters/success.png",
  hollow: "/assets/characters/hollow.png",
  "hollow-volt": "/assets/characters/hollow-volt.png",
  "hollow-pink": "/assets/characters/hollow-pink.png",
};

export default function CharacterState({
  state,
  size = 120,
  className = "",
  animate = true,
  alt = "BUILDx character",
}: CharacterStateProps) {
  const src = CHARACTER_FILES[state];

  if (animate) {
    return (
      <motion.div
        className={`inline-flex ${className}`}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-contain"
        />
      </motion.div>
    );
  }

  return (
    <div className={`inline-flex ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}
