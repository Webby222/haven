"use server";

import { getSupabaseClient } from "../../lib/supabase";

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  detail?: string;
};

const interestOptions = ["Buy", "Rent", "General enquiry"] as const;

function actionError(message: string, detail?: string): ContactActionState {
  return {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && detail ? { detail } : {}),
  };
}

export async function submitContactAction(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const interestValue = String(formData.get("interest") ?? "General enquiry");
  const propertyParam = String(formData.get("property_id") ?? "").trim();

  if (!name || name.length > 200) {
    return actionError("Enter your name (up to 200 characters).", "Invalid name field.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return actionError("Enter a valid email address.", "Invalid email field.");
  }

  if (!message || message.length > 10000) {
    return actionError("Enter a message (up to 10,000 characters).", "Invalid message field.");
  }

  if (phone.length > 100) {
    return actionError("Phone number must be 100 characters or fewer.", "Invalid phone field.");
  }

  const interest = interestOptions.includes(interestValue as (typeof interestOptions)[number])
    ? interestValue
    : "General enquiry";
  const supabase = getSupabaseClient();

  if (!supabase) {
    return actionError("We couldn't send your enquiry right now.", "Supabase is not configured.");
  }

  try {
    let propertyId: string | null = null;
    if (propertyParam) {
      const { data, error } = await supabase
        .from("properties")
        .select("id")
        .eq("id", propertyParam)
        .maybeSingle();

      if (error) {
        return actionError("We couldn't verify the property. Please try again.", error.message);
      }

      propertyId = data?.id ?? null;
    }

    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone: phone || null,
      interest,
      message,
      property_id: propertyId,
    });

    if (error) {
      return actionError("We couldn't send your enquiry right now. Please try again.", error.message);
    }

    return { status: "success", message: "Thank you. Your enquiry has been sent." };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown Supabase connection error.";
    return actionError("We couldn't send your enquiry right now. Please try again.", detail);
  }
}