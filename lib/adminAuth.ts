import type { User } from "@supabase/supabase-js";

export function isHavenAdmin(user: User | null) {
  return user?.app_metadata?.haven_admin === true;
}