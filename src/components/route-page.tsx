"use client";

import { useSearchParams } from "next/navigation";
import { parseRole } from "@/lib/role";
import { PortalShell } from "@/components/portal-shell";

export function RoutePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const searchParams = useSearchParams();
  const role = parseRole(searchParams.get("role"));

  return (
    <PortalShell role={role} title={title} description={description}>
      <p>This is the {title.toLowerCase()} area.</p>
    </PortalShell>
  );
}
