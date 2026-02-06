import Link from "next/link";
import { withRole } from "@/lib/role";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f1ea] text-[#1f1b16]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(241,221,188,0.6),_transparent_55%),radial-gradient(circle_at_15%_30%,_rgba(203,227,215,0.7),_transparent_45%),radial-gradient(circle_at_85%_10%,_rgba(244,205,167,0.45),_transparent_55%)]" />
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-12">
        <section className="w-full rounded-3xl border border-white/80 bg-white/85 p-8 shadow-[0_24px_60px_-40px_rgba(31,27,22,0.6)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">Mock Login</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Kitchryn Hub</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5a4b3a]">
            Responsive kitchen management for hotel operations. Choose a role to continue.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href={withRole("/dashboard", "manager")}
              className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">Manager</p>
              <p className="mt-2 text-xl font-semibold">Layla</p>
              <p className="mt-2 text-sm text-[#5a4b3a]">Full dashboard, issues, and accountability views.</p>
            </Link>
            <Link
              href={withRole("/dashboard", "staff")}
              className="rounded-2xl border border-[#e8d4b8] bg-[#fff7ec] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a49]">Staff</p>
              <p className="mt-2 text-xl font-semibold">Nina</p>
              <p className="mt-2 text-sm text-[#5a4b3a]">Tasks, reminders, inventory, and team messaging.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
