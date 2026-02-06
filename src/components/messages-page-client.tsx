"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";
import { initialMessages, type Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

export function MessagesPageClient({ role }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `M-${String(prev.length + 1).padStart(2, "0")}`,
        sender: role === "manager" ? "Manager" : "Staff",
        time: "Just now",
        message: draft.trim(),
      },
    ]);
    setDraft("");
  };

  return (
    <PortalShell
      role={role}
      title="Messages"
      description="Send quick in-app updates between staff and kitchen managers."
    >
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{message.sender}</p>
              <span className="text-xs text-[#6f573b]">{message.time}</span>
            </div>
            <p className="mt-2 text-sm text-[#5a4b3a]">{message.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message for your team"
          rows={4}
          className="rounded-2xl border border-[#e8d4b8] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8b56c]"
        />
        <button
          onClick={sendMessage}
          className="w-full rounded-2xl bg-[#1f1b16] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[#fef4e7] md:w-auto"
        >
          Send Message
        </button>
      </div>
    </PortalShell>
  );
}
