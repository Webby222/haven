"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { getAdminSessionCookieOptions, shouldRememberAdminSession } from "./adminSessionCookies";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }

  browserClient ??= createBrowserClient(url, key, {
    cookies: {
      getAll() {
        return document.cookie.split(";").flatMap((part) => {
          const separator = part.indexOf("=");
          if (separator < 0) return [];
          const name = part.slice(0, separator).trim();
          const value = part.slice(separator + 1).trim();
          return [{ name, value: decodeURIComponent(value) }];
        });
      },
      setAll(cookiesToSet) {
        const rememberCookie = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("haven_remember_me="));
        const rememberMe = shouldRememberAdminSession(rememberCookie?.slice("haven_remember_me=".length));
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieOptions = getAdminSessionCookieOptions(options as CookieOptions, rememberMe, value);
          const parts = [`${name}=${encodeURIComponent(value)}`];
          if (cookieOptions.path) parts.push(`Path=${cookieOptions.path}`);
          if (cookieOptions.maxAge !== undefined) parts.push(`Max-Age=${cookieOptions.maxAge}`);
          if (cookieOptions.expires) parts.push(`Expires=${cookieOptions.expires.toUTCString()}`);
          if (cookieOptions.domain) parts.push(`Domain=${cookieOptions.domain}`);
          if (cookieOptions.sameSite) {
            const sameSite = cookieOptions.sameSite === true ? "Strict" : String(cookieOptions.sameSite);
            parts.push(`SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}`);
          }
          if (cookieOptions.secure) parts.push("Secure");
          document.cookie = parts.join("; ");
        });
      },
    },
  });
  return browserClient;
}