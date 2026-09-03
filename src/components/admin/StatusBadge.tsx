"use client";
import React from "react";
import type { ExtendedApplicationStatus } from "@/types/admin";
import {
  FileText,
  Search,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  dotColor: string;
  bgClass: string;
  textClass: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STATUS_CONFIG: Record<ExtendedApplicationStatus, StatusConfig> = {
  submitted: {
    label: "طلب جديد",
    dotColor: "#00d2ff",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    icon: FileText,
  },
  under_review: {
    label: "قيد المراجعة",
    dotColor: "#c084fc",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
    borderColor: "border-purple-500/30",
    icon: Search,
  },
  preliminary_candidate: {
    label: "مرشح مبدئي",
    dotColor: "#facc15",
    bgClass: "bg-yellow-500/10",
    textClass: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    icon: Star,
  },
  accepted: {
    label: "مقبول",
    dotColor: "#4ade80",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  waitlisted: {
    label: "قائمة الانتظار",
    dotColor: "#fb923c",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-400",
    borderColor: "border-orange-500/30",
    icon: Clock,
  },
  rejected: {
    label: "غير مقبول",
    dotColor: "#f87171",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-400",
    borderColor: "border-rose-500/30",
    icon: XCircle,
  },
  confirmed: {
    label: "تم تأكيد القبول",
    dotColor: "#c3f937",
    bgClass: "bg-[#c3f937]/15",
    textClass: "text-[#c3f937] font-bold",
    borderColor: "border-[#c3f937]/40",
    icon: UserCheck,
  },
  withdrawn: {
    label: "منسحب",
    dotColor: "#94a3b8",
    bgClass: "bg-slate-500/10",
    textClass: "text-slate-400",
    borderColor: "border-slate-500/30",
    icon: UserX,
  },
};

interface Props {
  status: ExtendedApplicationStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function AdminStatusBadge({ status, size = "md", showIcon = true }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bgClass} ${config.textClass} ${config.borderColor} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
