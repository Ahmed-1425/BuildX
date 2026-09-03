import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/admin/auth";
import { recordAuditLog } from "@/lib/admin/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { id: applicationId } = await params;
    const { note, is_pinned } = await req.json();

    if (!note || typeof note !== "string" || !note.trim()) {
      return NextResponse.json({ success: false, error: "الملاحظة لا يمكن أن تكون فارغة." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: newNote, error } = await supabase
      .from("application_notes")
      .insert({
        application_id: applicationId,
        author_id: admin.id,
        note: note.trim(),
        is_pinned: Boolean(is_pinned),
      })
      .select("*, admin_users!author_id(full_name)")
      .single();

    if (error) {
      console.error("[admin/notes] Insert error:", error);
      return NextResponse.json({ success: false, error: "تعذر حفظ الملاحظة." }, { status: 500 });
    }

    await recordAuditLog({
      actor_id: admin.id,
      application_id: applicationId,
      action: "add_note",
      note: `إضافة ملاحظة داخلية بواسطة ${admin.full_name}`,
    });

    return NextResponse.json({
      success: true,
      note: {
        ...newNote,
        author_name: (newNote as any).admin_users?.full_name || admin.full_name,
      },
    });
  } catch (err) {
    console.error("[admin/notes] Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { note_id, note, is_pinned } = await req.json();
    if (!note_id) {
      return NextResponse.json({ success: false, error: "معرف الملاحظة مطلوب." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verify ownership or super_admin role
    const { data: existing } = await supabase
      .from("application_notes")
      .select("author_id")
      .eq("id", note_id)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: "الملاحظة غير موجودة." }, { status: 404 });
    }

    if (existing.author_id !== admin.id && admin.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "لا يمكنك تعديل ملاحظة شخص آخر." }, { status: 403 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (note !== undefined) updates.note = note.trim();
    if (is_pinned !== undefined) updates.is_pinned = Boolean(is_pinned);

    const { data: updated, error } = await supabase
      .from("application_notes")
      .update(updates)
      .eq("id", note_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "تعذر تحديث الملاحظة." }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: updated });
  } catch (err) {
    console.error("[admin/notes] PATCH Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح لك." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("note_id");

    if (!noteId) {
      return NextResponse.json({ success: false, error: "معرف الملاحظة مطلوب." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from("application_notes")
      .select("author_id")
      .eq("id", noteId)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: "الملاحظة غير موجودة." }, { status: 404 });
    }

    if (existing.author_id !== admin.id && admin.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "لا يمكنك حذف ملاحظة شخص آخر." }, { status: 403 });
    }

    // Soft delete
    await supabase
      .from("application_notes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", noteId);

    return NextResponse.json({ success: true, message: "تم حذف الملاحظة." });
  } catch (err) {
    console.error("[admin/notes] DELETE Error:", err);
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
