"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactAction, type ContactActionState } from "./actions";

type ContactProperty = {
  id: string;
  title: string;
  purpose: "sale" | "rent";
};

type ContactFormProps = {
  property: ContactProperty | null;
};

const initialState: ContactActionState = { status: "idle" };

export default function ContactForm({ property }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const initialInterest = property?.purpose === "sale" ? "Buy" : property ? "Rent" : "General enquiry";

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <p className="font-serif text-3xl">Send an enquiry</p>
      {property && (
        <p className="border-l-2 border-[#b56d45] bg-white px-4 py-3 text-sm text-[#667582]">
          Enquiry about <strong className="text-[#162b3d]">{property.title}</strong>
        </p>
      )}
      {state.status === "success" && <p role="status" className="border border-[#b7c9bc] bg-white px-4 py-3 text-sm text-[#355a42]">{state.message}</p>}
      {state.status === "error" && (
        <div role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
          <p>{state.message}</p>
          {state.detail && process.env.NODE_ENV === "development" && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">Supabase: {state.detail}</pre>
          )}
        </div>
      )}
      <input type="hidden" name="property_id" value={property?.id ?? ""} readOnly />
      <label className="block text-sm font-semibold">Name<input name="name" required maxLength={200} autoComplete="name" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
      <label className="block text-sm font-semibold">Email<input name="email" required type="email" maxLength={320} autoComplete="email" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
      <label className="block text-sm font-semibold">Phone<input name="phone" type="tel" maxLength={100} autoComplete="tel" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
      <label className="block text-sm font-semibold">Property interest<select name="interest" defaultValue={initialInterest} className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]"><option value="Buy">Buy</option><option value="Rent">Rent</option><option value="General enquiry">General enquiry</option></select></label>
      <label className="block text-sm font-semibold">Message<textarea name="message" required maxLength={10000} rows={5} className="mt-2 w-full border border-[#cbd5d6] bg-white px-4 py-3 outline-none transition focus:border-[#b56d45]" /></label>
      <button type="submit" disabled={pending} className="min-h-12 bg-[#162b3d] px-7 text-sm font-bold text-white transition hover:bg-[#b56d45] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Sending..." : "Send enquiry"} <span className="ml-3" aria-hidden="true">→</span>
      </button>
    </form>
  );
}