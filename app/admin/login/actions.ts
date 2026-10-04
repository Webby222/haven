"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isHavenAdmin } from "../../../lib/adminAuth";
import { createAdminServerClient, getSupabasePublicConfig } from "../../../lib/supabaseAdminServer";

export async function loginAction(formData: FormData) {
  if (!getSupabasePublicConfig()) {
    redirect("/admin/login?error=configuration");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email || !password) {
    redirect("/admin/login?error=credentials");
  }

  const supabase = await createAdminServerClient({ rememberMe });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !isHavenAdmin(data.user)) {
    if (data.user) await supabase.auth.signOut();
    redirect("/admin/login?error=credentials");
  }

  const cookieStore = await cookies();
  cookieStore.set("haven_remember_me", rememberMe ? "1" : "0", {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(rememberMe ? { maxAge: 400 * 24 * 60 * 60 } : {}),
  });

  redirect("/admin");
}