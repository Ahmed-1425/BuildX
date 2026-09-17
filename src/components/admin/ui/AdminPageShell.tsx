"use client";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Use wider container for review workspace */
  wide?: boolean;
}

/**
 * Shared admin page container.
 * Provides consistent max-width, centering, and responsive padding.
 */
export default function AdminPageShell({ children, className = "", wide = false }: Props) {
  return (
    <div
      className={`admin-page-shell ${wide ? "admin-page-shell--wide" : ""} ${className}`}
      dir="rtl"
    >
      {children}
    </div>
  );
}
