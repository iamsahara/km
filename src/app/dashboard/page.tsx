import { DashboardPageClient } from "@/components/dashboard-page-client";
import { parseRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  return <DashboardPageClient role={role} />;
}
