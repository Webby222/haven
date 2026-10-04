import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isHavenAdmin } from "./lib/adminAuth";
import { getAdminSessionCookieOptions, shouldRememberAdminSession } from "./lib/adminSessionCookies";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (["/admin/login", "/admin/forgot-password"].includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });
  const rememberMe = shouldRememberAdminSession(request.cookies.get("haven_remember_me")?.value);
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, getAdminSessionCookieOptions(options, rememberMe, value));
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isHavenAdmin(user);
  const isPublicAdminPage = ["/admin/login", "/admin/forgot-password"].includes(request.nextUrl.pathname);

  if (!isAdmin && !isPublicAdminPage) {
    const loginUrl = new URL("/admin/login", request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (isAdmin && isPublicAdminPage) {
    const adminUrl = new URL("/admin", request.url);
    const redirectResponse = NextResponse.redirect(adminUrl);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};