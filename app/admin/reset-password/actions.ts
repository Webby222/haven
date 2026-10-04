"use server";

import { redirect } from "next/navigation";
import { requireHavenAdminClient } from "../../../lib/adminServer";

export type PasswordUpdateState = {
  status: "idle" | "error";
  message?: string;
  detail?: string;
};

export async function updateAdminPasswordAction(
  _previousState: PasswordUpdateState,
  formData: FormData,
): Promise<PasswordUpdateState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { status: "error", message: "Use a password with at least 8 characters." };
  }

  if (password !== confirmation) {
    return { status: "error", message: "The passwords do not match." };
  }

  const supabase = await requireHavenAdminClient();
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return {
        status: "error",
        message: "We couldn't update your password. Request a new reset link and try again.",
        ...(process.env.NODE_ENV === "development" ? { detail: error.message } : {}),
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "We couldn't update your password. Request a new reset link and try again.",
      ...(process.env.NODE_ENV === "development" && error instanceof Error ? { detail: error.message } : {}),
    };
  }

  redirect("/admin");
}