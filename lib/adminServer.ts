import { redirect } from "next/navigation";
import { isHavenAdmin } from "./adminAuth";
import { createAdminServerClient, getSupabasePublicConfig } from "./supabaseAdminServer";

export async function requireHavenAdminClient() {
  if (!getSupabasePublicConfig()) redirect("/admin/login");

  const supabase = await createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isHavenAdmin(user)) redirect("/admin/login");

  return supabase;
}