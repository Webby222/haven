"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireHavenAdminClient } from "../../../lib/adminServer";

const inquiryIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function archiveInquiryAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!inquiryIdPattern.test(id)) redirect("/admin/enquiries?error=archive");

  const supabase = await requireHavenAdminClient();
  let updateFailed = false;
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status: "archived" })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    updateFailed = Boolean(error || !data);
  } catch {
    updateFailed = true;
  }
  if (updateFailed) redirect(`/admin/enquiries/${id}?error=archive`);

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  redirect(`/admin/enquiries/${id}?status=archived`);
}