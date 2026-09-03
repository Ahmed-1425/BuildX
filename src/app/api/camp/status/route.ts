import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("camp_settings")
      .select("value")
      .eq("key", "registration_open")
      .single();

    const isOpen = data ? Boolean(data.value) : true;
    return NextResponse.json({ registration_open: isOpen });
  } catch {
    return NextResponse.json({ registration_open: true });
  }
}
