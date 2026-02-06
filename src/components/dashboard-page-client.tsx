"use client";

import { PortalShell } from "@/components/portal-shell";
import type { Role } from "@/lib/mock-data";

type Props = {
  role: Role;
};

export function DashboardPageClient({ role }: Props) {
  return (
    <PortalShell
      role={role}
      title="Dashboard"
      description="Interactive inventory and task control for hotel kitchens."
    />
  );
}
