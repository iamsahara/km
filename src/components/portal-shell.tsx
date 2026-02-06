"use client";

import Link from "next/link";
import { Children, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useKitchenState } from "@/components/kitchen-state-provider";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type ShellProps = {
  role: Role;
  title: string;
  description: string;
  children?: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  short: string;
  managerOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/orders", label: "Orders", short: "OR" },
  { href: "/pending-orders", label: "Pending Orders", short: "PO" },
  { href: "/inventory", label: "Inventory", short: "IN" },
  { href: "/reminders", label: "Reminders", short: "RM" },
  { href: "/messages", label: "Chat", short: "CH" },
];

export function PortalShell({ role, title, description, children }: ShellProps) {
  const pathname = usePathname();
  const { activeTasks, supplyOrders } = useKitchenState();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isDashboard = pathname === "/dashboard";
  const hasMainContent = !(isDashboard && Children.count(children) === 0);
  const openCount = activeTasks.length;
  const pendingCount = supplyOrders.filter((order) => order.phase !== "received").length;
  const visibleNavItems = navItems.filter((item) => !item.managerOnly || role === "manager");

  const currentPageLabel = useMemo(() => {
    if (pathname === "/dashboard") return "Home";
    const current = visibleNavItems.find((item) => item.href === pathname);
    return current?.label ?? "Page";
  }, [pathname, visibleNavItems]);

  const theme =
    role === "manager"
      ? {
          canvas: "bg-[#f6f1ea]",
          gradient:
            "bg-[radial-gradient(circle_at_4%_6%,_rgba(244,206,159,0.5),_transparent_35%),radial-gradient(circle_at_94%_8%,_rgba(220,191,156,0.45),_transparent_38%),radial-gradient(circle_at_20%_95%,_rgba(188,226,206,0.36),_transparent_45%)]",
          badge: "bg-[#f4e7d5] text-[#724f28]",
          marker: "bg-[#e8b56c]",
          pageAccent: "bg-[#f3e4d1]",
          navActive: "bg-[#1f1b16] text-[#fef4e7]",
          navIdle: "bg-[#fff7ec] text-[#5a4b3a] hover:bg-[#f3e4d1]",
        }
      : {
          canvas: "bg-[#eaf4f1]",
          gradient:
            "bg-[radial-gradient(circle_at_5%_4%,_rgba(156,209,191,0.45),_transparent_35%),radial-gradient(circle_at_94%_8%,_rgba(168,213,233,0.42),_transparent_38%),radial-gradient(circle_at_20%_95%,_rgba(202,237,225,0.55),_transparent_45%)]",
          badge: "bg-[#d7ece5] text-[#2f5f47]",
          marker: "bg-[#5c9c84]",
          pageAccent: "bg-[#d7ece5]",
          navActive: "bg-[#184536] text-[#eaf8f4]",
          navIdle: "bg-[#f2fbf8] text-[#355b4d] hover:bg-[#def1ea]",
        };

  return (
    <div className={`relative min-h-screen overflow-x-hidden text-[#1f1b16] ${theme.canvas}`}>
      <div className={`absolute inset-0 -z-10 ${theme.gradient}`} />
      <div className="absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-white/35 blur-3xl" />
      <div className="absolute right-0 top-28 -z-10 h-72 w-72 rounded-full bg-white/25 blur-3xl" />

      <header className="mx-auto w-full max-w-6xl px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-8">
        <div className="km-panel km-animate-in rounded-2xl p-4 sm:rounded-3xl sm:p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileNavOpen(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f1b16] bg-white text-[#1f1b16] lg:hidden"
                  aria-label="Open menu"
                >
                  <span className="text-lg font-bold leading-none">≡</span>
                </button>
                <span className={`h-2.5 w-2.5 rounded-full ${theme.marker}`} />
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a49] sm:tracking-[0.28em]">
                  Kitchen Flow
                </p>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Kitchryn Hub</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#5a4b3a]">{description}</p>
              <p className="mt-2 inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f573b] sm:tracking-[0.2em]">
                Current Page: {currentPageLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <HeaderStat label="Open" value={openCount} tone="open" />
                <HeaderStat label="Pending" value={pendingCount} tone="pending" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${theme.badge}`}>
                {role}
              </span>
              <Link
                href="/login"
                className="rounded-full bg-[#1f1b16] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#fef4e7] transition hover:-translate-y-0.5"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`mx-auto grid w-full max-w-6xl gap-4 px-4 pb-12 sm:gap-6 sm:px-6 sm:pb-16 ${
          hasMainContent ? "lg:grid-cols-[250px_1fr]" : "lg:grid-cols-[250px]"
        }`}
      >
        <aside className="hidden km-panel km-animate-in h-fit rounded-3xl p-3 lg:sticky lg:top-6 lg:block">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a49]">
            Navigation
          </p>
          <nav className="grid gap-2">
            {visibleNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={withRole(item.href, role)}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                    active ? theme.navActive : theme.navIdle
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold tracking-widest ${
                      active ? "bg-white/18" : "bg-white"
                    }`}
                  >
                    {item.short}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {hasMainContent ? (
          <main className="km-panel km-animate-in rounded-2xl p-4 sm:rounded-3xl sm:p-5 lg:p-6">
            <div className={`mb-6 rounded-2xl px-4 py-3 ${theme.pageAccent}`}>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
              {!isDashboard ? <p className="mt-1 text-sm text-[#6b543a]">{description}</p> : null}
            </div>
            {children}
          </main>
        ) : null}
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 bg-[#f6f1ea] px-4 py-5 sm:px-6 sm:py-6 lg:hidden">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6a49]">Navigation</p>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="rounded-lg border border-[#1f1b16] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#1f1b16]"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-3">
              {visibleNavItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={withRole(item.href, role)}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-semibold ${
                      active
                        ? "border-[#1f1b16] bg-[#1f1b16] text-[#fef4e7]"
                        : "border-[#e3cfb0] bg-white text-[#4f4335]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-lg leading-none">›</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto">
              <Link
                href="/login"
                onClick={() => setIsMobileNavOpen(false)}
                className="block w-full rounded-xl bg-[#1f1b16] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#fef4e7]"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HeaderStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "open" | "pending";
}) {
  const style =
    tone === "open"
      ? "border-[#b8d8c3] bg-gradient-to-br from-[#f0fff5] to-[#e2f6ea] text-[#1f5a39]"
      : "border-[#efc9ae] bg-gradient-to-br from-[#fff6ed] to-[#ffe9d8] text-[#8a4d2f]";

  return (
    <div className={`rounded-lg border px-3 py-1.5 shadow-sm ${style}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">{label}</p>
      <p className="text-base font-semibold leading-none">{value}</p>
    </div>
  );
}
