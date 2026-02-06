import { RemindersPageClient } from "@/components/reminders-page-client";
import { parseRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function RemindersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  return <RemindersPageClient role={role} />;
}
