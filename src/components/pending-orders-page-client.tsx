"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import {
  useKitchenState,
  type SupplyOrder,
} from "@/components/kitchen-state-provider";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type Props = {
  role: Role;
};

const actorNameByRole: Record<Role, string> = {
  manager: "Layla",
  staff: "Nina",
};

const statusMap: Record<
  SupplyOrder["phase"],
  { label: string; chip: string }
> = {
  order: {
    label: "Not Ordered",
    chip: "bg-[#fff0ee] text-[#9a3e2a] border-[#efc2b8]",
  },
  receiving: {
    label: "In Process",
    chip: "bg-[#fff8e8] text-[#91631c] border-[#f0d9a7]",
  },
  received: {
    label: "Received",
    chip: "bg-[#ecf8ef] text-[#2f6a4a] border-[#bfe0cb]",
  },
};

export function PendingOrdersPageClient({ role }: Props) {
  const router = useRouter();
  const { supplyOrders, moveOrderToReceiving, receiveOrder } = useKitchenState();
  const actor = actorNameByRole[role];

  const pendingOrders = useMemo(
    () => supplyOrders.filter((order) => order.phase !== "received"),
    [supplyOrders]
  );

  const markReceivedAndOpenInventory = (orderId: string) => {
    receiveOrder(orderId, actor);
    router.push(withRole("/inventory", role));
  };

  return (
    <PortalShell
      role={role}
      title="Pending Orders"
      description="Track orders that still need action before inventory is updated."
    >
      <div className="space-y-3">
        {pendingOrders.length === 0 ? (
          <div className="rounded-2xl border border-[#d8e7dc] bg-[#eef7f1] p-4 text-sm text-[#446048]">
            No pending orders. All orders are received.
          </div>
        ) : (
          pendingOrders.map((order) => {
            const status = statusMap[order.phase];
            return (
              <div key={order.id} className="rounded-2xl border border-[#ead7bc] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#1f1b16]">{order.id}</p>
                    <p className="text-xs text-[#6b543a]">Vendor: {order.vendor}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${status.chip}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#6b543a]">
                  Date: {formatDate(order.deliveryDate)} | ETA: {order.eta}
                </p>
                <div className="mt-2 rounded-xl border border-[#efd8c2] bg-[#fff8ee] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a49]">
                    Materials
                  </p>
                  <div className="mt-2 grid gap-1">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-sm text-[#4f4335]">
                        [{item.category}] {item.name} - {item.quantity} {item.unit}
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
                    onClick={() => markReceivedAndOpenInventory(order.id)}
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
    </PortalShell>
  );
}

function formatDate(value: string) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}
