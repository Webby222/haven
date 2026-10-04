"use server";

import { revalidatePath } from "next/cache";
import { requireHavenAdminClient } from "../../../lib/adminServer";

export type SendInquiryReplyState = {
  status: "idle" | "sent" | "error" | "uncertain";
  message?: string;
  detail?: string;
};

const inquiryIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function recordFailedReply(supabase: Awaited<ReturnType<typeof requireHavenAdminClient>>, replyId: string, failureMessage: string) {
  const { error } = await supabase
    .from("inquiry_replies")
    .update({ status: "failed", failure_message: failureMessage.slice(0, 1000) })
    .eq("id", replyId);
  return error;
}

export async function sendInquiryReplyAction(
  inquiryId: string,
  _previousState: SendInquiryReplyState,
  formData: FormData,
): Promise<SendInquiryReplyState> {
  if (!inquiryIdPattern.test(inquiryId)) {
    return { status: "error", message: "This enquiry could not be verified." };
  }

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!subject || subject.length > 200 || !message || message.length > 10000) {
    return { status: "error", message: "Enter a subject and a message of up to 10,000 characters." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return {
      status: "error",
      message: "Email sending is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL on the server.",
    };
  }

  const supabase = await requireHavenAdminClient();
  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .select("id,email")
    .eq("id", inquiryId)
    .maybeSingle();

  if (inquiryError || !inquiry) {
    return {
      status: "error",
      message: "The enquiry recipient could not be verified.",
      ...(process.env.NODE_ENV === "development" && inquiryError ? { detail: inquiryError.message } : {}),
    };
  }

  const { data: reply, error: insertError } = await supabase
    .from("inquiry_replies")
    .insert({ inquiry_id: inquiryId, to_email: inquiry.email, subject, message, status: "pending" })
    .select("id")
    .single();

  if (insertError || !reply) {
    return {
      status: "error",
      message: "The reply could not be recorded, so it was not sent.",
      ...(process.env.NODE_ENV === "development" && insertError ? { detail: insertError.message } : {}),
    };
  }
  const replyId = reply.id;

  let providerId: string | null = null;
  let sendFailure: string | null = null;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [inquiry.email],
        subject,
        text: message,
      }),
    });
    const result = await response.json().catch(() => null) as { id?: string; message?: string; name?: string } | null;

    if (!response.ok || !result?.id) {
      sendFailure = result?.message ?? result?.name ?? `Resend returned HTTP ${response.status}.`;
    } else {
      providerId = result.id;
    }
  } catch (error) {
    sendFailure = error instanceof Error ? error.message : "Could not connect to Resend.";
  }

  if (sendFailure) {
    let historyFailure: string | null = null;
    try {
      const error = await recordFailedReply(supabase, replyId, sendFailure);
      historyFailure = error?.message ?? null;
    } catch (error) {
      historyFailure = error instanceof Error ? error.message : "Failed to update reply history.";
    }

    revalidatePath(`/admin/enquiries/${inquiryId}`);
    revalidatePath("/admin/enquiries");
    return {
      status: "error",
      message: historyFailure
        ? `Resend failed: ${sendFailure}. The failed attempt could not be saved: ${historyFailure}`
        : `Resend failed: ${sendFailure}`,
    };
  }

  try {
    const { error } = await supabase
      .from("inquiry_replies")
      .update({ status: "sent", provider_message_id: providerId, sent_at: new Date().toISOString(), failure_message: null })
      .eq("id", replyId);

    revalidatePath(`/admin/enquiries/${inquiryId}`);
    revalidatePath("/admin/enquiries");

    if (error) {
      return {
        status: "uncertain",
        message: "Resend accepted the email, but the reply history could not be updated. Do not resend until you check the history.",
        ...(process.env.NODE_ENV === "development" ? { detail: error.message } : {}),
      };
    }
  } catch (error) {
    revalidatePath(`/admin/enquiries/${inquiryId}`);
    return {
      status: "uncertain",
      message: "Resend accepted the email, but the reply history could not be updated. Do not resend until you check the history.",
      ...(process.env.NODE_ENV === "development" && error instanceof Error ? { detail: error.message } : {}),
    };
  }

  return { status: "sent", message: "Reply sent successfully." };
}