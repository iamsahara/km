"use client";

import { PortalShell } from "@/components/portal-shell";
import { useKitchenState } from "@/components/kitchen-state-provider";
import type { Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

const displayNameByRole: Record<Role, string> = {
  manager: "Layla",
  staff: "Nina",
};

export function TasksPageClient({ role }: Props) {
  const {
    activeTasks,
    completedTasks,
    supplyOrders,
    completeTask,
    moveOrderToReceiving,
    receiveOrder,
  } = useKitchenState();

  const actor = displayNameByRole[role];
  const orderPhase = supplyOrders.filter((order) => order.phase === "order");
  const receivingPhase = supplyOrders.filter((order) => order.phase === "receiving");

  return (
    <PortalShell
      role={role}
      title="Tasks & Orders"
      description="Checklist completion is tracked by person. Done tasks are removed from active queue."
    >
      <section className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
        <p className="text-sm text-[#5a4b3a]">
          {activeTasks.length} active checklist tasks | {completedTasks.length} completed
        </p>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Checklist Queue</h3>
        <div className="mt-3 space-y-3">
          {activeTasks.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e7dc] bg-[#eef7f1] p-4 text-sm text-[#446048]">
              All checklist tasks are complete for this shift.
            </div>
          ) : (
            activeTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-[#e8d4b8] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">{task.id}</p>
                    <p className="mt-2 text-base font-semibold">{task.title}</p>
                  </div>
                  <span className="rounded-full bg-[#f3e4d1] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#6f573b]">
                    {task.priority}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6b543a]">
                  <span>Station: {task.station}</span>
                  <span>Due: {task.due}</span>
                  <span>Assignee: {task.assignee}</span>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#5a4b3a]">
                  {task.checklist.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <button
                  onClick={() => completeTask(task.id, actor)}
                  className="mt-4 rounded-xl bg-[#1f1b16] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#fef4e7]"
                >
                  Mark Checklist Done
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
          <h3 className="text-base font-semibold">Order Phase</h3>
          <div className="mt-3 space-y-3">
            {orderPhase.length === 0 ? (
              <p className="text-sm text-[#5a4b3a]">No orders waiting in order phase.</p>
            ) : (
              orderPhase.map((order) => (
                <div key={order.id} className="rounded-xl border border-[#efd8c2] bg-white p-3">
                  <p className="text-sm font-semibold">{order.id} | {order.vendor}</p>
                  <p className="mt-1 text-xs text-[#6b543a]">ETA: {order.eta}</p>
                  <p className="mt-2 text-xs text-[#5a4b3a]">
                    {order.items.map((item) => `${item.name} (${item.quantity} ${item.unit})`).join(", ")}
                  </p>
                  <button
                    onClick={() => moveOrderToReceiving(order.id)}
                    className="mt-3 rounded-lg border border-[#1f1b16] px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  >
                    Move to Receiving
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
          <h3 className="text-base font-semibold">Receiving Phase</h3>
          <div className="mt-3 space-y-3">
            {receivingPhase.length === 0 ? (
              <p className="text-sm text-[#5a4b3a]">No orders in receiving phase.</p>
            ) : (
              receivingPhase.map((order) => (
                <div key={order.id} className="rounded-xl border border-[#efd8c2] bg-white p-3">
                  <p className="text-sm font-semibold">{order.id} | {order.vendor}</p>
                  <p className="mt-1 text-xs text-[#6b543a]">ETA: {order.eta}</p>
                  <p className="mt-2 text-xs text-[#5a4b3a]">
                    {order.items.map((item) => `${item.name} (+${item.quantity} ${item.unit})`).join(", ")}
                  </p>
                  <button
                    onClick={() => receiveOrder(order.id, actor)}
                    className="mt-3 rounded-lg bg-[#1f1b16] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#fef4e7]"
                  >
                    Confirm Received + Update Inventory
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e8d4b8] bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6f573b]">Completed Tasks</h3>
        <div className="mt-3 space-y-2">
          {completedTasks.length === 0 ? (
            <p className="text-sm text-[#5a4b3a]">No completed tasks yet.</p>
          ) : (
            completedTasks.slice(0, 8).map((task) => (
              <div key={task.id} className="rounded-xl border border-[#d8e7dc] bg-[#eef7f1] px-3 py-2 text-sm text-[#446048]">
                {task.id} done by {task.completedBy} at {task.completedAt}
              </div>
            ))
          )}
        </div>
      </section>
    </PortalShell>
  );
}
