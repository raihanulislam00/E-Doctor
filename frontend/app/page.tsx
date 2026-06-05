export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="pulse-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl font-semibold">
            E
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">E-Doctor</p>
            <h1 className="text-2xl font-semibold">Care Onboarding Portal</h1>
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-medium">
          <a
            href="/doctor"
            className="rounded-full border border-black/10 bg-white px-5 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Doctor Portal
          </a>
          <a
            href="/admin"
            className="rounded-full bg-[color:var(--primary)] px-5 py-2 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Admin Console
          </a>
        </nav>
      </header>

      <main className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-card float-up rounded-[28px] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Onboard with clarity</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            A calm, verified path from registration to patient care.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-[color:var(--muted)]">
            Doctors submit credentials in one place, admins verify in minutes, and the system keeps every step auditable.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/doctor"
              className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start Doctor Registration
            </a>
            <a
              href="/admin"
              className="rounded-full border border-black/10 bg-white px-6 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Review Registrations
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Secure", text: "JWT-backed sessions and hashed credentials." },
              { title: "Structured", text: "Clear status flow from pending to approved." },
              { title: "Friendly", text: "Guided forms and actionable admin views." },
            ].map((item) => (
              <div key={item.title} className="soft-border rounded-2xl bg-white/70 p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid gap-6">
          <div className="glass-card float-up rounded-[26px] p-6">
            <h3 className="text-2xl font-semibold">Doctor Steps</h3>
            <ol className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <li>1. Complete profile and upload documents.</li>
              <li>2. Wait for admin verification.</li>
              <li>3. Login and manage your profile.</li>
            </ol>
          </div>
          <div className="glass-card float-up rounded-[26px] p-6">
            <h3 className="text-2xl font-semibold">Admin Steps</h3>
            <ol className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <li>1. Create main admin account.</li>
              <li>2. Login and create admin IDs.</li>
              <li>3. Review pending doctors and verify.</li>
            </ol>
          </div>
          <div className="rounded-[26px] bg-[color:var(--primary)] p-6 text-white shadow-xl">
            <h3 className="text-2xl font-semibold">Need a quick demo?</h3>
            <p className="mt-3 text-sm text-white/80">
              Use the portals to register a doctor, approve them, then login. Everything updates instantly.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
