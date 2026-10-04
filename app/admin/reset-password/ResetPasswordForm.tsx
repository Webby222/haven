"use client";

import { useActionState } from "react";
import { updateAdminPasswordAction, type PasswordUpdateState } from "./actions";

const initialState: PasswordUpdateState = { status: "idle" };

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updateAdminPasswordAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.message && (
        <div role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
          <p>{state.message}</p>
          {state.detail && process.env.NODE_ENV === "development" && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">Supabase: {state.detail}</pre>}
        </div>
      )}
      <label className="block text-sm font-semibold">
        New password
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 min-h-12 w-full border border-[#cbd2d2] bg-white px-4 font-normal outline-none transition focus:border-[#b56d45]" />
      </label>
      <label className="block text-sm font-semibold">
        Confirm new password
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-2 min-h-12 w-full border border-[#cbd2d2] bg-white px-4 font-normal outline-none transition focus:border-[#b56d45]" />
      </label>
      <button type="submit" disabled={pending} className="min-h-12 w-full bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}