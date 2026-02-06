import { MessagesPageClient } from "@/components/messages-page-client";
import { parseRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  return <MessagesPageClient role={role} />;
}
