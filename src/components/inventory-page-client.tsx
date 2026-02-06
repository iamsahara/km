"use client";

import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { useKitchenState } from "@/components/kitchen-state-provider";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type Props = {
  role: Role;
};

export function InventoryPageClient({ role }: Props) {
  const { inventory, inventoryLog } = useKitchenState();

  return (
    <PortalShell
      role={role}
      title="Inventory"
      description="Stock updates are automatic after receiving phase is confirmed."
    >
      <div className="space-y-3">
        {inventory.map((item) => {
          const isLow = item.onHand <= item.reorderLevel;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-2xl border p-4 ${
                isLow ? "border-[#f2c8b8] bg-[#fff2ec]" : "border-[#efd8c2] bg-[#fff7ec]"
              }`}
            >
              <div>
                <p className="text-base font-semibold">{item.name}</p>
                <p className="text-sm text-[#5a4b3a]">
                  {item.onHand} {item.unit} on hand | reorder at {item.reorderLevel} {item.unit}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#6f573b]">
                {isLow ? "Low" : "OK"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-[#e8d4b8] bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6f573b]">Receiving Log</h3>
        <div className="mt-3 space-y-2">
          {inventoryLog.length === 0 ? (
            <p className="text-sm text-[#5a4b3a]">No received stock yet. Confirm a receiving order in Tasks page.</p>
          ) : (
            inventoryLog.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-xl border border-[#efd8c2] bg-[#fff7ec] px-3 py-2 text-sm">
                <span className="font-semibold">+{entry.quantity} {entry.unit}</span> {entry.itemName} from {entry.source} by {entry.by} at {entry.at}
              </div>
            ))
          )}
        </div>
      </div>

      {role === "manager" ? (
        <div className="mt-6 rounded-2xl border border-[#e8d4b8] bg-white p-4 text-sm text-[#5a4b3a]">
          Need accountability detail? Open the
          <Link className="ml-1 font-semibold underline" href={withRole("/manager/issues", role)}>
            manager issues board
          </Link>
          .
        </div>
      ) : null}
    </PortalShell>
  );
}
