"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestAdminPasswordResetAction, type PasswordResetRequestState } from "./actions";

const initialState: PasswordResetRequestState = { status: "idle" };

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestAdminPasswordResetAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.message && (
        <div role={state.status === "error" ? "alert" : "status"} className={`border bg-white px-4 py-3 text-sm ${state.status === "error" ? "border-[#d8b7a6] text-[#7e4930]" : "border-[#b7c9bc] text-[#355a42]"}`}>
          <p>{state.message}</p>
          {state.detail && process.env.NODE_ENV === "development" && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">Supabase: {state.detail}</pre>}
        </div>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required maxLength={320} autoComplete="username" className="mt-2 min-h-12 w-full border border-[#cbd2d2] bg-white px-4 font-normal outline-none transition focus:border-[#b56d45]" />
      </label>
      <button type="submit" disabled={pending} className="min-h-12 w-full bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Sending..." : "Send reset link"}
      </button>
      <Link href="/admin/login" className="block text-center text-sm font-semibold text-[#b56d45] underline-offset-4 hover:underline">Back to login</Link>
    </form>
  );
}