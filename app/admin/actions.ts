"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createAdminServerClient, getSupabasePublicConfig } from "../../lib/supabaseAdminServer";

export async function logoutAction() {
  if (getSupabasePublicConfig()) {
    const supabase = await createAdminServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.set("haven_remember_me", "", { path: "/", maxAge: 0 });
  redirect("/admin/login");
}