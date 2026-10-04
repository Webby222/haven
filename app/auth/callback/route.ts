import { NextResponse, type NextRequest } from "next/server";
import { isHavenAdmin } from "../../../lib/adminAuth";
import { createAdminServerClient } from "../../../lib/supabaseAdminServer";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = request.nextUrl.searchParams.get("next");

  if (!code || nextPath !== "/admin/reset-password") {
    return NextResponse.redirect(new URL("/admin/login?error=reset", request.url));
  }

  try {
    const rememberMe = request.cookies.get("haven_remember_me")?.value !== "0";
    const supabase = await createAdminServerClient({ rememberMe });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/admin/login?error=reset", request.url));

    const { data: { user } } = await supabase.auth.getUser();
    if (!isHavenAdmin(user)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login?error=reset", request.url));
    }

    return NextResponse.redirect(new URL(nextPath, request.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=reset", request.url));
  }
}