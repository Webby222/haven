"use server";

import { headers } from "next/headers";
import { createAdminServerClient, getSupabasePublicConfig } from "../../../lib/supabaseAdminServer";

export type PasswordResetRequestState = {
  status: "idle" | "success" | "error";
  message?: string;
  detail?: string;
};

function getRequestOrigin(headerStore: Headers) {
  const requestOrigin = headerStore.get("origin");
  if (requestOrigin) {
    try {
      return new URL(requestOrigin).origin;
    } catch {
      return null;
    }
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) return null;
  const protocol = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? (host.startsWith("localhost") ? "http" : "https");
  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return null;
  }
}

export async function requestAdminPasswordResetAction(
  _previousState: PasswordResetRequestState,
  formData: FormData,
): Promise<PasswordResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (!getSupabasePublicConfig()) {
    return { status: "error", message: "Password reset is temporarily unavailable." };
  }

  const origin = getRequestOrigin(await headers());
  if (!origin) {
    return { status: "error", message: "Password reset is temporarily unavailable." };
  }

  try {
    const supabase = await createAdminServerClient({ rememberMe: true });
    const redirectTo = new URL("/auth/callback?next=%2Fadmin%2Freset-password", origin).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      return {
        status: "error",
        message: "We couldn't request a password reset right now. Try again later.",
        ...(process.env.NODE_ENV === "development" ? { detail: error.message } : {}),
      };
    }

    return { status: "success", message: "If an account matches that email, reset instructions will be sent." };
  } catch (error) {
    return {
      status: "error",
      message: "We couldn't request a password reset right now. Try again later.",
      ...(process.env.NODE_ENV === "development" && error instanceof Error ? { detail: error.message } : {}),
    };
  }
}