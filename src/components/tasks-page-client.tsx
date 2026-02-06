"use client";

import { useMemo, useState } from "react";
import {
  useKitchenState,
  type SupplyOrder,
} from "@/components/kitchen-state-provider";
import { PortalShell } from "@/components/portal-shell";
import type { Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

type DraftOrderItem = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
};

const displayNameByRole: Record<Role, string> = {
  manager: "Layla",
  staff: "Nina",
};

const phaseRank: Record<SupplyOrder["phase"], number> = {
  order: 0,
  receiving: 1,
  received: 2,
};

const statusMap: Record<
  SupplyOrder["phase"],
  {
    label: string;
    chip: string;
    dot: string;
    icon: string;
  }
> = {
  order: {
    label: "Not Ordered",
    chip: "bg-[#fff0ee] text-[#9a3e2a] border-[#efc2b8]",
    dot: "bg-[#c94b38]",
    icon: "!",
  },
  receiving: {
    label: "In Process",
    chip: "bg-[#fff8e8] text-[#91631c] border-[#f0d9a7]",
    dot: "bg-[#e6ae3a]",
    icon: "...",
  },
  received: {
    label: "Received",
    chip: "bg-[#ecf8ef] text-[#2f6a4a] border-[#bfe0cb]",
    dot: "bg-[#3d9a63]",
    icon: "✓",
  },
};

