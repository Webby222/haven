"use client";

import { useFormStatus } from "react-dom";
import { deletePropertyAction } from "./actions";

type DeletePropertyControlProps = {
  id: string;
  title: string;
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="text-sm font-semibold text-[#9a4f39] underline-offset-4 hover:underline disabled:opacity-60">
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default function DeletePropertyControl({ id, title }: DeletePropertyControlProps) {
  return (
    <form action={deletePropertyAction} onSubmit={(event) => {
      if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}