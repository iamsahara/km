"use client";

import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { useKitchenState } from "@/components/kitchen-state-provider";
import { initialNotifications, type Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type Props = {
  role: Role;
};

export function DashboardPageClient({ role }: Props) {
  const { activeTasks, completedTasks, supplyOrders, inventory } = useKitchenState();

  const receivingCount = supplyOrders.filter((order) => order.phase === "receiving").length;
  const lowStockCount = inventory.filter((item) => item.onHand <= item.reorderLevel).length;

  return (
    <PortalShell
      role={role}
      title="Dashboard"
      description="Interactive inventory and task control for hotel kitchens."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Open tasks" value={activeTasks.length} tone="dark" />
        <StatCard label="Completed" value={completedTasks.length} tone="light" />
        <StatCard label="Receiving" value={receivingCount} tone="light" />
        <StatCard label="Low stock" value={lowStockCount} tone="warn" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
          <h3 className="text-lg font-semibold">In-App Notifications</h3>
          <div className="mt-4 space-y-3">
            {initialNotifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efd8c2] bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-xs text-[#7a6349]">{item.time}</span>
                </div>
                <p className="mt-2 text-xs text-[#5a4b3a]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8d4b8] bg-white p-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-4 grid gap-2">
            <ActionLink href={withRole("/tasks", role)} label="Task Checklists" />
            <ActionLink href={withRole("/tasks", role)} label="Order + Receiving" />
            <ActionLink href={withRole("/inventory", role)} label="Live Inventory" />
            <ActionLink href={withRole("/reminders", role)} label="Add Reminders" />
            {role === "manager" ? (
              <ActionLink href={withRole("/manager/issues", role)} label="Review Issues" />
            ) : null}
          </div>
        </div>
      </section>
    </PortalShell>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "dark" | "light" | "warn" }) {
  const style =
    tone === "dark"
      ? "bg-[#1f1b16] text-[#fef4e7]"
      : tone === "warn"
      ? "border border-[#efd8c2] bg-[#fff7ec] text-[#8a4d2f]"
      : "border border-[#e8d4b8] bg-white text-[#1f1b16]";

  return (
    <div className={`rounded-2xl p-4 ${style}`}>
      <p className="text-xs uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#e8d4b8] bg-[#fff7ec] px-3 py-2 text-sm font-semibold text-[#5a4b3a] transition hover:bg-[#f3e4d1]"
    >
      {label}
    </Link>
  );
}
