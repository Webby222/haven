"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendInquiryReplyAction, type SendInquiryReplyState } from "./replyActions";

type ReplyComposerProps = {
  inquiryId: string;
  toEmail: string;
  subject: string;
};

const initialState: SendInquiryReplyState = { status: "idle" };

export default function ReplyComposer({ inquiryId, toEmail, subject }: ReplyComposerProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendInquiryReplyAction.bind(null, inquiryId), initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "sent") formRef.current?.reset();
  }, [state]);

  return (
    <section className="mt-8 border-t border-[#dfe3e4] pt-8" aria-labelledby="reply-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="reply-heading" className="font-serif text-2xl">Reply</h2>
        {!open && <button type="button" onClick={() => setOpen(true)} className="min-h-10 bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45]">Reply</button>}
      </div>

      {state.status === "sent" && <p role="status" className="mt-4 border border-[#b7c9bc] bg-white px-4 py-3 text-sm text-[#355a42]">{state.message}</p>}
      {state.status === "error" && <p role="alert" className="mt-4 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">{state.message}</p>}
      {state.status === "uncertain" && (
        <p role="alert" className="mt-4 border border-[#e4c999] bg-white px-4 py-3 text-sm text-[#795c27]">{state.message}{state.detail && process.env.NODE_ENV === "development" ? ` ${state.detail}` : ""}</p>
      )}

      {open && (
        <form ref={formRef} action={formAction} className="mt-5 space-y-5 border border-[#dfe3e4] bg-white p-5 sm:p-6">
          <p className="text-sm"><span className="font-semibold text-[#667582]">To:</span> <span className="font-medium text-[#162b3d]">{toEmail}</span></p>
          <label className="block text-sm font-semibold">
            Subject
            <input name="subject" required maxLength={200} defaultValue={subject} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
          </label>
          <label className="block text-sm font-semibold">
            Message
            <textarea name="message" required maxLength={10000} rows={7} className="mt-2 w-full border border-[#cbd2d2] bg-white px-3 py-3 font-normal leading-6 outline-none focus:border-[#b56d45]" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending} className="min-h-11 bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45] disabled:cursor-wait disabled:opacity-60">{pending ? "Sending..." : "Send reply"}</button>
            <button type="button" disabled={pending} onClick={() => setOpen(false)} className="min-h-11 border border-[#cbd2d2] px-5 text-sm font-semibold disabled:opacity-60">Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}