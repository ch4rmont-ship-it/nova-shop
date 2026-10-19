import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeSiteUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextRaw = request.nextUrl.searchParams.get("next") || "/account";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/account";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${safeSiteUrl()}${next}`);
  }
  return NextResponse.redirect(`${safeSiteUrl()}/login?error=${encodeURIComponent("Authentication link is invalid or expired.")}`);
}
