"use client";

import { PortalShell } from "@/components/portal-shell";
import { useKitchenState } from "@/components/kitchen-state-provider";
import type { Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

export function DashboardPageClient({ role }: Props) {
  const { notifications } = useKitchenState();

  return (
    <PortalShell
      role={role}
      title="Dashboard"
      description="Interactive inventory and task control for hotel kitchens."
    >
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#ebd6bb] bg-[#fff8ee] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notification Inbox</h3>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8a6a49]">
              In-App
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efdcc5] bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#2a231b]">{item.title}</p>
                  <span className="text-xs font-semibold text-[#8a6a49]">{item.time}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#5a4b3a]">{item.detail}</p>
              </div>
            ))}
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-[#efdcc5] bg-white p-3 text-sm text-[#6b543a]">
                No notifications yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
