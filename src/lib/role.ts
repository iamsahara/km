import type { Role } from "@/lib/mock-data";

export function parseRole(value: string | null): Role {
  return value === "manager" ? "manager" : "staff";
}

export function withRole(path: string, role: Role): string {
  const [pathname, queryString = ""] = path.split("?");
  const params = new URLSearchParams(queryString);
  params.set("role", role);

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
