import type { CookieOptions } from "@supabase/ssr";

export function shouldRememberAdminSession(cookieValue: string | undefined) {
  return cookieValue !== "0";
}

export function getAdminSessionCookieOptions(
  options: CookieOptions,
  rememberMe: boolean,
  value: string,
): CookieOptions {
  if (rememberMe || !value) return options;

  const sessionOptions = { ...options };
  delete sessionOptions.maxAge;
  delete sessionOptions.expires;
  return sessionOptions;
}