export function TasksPageClient({ role }: Props) {
  const {
    activeTasks,
    completedTasks,
    supplyOrders,
    addSupplyOrder,
    toggleChecklistItem,
    completeTask,
    moveOrderToReceiving,
    receiveOrder,
  } = useKitchenState();

  const [vendor, setVendor] = useState("");
  const [eta, setEta] = useState("");
  const [draftItems, setDraftItems] = useState<DraftOrderItem[]>([
    { id: "row-1", name: "", quantity: "", unit: "kg" },
  ]);
  const [nextRow, setNextRow] = useState(2);
  const [orderError, setOrderError] = useState("");

  const actor = displayNameByRole[role];

  const orderStats = useMemo(
    () => ({
      order: supplyOrders.filter((order) => order.phase === "order").length,
      receiving: supplyOrders.filter((order) => order.phase === "receiving").length,
      received: supplyOrders.filter((order) => order.phase === "received").length,
    }),
    [supplyOrders]
  );

  const sortedOrders = useMemo(
    () => [...supplyOrders].sort((a, b) => phaseRank[a.phase] - phaseRank[b.phase]),
    [supplyOrders]
  );

  const addItemRow = () => {
    setDraftItems((prev) => [
      ...prev,
      { id: `row-${nextRow}`, name: "", quantity: "", unit: "kg" },
    ]);
    setNextRow((prev) => prev + 1);
  };

  const removeItemRow = (rowId: string) => {
    setDraftItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== rowId);
    });
  };

  const updateItem = (rowId: string, field: keyof DraftOrderItem, value: string) => {
    setDraftItems((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const submitOrder = () => {
    const cleanItems = draftItems
      .map((row) => ({
        name: row.name.trim(),
        quantity: Number(row.quantity),
        unit: row.unit,
      }))
      .filter((row) => row.name && row.quantity > 0);

    if (!vendor.trim()) {
      setOrderError("Please add vendor name.");
      return;
    }

    if (cleanItems.length === 0) {
      setOrderError("Please add at least one valid item.");
      return;
    }

    addSupplyOrder({
      vendor,
      eta,
      items: cleanItems,
    });

    setOrderError("");
    setVendor("");
    setEta("");
    setDraftItems([{ id: "row-1", name: "", quantity: "", unit: "kg" }]);
    setNextRow(2);
  };

  return (
    <PortalShell
      role={role}
      title="Tasks & Orders"
      description="Simple flow: finish checklist, add orders, move to receiving, confirm arrival."
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatBox label="Checklist" value={activeTasks.length} tone="neutral" sub="Tasks to finish" />
        <StatBox label="Not Ordered" value={orderStats.order} tone="red" sub="Need action" />
        <StatBox label="In Process" value={orderStats.receiving} tone="yellow" sub="Receiving now" />
        <StatBox label="Received" value={orderStats.received} tone="green" sub="Inventory updated" />
        <StatBox label="Done Tasks" value={completedTasks.length} tone="neutral" sub="Completed" />
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Checklist Tasks</h3>
        <p className="mt-1 text-sm text-[#5a4b3a]">Tap each row to mark it done.</p>
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
                <div className="mt-3 space-y-2">
                  {task.checklist.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => toggleChecklistItem(task.id, step.id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition ${
                        step.done
                          ? "border-[#cfe3d4] bg-[#eef7f1] text-[#446048]"
                          : "border-[#efd8c2] bg-[#fff7ec] text-[#5a4b3a]"
                      }`}
                    >
                      <span className={step.done ? "line-through" : ""}>{step.label}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {step.done ? "Done" : "Tap to Done"}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#6b543a]">
                  {task.checklist.filter((item) => item.done).length}/{task.checklist.length} steps done
                </p>
                <button
                  onClick={() => completeTask(task.id, actor)}
                  disabled={!task.checklist.every((item) => item.done)}
                  className="mt-4 w-full rounded-xl bg-[#1f1b16] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[#fef4e7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Finish Task
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-[#ead7bc] bg-[#fff8ee] p-4">
          <h3 className="text-lg font-semibold">Add New Order</h3>
          <p className="mt-1 text-sm text-[#5a4b3a]">Add vendor and materials, then press Add Order.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a49]">Vendor</label>
              <input
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
                placeholder="Example: Fresh Farm"
                className="mt-1 w-full rounded-xl border border-[#e8d4b8] bg-white px-3 py-2.5 text-sm focus:border-[#cfa977] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a49]">ETA</label>
              <input
                value={eta}
                onChange={(event) => setEta(event.target.value)}
                placeholder="Example: Today 4:30 PM"
                className="mt-1 w-full rounded-xl border border-[#e8d4b8] bg-white px-3 py-2.5 text-sm focus:border-[#cfa977] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {draftItems.map((row) => (
              <div
                key={row.id}
                className="grid gap-2 rounded-xl border border-[#ead7bc] bg-white p-3 md:grid-cols-[1.2fr_0.55fr_0.45fr_auto]"
              >
                <input
                  value={row.name}
                  onChange={(event) => updateItem(row.id, "name", event.target.value)}
                  placeholder="Item name"
                  className="rounded-lg border border-[#e8d4b8] px-3 py-2 text-sm focus:border-[#cfa977] focus:outline-none"
                />
                <input
                  value={row.quantity}
                  onChange={(event) => updateItem(row.id, "quantity", event.target.value)}
                  placeholder="Qty"
                  inputMode="decimal"
                  className="rounded-lg border border-[#e8d4b8] px-3 py-2 text-sm focus:border-[#cfa977] focus:outline-none"
                />
                <select
                  value={row.unit}
                  onChange={(event) => updateItem(row.id, "unit", event.target.value)}
                  className="rounded-lg border border-[#e8d4b8] px-3 py-2 text-sm focus:border-[#cfa977] focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="pcs">pcs</option>
                  <option value="box">box</option>
                </select>
                <button
                  onClick={() => removeItemRow(row.id)}
                  className="rounded-lg border border-[#d6b995] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6f573b]"
                  disabled={draftItems.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={addItemRow}
              className="rounded-lg border border-[#1f1b16] px-3 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Add Item Row
            </button>
            <button
              onClick={submitOrder}
              className="rounded-lg bg-[#1f1b16] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#fef4e7]"
            >
              Add Order
            </button>
          </div>

          {orderError ? <p className="mt-2 text-sm font-semibold text-[#9a3e2a]">{orderError}</p> : null}
        </div>

        <div className="rounded-2xl border border-[#ead7bc] bg-[#fff8ee] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Order Flow</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6b543a]">
              <StatusTag phase="order" compact />
              <StatusTag phase="receiving" compact />
              <StatusTag phase="received" compact />
            </div>
          </div>
          <p className="mt-1 text-sm text-[#5a4b3a]">Red = not ordered, Yellow = in process, Green = received.</p>

          <div className="mt-3 space-y-3">
            {sortedOrders.length === 0 ? (
              <p className="rounded-xl border border-[#efd8c2] bg-white px-3 py-2 text-sm text-[#5a4b3a]">
                No orders yet. Add one from the left section.
              </p>
            ) : (
              sortedOrders.map((order) => {
                const status = statusMap[order.phase];

                return (
                  <div key={order.id} className="rounded-xl border border-[#efd8c2] bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#1f1b16]">{order.id}</p>
                        <p className="text-xs text-[#6b543a]">Vendor: {order.vendor}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${status.chip}`}>
                        <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                        {status.icon} {status.label}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#6b543a]">ETA: {order.eta}</p>

                    <div className="mt-2 rounded-lg border border-[#f0dfc9] bg-[#fff9f1] p-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a49]">Materials</p>
                      <div className="mt-2 grid gap-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-[#4f4335]">
                            {item.name} - {item.quantity} {item.unit}
                          </p>
                        ))}
                      </div>
                    </div>

                    {order.phase === "order" ? (
                      <button
                        onClick={() => moveOrderToReceiving(order.id)}
                        className="mt-3 w-full rounded-lg border border-[#1f1b16] px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#1f1b16]"
                      >
                        Start Receiving
                      </button>
                    ) : null}

                    {order.phase === "receiving" ? (
                      <button
                        onClick={() => receiveOrder(order.id, actor)}
                        className="mt-3 w-full rounded-lg bg-[#1f1b16] px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#fef4e7]"
                      >
                        Mark Received + Update Inventory
                      </button>
                    ) : null}
                  </div>
                );
              })
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
              <div
                key={task.id}
                className="rounded-xl border border-[#d8e7dc] bg-[#eef7f1] px-3 py-2 text-sm text-[#446048]"
              >
                {task.id} done by {task.completedBy} at {task.completedAt}
              </div>
            ))
          )}
        </div>
      </section>
    </PortalShell>
  );
}

function StatusTag({ phase, compact = false }: { phase: SupplyOrder["phase"]; compact?: boolean }) {
  const status = statusMap[phase];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${status.chip} ${
        compact ? "whitespace-nowrap" : ""
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
}

function StatBox({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: number;
  tone: "neutral" | "red" | "yellow" | "green";
  sub: string;
}) {
  const style =
    tone === "red"
      ? "border-[#efc2b8] bg-[#fff0ee] text-[#9a3e2a]"
      : tone === "yellow"
      ? "border-[#f0d9a7] bg-[#fff8e8] text-[#91631c]"
      : tone === "green"
      ? "border-[#bfe0cb] bg-[#ecf8ef] text-[#2f6a4a]"
      : "border-[#e8d4b8] bg-[#fff7ec] text-[#5a4b3a]";

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${style}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-1.5 text-xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs">{sub}</p>
    </div>
  );
}
