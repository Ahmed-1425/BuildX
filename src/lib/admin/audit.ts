import { createServerClient } from "@/lib/supabase/server";

interface RecordAuditParams {
  actor_id?: string | null;
  application_id?: string | null;
  action: string;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  note?: string | null;
}

export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  try {
    const supabase = createServerClient();
    await supabase.from("admin_audit_logs").insert({
      actor_id: params.actor_id ?? null,
      application_id: params.application_id ?? null,
      action: params.action,
      previous_data: params.previous_data ?? null,
      new_data: params.new_data ?? null,
      note: params.note ?? null,
    });
  } catch (err) {
    console.error("[recordAuditLog] Failed to record audit log:", err);
  }
}
