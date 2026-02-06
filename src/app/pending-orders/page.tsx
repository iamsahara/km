import { PendingOrdersPageClient } from "@/components/pending-orders-page-client";
import { parseRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function PendingOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  return <PendingOrdersPageClient role={role} />;
}
