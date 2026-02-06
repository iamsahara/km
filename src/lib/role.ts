import type { Role } from "@/lib/mock-data";

export function parseRole(value: string | null): Role {
  return value === "manager" ? "manager" : "staff";
}

export function withRole(path: string, role: Role): string {
  return `${path}?role=${role}`;
}
