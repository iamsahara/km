import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { issues } from "@/lib/mock-data";
import { parseRole, withRole } from "@/lib/role";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function ManagerIssuesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = parseRole(params.role ?? null);

  if (role !== "manager") {
    return (
      <PortalShell
        role={role}
        title="Manager Issues"
        description="Accountability board is available to manager role only in this mock."
      >
        <div className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-5">
          <p className="text-base font-semibold">Access restricted</p>
          <p className="mt-2 text-sm text-[#5a4b3a]">
            Switch to manager role to review mistakes, missing orders, and compliance.
          </p>
          <Link
            href={withRole("/dashboard", "manager")}
            className="mt-4 inline-block rounded-xl bg-[#1f1b16] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#fef4e7]"
          >
            Switch to manager
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role={role}
      title="Manager Issues"
      description="Track missed orders, process mistakes, and accountability across shifts."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">{issue.id}</p>
            <p className="mt-2 text-base font-semibold">{issue.title}</p>
            <p className="mt-2 text-sm text-[#5a4b3a]">{issue.detail}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#6f573b]">{issue.owner}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#6f573b]">
                {issue.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
