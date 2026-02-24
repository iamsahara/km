"use client";

import Link from "next/link";
import type { Role } from "@/lib/mock-data";
import { withRole } from "@/lib/role";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/pending-orders", label: "Pending Orders" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reminders", label: "Reminders" },
  { href: "/messages", label: "Messages" },
  { href: "/tasks", label: "Tasks" },
  { href: "/manager/issues", label: "Manager Issues" },
];

export function PortalShell({
  role,
  title,
  description,
  children,
}: {
  role: Role;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="role-switch">
          <span>Role:</span>
          <Link href={withRole("/dashboard", "manager")}>manager</Link>
          <Link href={withRole("/dashboard", "staff")}>staff</Link>
        </div>
      </header>

      <nav className="nav">
        {navItems.map((item) => (
          <Link key={item.href} href={withRole(item.href, role)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="content">{children}</main>
    </div>
  );
}
