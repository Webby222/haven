"use client";

import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type AdminNotificationItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  propertyTitle: string | null;
};

type EnquiryNotificationBellProps = {
  count: number | null;
  recent: AdminNotificationItem[];
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default function EnquiryNotificationBell({ count, recent }: EnquiryNotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={count === null ? "Enquiry notifications unavailable" : `${count} new enquiries`}
        aria-expanded={open}
        aria-controls="admin-enquiry-notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center border border-[#dfe3e4] bg-white text-[#162b3d] transition hover:border-[#b56d45] hover:text-[#b56d45]"
      >
        <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
        {count !== null && count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b56d45] px-1 text-[10px] font-bold leading-none text-white">{count > 99 ? "99+" : count}</span>}
      </button>

      {open && (
        <section id="admin-enquiry-notifications" className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] border border-[#dfe3e4] bg-white shadow-[0_14px_34px_rgba(22,43,61,0.16)]" aria-label="New enquiry notifications">
          <div className="flex items-center justify-between border-b border-[#e5e8e7] px-4 py-3">
            <p className="text-sm font-bold text-[#162b3d]">New enquiries{count !== null ? ` (${count})` : ""}</p>
            <button type="button" aria-label="Close notifications" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center text-[#667582] hover:text-[#b56d45]"><X size={16} aria-hidden="true" /></button>
          </div>
          {count === null ? (
            <p className="px-4 py-5 text-sm text-[#7e4930]">Notifications are temporarily unavailable.</p>
          ) : recent.length === 0 ? (
            <p className="px-4 py-5 text-sm text-[#667582]">No new enquiries.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-[#e5e8e7] overflow-y-auto">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/enquiries/${item.id}`} onClick={() => setOpen(false)} className="block px-4 py-3 transition hover:bg-[#f7f5f1]">
                    <span className="block truncate text-sm font-semibold text-[#162b3d]">{item.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#526575]">{item.message.slice(0, 90)}{item.message.length > 90 ? "…" : ""}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#7b8890]">
                      <time dateTime={item.createdAt}>{formatTime(item.createdAt)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{item.propertyTitle ?? "General enquiry"}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/enquiries" onClick={() => setOpen(false)} className="block border-t border-[#e5e8e7] px-4 py-3 text-sm font-semibold text-[#b56d45] transition hover:bg-[#f7f5f1]">View all enquiries</Link>
        </section>
      )}
    </div>
  );
}