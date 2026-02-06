"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";
import { initialReminders, type Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

export function RemindersPageClient({ role }: Props) {
  const [reminders, setReminders] = useState(initialReminders);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const addReminder = () => {
    if (!title.trim()) return;
    setReminders((prev) => [
      {
        id: `R-${String(prev.length + 3).padStart(2, "0")}`,
        title: title.trim(),
        time: time || "Today",
        owner: role === "manager" ? "Manager" : "Staff",
      },
      ...prev,
    ]);
    setTitle("");
    setTime("");
  };

  return (
    <PortalShell
      role={role}
      title="Reminders"
      description="Create in-app reminders for prep, ordering, and sanitation."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Reminder title"
          className="rounded-2xl border border-[#e8d4b8] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8b56c]"
        />
        <input
          value={time}
          onChange={(event) => setTime(event.target.value)}
          placeholder="Time or shift"
          className="rounded-2xl border border-[#e8d4b8] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8b56c]"
        />
        <button
          onClick={addReminder}
          className="rounded-2xl bg-[#1f1b16] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[#fef4e7]"
        >
          Add Reminder
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4"
          >
            <div>
              <p className="font-semibold">{reminder.title}</p>
              <p className="text-sm text-[#5a4b3a]">
                {reminder.time} | {reminder.owner}
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#6f573b]">
              Active
            </span>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
