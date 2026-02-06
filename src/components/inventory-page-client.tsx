"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useKitchenState,
  type InventoryCategory,
  type InventoryService,
} from "@/components/kitchen-state-provider";
import { PortalShell } from "@/components/portal-shell";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type Props = {
  role: Role;
};

const categoryOrder: InventoryCategory[] = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Pantry & Dry Goods",
  "Frozen",
  "Beverages",
  "Cleaning & Sanitation",
  "Care Supplies",
];

const serviceOrder: InventoryService[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Events",
];

export function InventoryPageClient({ role }: Props) {
  const { inventory, inventoryLog, notifications, notifyLowStock } = useKitchenState();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | InventoryCategory>("All");
  const [selectedService, setSelectedService] = useState<"All" | InventoryService>("All");

  const lowCount = inventory.filter((item) => item.onHand <= item.reorderLevel).length;

  const categories = useMemo(() => {
    const seen = new Set(inventory.map((item) => item.category));
    return categoryOrder.filter((category) => seen.has(category));
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const byCategory = selectedCategory === "All" || item.category === selectedCategory;
      const byService = selectedService === "All" || item.services.includes(selectedService);
      const bySearch =
        !query.trim() ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.section.toLowerCase().includes(query.toLowerCase());
      return byCategory && byService && bySearch;
    });
  }, [inventory, selectedCategory, selectedService, query]);

  const groupedInventory = useMemo(() => {
    const map = new Map<InventoryCategory, typeof filteredInventory>();

    for (const item of filteredInventory) {
      const group = map.get(item.category) || [];
      group.push(item);
      map.set(item.category, group);
    }

    return categoryOrder
      .map((category) => ({
        category,
        items: map.get(category) || [],
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredInventory]);

  return (
    <PortalShell
      role={role}
      title="Inventory"
      description="Organized inventory for retirement-home hotel operations, grouped by category and section."
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Total Items" value={inventory.length} tone="neutral" />
        <InfoCard label="Categories" value={categories.length} tone="neutral" />
        <InfoCard label="Low Stock" value={lowCount} tone="alert" />
        <InfoCard label="Inbox Alerts" value={notifications.length} tone="good" />
      </section>

      <section className="mt-6 rounded-3xl border border-[#ebd6bb] bg-[#fff8ee] p-5">
        <h3 className="text-lg font-semibold">Inventory Browser</h3>
        <p className="mt-1 text-sm text-[#5a4b3a]">
          Search and filter by category and service period.
        </p>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search item name or section"
            className="w-full rounded-xl border border-[#e7d4ba] bg-white px-3 py-2.5 text-sm focus:border-[#cfa977] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
              label="All"
            />
            {categories.map((category) => (
              <CategoryChip
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                label={category}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <ServiceChip
            active={selectedService === "All"}
            onClick={() => setSelectedService("All")}
            label="All Services"
          />
          {serviceOrder.map((service) => (
            <ServiceChip
              key={service}
              active={selectedService === service}
              onClick={() => setSelectedService(service)}
              label={service}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {groupedInventory.length === 0 ? (
          <div className="rounded-2xl border border-[#ebd6bb] bg-white p-4 text-sm text-[#6b543a]">
            No inventory items match your filter.
          </div>
        ) : (
          groupedInventory.map((group) => {
            const groupLow = group.items.filter((item) => item.onHand <= item.reorderLevel).length;
            return (
              <div key={group.category} className="rounded-2xl border border-[#ebd6bb] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-semibold text-[#1f1b16]">{group.category}</h4>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[#fff7ec] px-3 py-1 text-[#6b543a]">
                      {group.items.length} items
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 ${
                        groupLow > 0
                          ? "bg-[#fff2ea] text-[#8a4d2f]"
                          : "bg-[#edf7f1] text-[#2f5f47]"
                      }`}
                    >
                      {groupLow} low
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {group.items.map((item) => {
                    const isLow = item.onHand <= item.reorderLevel;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-3 ${
                          isLow ? "border-[#f1cbb6] bg-[#fff5f0]" : "border-[#efd8c2] bg-[#fffdfa]"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1f1b16]">{item.name}</p>
                          <p className="text-xs text-[#6b543a]">Section: {item.section}</p>
                          <p className="mt-1 flex flex-wrap gap-1">
                            {item.services.map((service) => (
                              <span
                                key={`${item.id}-${service}`}
                                className="rounded-full bg-[#f4eadb] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7a5c3b]"
                              >
                                {service}
                              </span>
                            ))}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[#4f4335]">
                            {item.onHand} {item.unit}
                            <span className="ml-1 text-xs text-[#7a6349]">(reorder {item.reorderLevel})</span>
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                              isLow
                                ? "bg-[#fff0ea] text-[#9a3e2a]"
                                : "bg-[#edf7f1] text-[#2f5f47]"
                            }`}
                          >
                            {isLow ? "Low" : "OK"}
                          </span>
                          {isLow ? (
                            <button
                              onClick={() => notifyLowStock(item.id)}
                              className="rounded-full border border-[#c94b38] bg-[#fff5f2] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#9a3e2a]"
                            >
                              Alert Inbox
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-[#ebd6bb] bg-white p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#6f573b]">Receiving Log</h3>
        <div className="mt-3 space-y-2">
          {inventoryLog.length === 0 ? (
            <p className="text-sm text-[#5a4b3a]">No received stock yet. Confirm a receiving order in Tasks.</p>
          ) : (
            inventoryLog.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-xl border border-[#efd8c2] bg-[#fff7ec] px-3 py-2 text-sm">
                <span className="font-semibold">
                  +{entry.quantity} {entry.unit}
                </span>{" "}
                {entry.itemName} from {entry.source} by {entry.by} at {entry.at}
              </div>
            ))
          )}
        </div>
      </section>

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

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        active
          ? "border-[#1f1b16] bg-[#1f1b16] text-[#fef4e7]"
          : "border-[#e7d4ba] bg-white text-[#6b543a]"
      }`}
    >
      {label}
    </button>
  );
}

function ServiceChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        active
          ? "border-[#184536] bg-[#184536] text-[#eaf8f4]"
          : "border-[#cfe2da] bg-[#f2fbf8] text-[#355b4d]"
      }`}
    >
      {label}
    </button>
  );
}

function InfoCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "alert" | "good";
}) {
  const style =
    tone === "alert"
      ? "border-[#f1cbb6] bg-[#fff2ea] text-[#8a4d2f]"
      : tone === "good"
      ? "border-[#cee4d7] bg-[#edf7f1] text-[#2f5f47]"
      : "border-[#e8d4b8] bg-white text-[#1f1b16]";

  return (
    <div className={`rounded-2xl border p-4 ${style}`}>
      <p className="text-xs uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 text-3xl font-semibold leading-none">{value}</p>
    </div>
  );
}
