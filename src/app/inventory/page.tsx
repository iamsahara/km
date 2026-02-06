import { InventoryPageClient } from "@/components/inventory-page-client";
import { parseRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  return <InventoryPageClient role={role} />;
}
