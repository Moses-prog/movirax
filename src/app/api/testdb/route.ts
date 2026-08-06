import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("watchlist").select("*").eq("type", "tv");
  return NextResponse.json({ data, error });
}
