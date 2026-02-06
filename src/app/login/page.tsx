import Link from "next/link";
import { withRole } from "@/lib/role";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f1e9] text-[#1f1b16]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_8%,_rgba(244,206,159,0.52),_transparent_32%),radial-gradient(circle_at_94%_8%,_rgba(196,225,211,0.55),_transparent_40%),radial-gradient(circle_at_50%_95%,_rgba(245,218,184,0.55),_transparent_38%)]" />
      <div className="absolute -left-24 top-10 -z-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute right-0 top-20 -z-10 h-72 w-72 rounded-full bg-white/25 blur-3xl" />

      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12">
        <section className="km-panel km-animate-in w-full rounded-[1.6rem] p-5 sm:rounded-[2rem] sm:p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a49] sm:tracking-[0.3em]">Mock Login</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Kitchryn Hub</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#5a4b3a]">
                Kitchen control made simple for every shift. Choose your role to open the right dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f4e7d5] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#724f28]">
                  Responsive Web
                </span>
                <span className="rounded-full bg-[#dbeee7] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2f5f47]">
                  In-App Alerts
                </span>
                <span className="rounded-full bg-[#f9ecdb] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#724f28]">
                  Order + Receiving
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <RoleCard
                href={withRole("/dashboard", "manager")}
                title="Manager"
                user="Layla"
                hint="Full dashboard, accountability, and issue tracking"
                accent="warm"
              />
              <RoleCard
                href={withRole("/dashboard", "staff")}
                title="Staff"
                user="Nina"
                hint="Tasks, receiving, reminders, and team communication"
                accent="cool"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function RoleCard({
  href,
  title,
  user,
  hint,
  accent,
}: {
  href: string;
  title: string;
  user: string;
  hint: string;
  accent: "warm" | "cool";
}) {
  const style =
    accent === "warm"
      ? "border-[#ebd6bb] bg-[#fff7ec] hover:bg-[#f8ecd9]"
      : "border-[#cfe2da] bg-[#eff8f4] hover:bg-[#e2f1eb]";

  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${style}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a49] sm:tracking-[0.28em]">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{user}</p>
      <p className="mt-2 text-sm text-[#5a4b3a]">{hint}</p>
    </Link>
  );
}
