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

const serviceOrder: InventoryService[] = ["Breakfast", "Lunch", "Dinner", "Events"];

const categoryIcon: Record<InventoryCategory, string> = {
  Produce: "🥬",
  "Meat & Seafood": "🥩",
  "Dairy & Eggs": "🥛",
  "Pantry & Dry Goods": "🥫",
  Frozen: "❄️",
  Beverages: "☕",
  "Cleaning & Sanitation": "🧴",
  "Care Supplies": "❤️",
};

export function InventoryPageClient({ role }: Props) {
  const { inventory, inventoryLog, notifications, notifyLowStock } = useKitchenState();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | InventoryCategory>("All");
  const [selectedService, setSelectedService] = useState<"All" | InventoryService>("All");
  const [selectedLogMonth, setSelectedLogMonth] = useState<"All" | string>("All");
  const [selectedLogDate, setSelectedLogDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(1);

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
        item.section.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());

      return byCategory && byService && bySearch;
    });
  }, [inventory, selectedCategory, selectedService, query]);

  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const pagedInventory = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredInventory.slice(start, start + rowsPerPage);
  }, [filteredInventory, safePage, rowsPerPage]);

  const logMonths = useMemo(() => {
    const months = new Set(
      inventoryLog
        .map((entry) => entry.atDate?.slice(0, 7))
        .filter((value): value is string => Boolean(value))
    );
    return Array.from(months).sort((a, b) => (a > b ? -1 : 1));
  }, [inventoryLog]);

  const filteredLog = useMemo(() => {
    return inventoryLog.filter((entry) => {
      const byMonth = selectedLogMonth === "All" || entry.atDate?.startsWith(selectedLogMonth);
      const byDate = !selectedLogDate || entry.atDate === selectedLogDate;
      return byMonth && byDate;
    });
  }, [inventoryLog, selectedLogMonth, selectedLogDate]);

  return (
    <PortalShell
      role={role}
      title="Inventory"
      description="Organized inventory for retirement-home hotel operations, grouped by category and service period."
    >
      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Items" value={inventory.length} tone="neutral" />
        <InfoCard label="Categories" value={categories.length} tone="neutral" />
        <InfoCard label="Low" value={lowCount} tone="alert" />
        <InfoCard label="Inbox" value={notifications.length} tone="good" />
      </section>

      <section className="mt-4 rounded-2xl border border-[#ebd6bb] bg-[#fff8ee] p-4">
        <div className="grid gap-2 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search item, section, category"
            className="w-full rounded-lg border border-[#e7d4ba] bg-white px-3 py-2 text-sm focus:border-[#cfa977] focus:outline-none"
          />

          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-[#e7d4ba] bg-white px-3 py-2 text-sm text-[#5a4b3a] focus:border-[#cfa977] focus:outline-none"
          >
            <option value={12}>12 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>

          <p className="text-xs text-[#6b543a]">
            Showing {pagedInventory.length} / {filteredInventory.length}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip
            active={selectedCategory === "All"}
            onClick={() => {
              setSelectedCategory("All");
              setPage(1);
            }}
            label="All Categories"
          />
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
              label={`${categoryIcon[category]} ${category}`}
            />
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <ServiceChip
            active={selectedService === "All"}
            onClick={() => {
              setSelectedService("All");
              setPage(1);
            }}
            label="All Services"
          />
          {serviceOrder.map((service) => (
            <ServiceChip
              key={service}
              active={selectedService === service}
              onClick={() => {
                setSelectedService(service);
                setPage(1);
              }}
              label={service}
            />
          ))}
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#ebd6bb] bg-white">
        <div className="space-y-2 p-3 md:hidden">
          {pagedInventory.length === 0 ? (
            <div className="rounded-lg border border-[#efd8c2] bg-[#fff8ee] px-3 py-4 text-center text-sm text-[#6b543a]">
              No inventory items match your filters.
            </div>
          ) : (
            pagedInventory.map((item) => {
              const isLow = item.onHand <= item.reorderLevel;
              return (
                <article
                  key={item.id}
                  className={`rounded-xl border p-3 ${
                    isLow ? "border-[#efc2b8] bg-[#fff5f2]" : "border-[#f0dfc9] bg-[#fffaf4]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1f1b16]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#5a4b3a]">
                        {categoryIcon[item.category]} {item.category} · {item.section}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        isLow ? "bg-[#fff0ea] text-[#9a3e2a]" : "bg-[#edf7f1] text-[#2f5f47]"
                      }`}
                    >
                      {isLow ? "Low" : "OK"}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[#4f4335]">
                    <p>
                      On Hand:{" "}
                      <span className="font-semibold">
                        {item.onHand} {item.unit}
                      </span>
                    </p>
                    <p>
                      Reorder:{" "}
                      <span className="font-semibold">
                        {item.reorderLevel} {item.unit}
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.services.slice(0, 3).map((service) => (
                      <span
                        key={`${item.id}-${service}`}
                        className="rounded-full bg-[#f4eadb] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7a5c3b]"
                      >
                        {service}
                      </span>
                    ))}
                    {item.services.length > 3 ? (
                      <span className="rounded-full bg-[#efefef] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
                        +{item.services.length - 3}
                      </span>
                    ) : null}
                  </div>

                  {isLow ? (
                    <button
                      onClick={() => notifyLowStock(item.id)}
                      className="mt-2 w-full rounded-lg border border-[#c94b38] bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9a3e2a]"
                    >
                      Alert
                    </button>
                  ) : null}
                </article>
              );
            })
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left xl:min-w-[980px]">
              <thead className="bg-[#f8ecd9] text-[#6b543a]">
                <tr className="text-xs uppercase tracking-[0.14em]">
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2">Services</th>
                  <th className="px-3 py-2">On Hand</th>
                  <th className="px-3 py-2">Reorder</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedInventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-sm text-[#6b543a]">
                      No inventory items match your filters.
                    </td>
                  </tr>
                ) : (
                  pagedInventory.map((item) => {
                    const isLow = item.onHand <= item.reorderLevel;
                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-[#f0dfc9] text-sm ${
                          isLow ? "bg-[#fff7f3]" : "bg-white"
                        }`}
                      >
                        <td className="px-3 py-2.5 font-semibold text-[#1f1b16]">{item.name}</td>
                        <td className="px-3 py-2.5 text-[#4f4335]">
                          <span className="inline-flex items-center gap-1.5">
                            <span>{categoryIcon[item.category]}</span>
                            <span>{item.category}</span>
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[#4f4335]">{item.section}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {item.services.slice(0, 3).map((service) => (
                              <span
                                key={`${item.id}-${service}`}
                                className="rounded-full bg-[#f4eadb] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7a5c3b]"
                              >
                                {service}
                              </span>
                            ))}
                            {item.services.length > 3 ? (
                              <span className="rounded-full bg-[#efefef] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
                                +{item.services.length - 3}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[#4f4335]">
                          {item.onHand} {item.unit}
                        </td>
                        <td className="px-3 py-2.5 text-[#4f4335]">
                          {item.reorderLevel} {item.unit}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                              isLow
                                ? "bg-[#fff0ea] text-[#9a3e2a]"
                                : "bg-[#edf7f1] text-[#2f5f47]"
                            }`}
                          >
                            {isLow ? "Low" : "OK"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {isLow ? (
                            <button
                              onClick={() => notifyLowStock(item.id)}
                              className="rounded-full border border-[#c94b38] bg-[#fff5f2] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9a3e2a]"
                            >
                              Alert
                            </button>
                          ) : (
                            <span className="text-xs text-[#7a6349]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0dfc9] bg-[#fff8ee] px-3 py-2">
          <p className="text-xs text-[#6b543a]">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-md border border-[#d7c1a1] bg-white px-3 py-1.5 text-xs font-semibold text-[#5a4b3a] disabled:opacity-40"
              disabled={safePage <= 1}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-md border border-[#d7c1a1] bg-white px-3 py-1.5 text-xs font-semibold text-[#5a4b3a] disabled:opacity-40"
              disabled={safePage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[#ebd6bb] bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f573b]">Receiving Log</h3>
        <div className="mt-2 grid gap-2 md:grid-cols-[180px_1fr]">
          <select
            value={selectedLogMonth}
            onChange={(event) => setSelectedLogMonth(event.target.value)}
            className="rounded-lg border border-[#e7d4ba] bg-[#fff8ee] px-3 py-2 text-sm text-[#5a4b3a] focus:border-[#cfa977] focus:outline-none"
          >
            <option value="All">All months</option>
            {logMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedLogDate}
            onChange={(event) => setSelectedLogDate(event.target.value)}
            className="rounded-lg border border-[#e7d4ba] bg-[#fff8ee] px-3 py-2 text-sm text-[#5a4b3a] focus:border-[#cfa977] focus:outline-none"
          />
        </div>

        <div className="mt-3 space-y-1.5">
          {filteredLog.length === 0 ? (
            <p className="text-sm text-[#5a4b3a]">No received stock for selected date range.</p>
          ) : (
            filteredLog.slice(0, 12).map((entry) => (
              <div key={entry.id} className="rounded-lg border border-[#efd8c2] bg-[#fff7ec] px-3 py-2 text-xs">
                <span className="font-semibold">
                  +{entry.quantity} {entry.unit}
                </span>{" "}
                {entry.itemName} from {entry.source} by {entry.by} on {formatDate(entry.atDate)} at {entry.atTime}
              </div>
            ))
          )}
        </div>
      </section>

      {role === "manager" ? (
        <div className="mt-4 rounded-2xl border border-[#e8d4b8] bg-white p-4 text-sm text-[#5a4b3a]">
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

function FilterChip({
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
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
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
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
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
    <div className={`rounded-xl border px-3 py-2.5 ${style}`}>
      <p className="text-[10px] uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-1.5 text-xl font-semibold leading-none">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}
