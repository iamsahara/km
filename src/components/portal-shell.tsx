"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

type ShellProps = {
  role: Role;
  title: string;
  description: string;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  managerOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reminders", label: "Reminders" },
  { href: "/messages", label: "Messages" },
  { href: "/manager/issues", label: "Manager Issues", managerOnly: true },
];

export function PortalShell({ role, title, description, children }: ShellProps) {
  const pathname = usePathname();
  const nextRole: Role = role === "manager" ? "staff" : "manager";

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-[#1f1b16]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(241,221,188,0.6),_transparent_55%),radial-gradient(circle_at_8%_20%,_rgba(203,227,215,0.7),_transparent_45%),radial-gradient(circle_at_80%_8%,_rgba(244,205,167,0.45),_transparent_55%)]" />
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pb-4 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">Kitchen Flow</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kitchryn Hub</h1>
          <p className="mt-2 max-w-xl text-sm text-[#5a4b3a]">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#6f573b]">
            {role}
          </span>
          <Link
            href={withRole(pathname, nextRole)}
            className="rounded-full border border-[#1f1b16] px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            Switch to {nextRole}
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#1f1b16] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#fef4e7]"
          >
            Sign Out
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-white/70 bg-white/80 p-3 lg:sticky lg:top-6">
          <nav className="grid gap-2">
            {navItems
              .filter((item) => !item.managerOnly || role === "manager")
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={withRole(item.href, role)}
                    className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[#1f1b16] text-[#fef4e7]"
                        : "bg-[#fff7ec] text-[#5a4b3a] hover:bg-[#f3e4d1]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </aside>

        <main className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(31,27,22,0.6)]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
