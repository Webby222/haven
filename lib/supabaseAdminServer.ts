import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAdminSessionCookieOptions, shouldRememberAdminSession } from "./adminSessionCookies";

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return url && key ? { url, key } : null;
}

export async function createAdminServerClient(options: { rememberMe?: boolean } = {}) {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Supabase authentication is not configured.");
  }

  const cookieStore = await cookies();
  const rememberMe = options.rememberMe ?? shouldRememberAdminSession(cookieStore.get("haven_remember_me")?.value);

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, getAdminSessionCookieOptions(options, rememberMe, value));
          });
        } catch {
          // Server Components cannot write cookies; the proxy refreshes them.
        }
      },
    },
  });
}