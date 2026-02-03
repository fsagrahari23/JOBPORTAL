const stats = [
  { label: "Total Users", value: "24,580", trend: "+12% MoM" },
  { label: "Live Jobs", value: "3,420", trend: "+8% MoM" },
  { label: "New Applications", value: "860", trend: "+4% WoW" },
  { label: "Pending Reviews", value: "56", trend: "-10% WoW" },
];

const recentJobs = [
  { title: "UI/UX Designer", company: "Horizon Tech", status: "Approved" },
  { title: "Data Analyst", company: "Nova Labs", status: "In Review" },
  { title: "Frontend Engineer", company: "Prismy", status: "Approved" },
  { title: "Product Manager", company: "IndigoWorks", status: "Flagged" },
];

const quickActions = [
  "Approve job postings",
  "Review new recruiters",
  "Resolve reported listings",
  "Publish announcements",
];

const activity = [
  "New recruiter signup: Horizon Tech",
  "Job approved: UI/UX Designer - Remote",
  "Payment received: Premium listing",
  "Report flagged: Duplicate posting",
  "Account verified: Aarav Singh",
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ede9fe,transparent_55%),linear-gradient(180deg,#ffffff,#f3f4ff)] text-slate-900">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-slate-500">NaukriHub</p>
            </div>
          </div>
          <nav className="mt-6 space-y-2 text-sm text-slate-600">
            <div className="rounded-xl bg-purple-50 px-3 py-2 font-medium text-purple-700">
              Dashboard
            </div>
            <div className="rounded-xl px-3 py-2 hover:bg-slate-50">Users</div>
            <div className="rounded-xl px-3 py-2 hover:bg-slate-50">Jobs</div>
            <div className="rounded-xl px-3 py-2 hover:bg-slate-50">
              Applications
            </div>
            <div className="rounded-xl px-3 py-2 hover:bg-slate-50">
              Reports
            </div>
            <div className="rounded-xl px-3 py-2 hover:bg-slate-50">
              Settings
            </div>
          </nav>
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/70 p-4 text-xs text-slate-600">
            Security status
            <p className="mt-2 text-sm font-semibold text-slate-900">
              All systems normal
            </p>
            <p className="mt-1 text-xs text-slate-500">Last audit: 2 days ago</p>
          </div>
        </aside>

        <main className="space-y-6">
          <header className="flex flex-col gap-4 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700">
                Admin Overview
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Dashboard
              </h1>
            </div>
            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                placeholder="Search users, jobs, applications..."
                className="h-8 w-full border-0 bg-transparent text-sm text-slate-600 outline-none"
              />
              <button className="h-8 rounded-lg bg-purple-600 px-3 text-xs font-semibold text-white transition hover:bg-purple-700">
                Search
              </button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
              >
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-purple-600">{item.trend}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Live Monitoring
                </h2>
                <span className="text-xs text-purple-700">Today</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
                  <p className="text-xs text-slate-500">Applications per hour</p>
                  <div className="mt-3 h-24 rounded-xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400" />
                </div>
                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
                  <p className="text-xs text-slate-500">Job approval queue</p>
                  <div className="mt-3 flex items-end gap-2">
                    {[40, 55, 35, 60, 48, 70].map((value) => (
                      <div
                        key={value}
                        className="w-6 rounded-lg bg-purple-500/70"
                        style={{ height: `${value}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-purple-100 bg-white p-4">
                <p className="text-xs text-slate-500">System health</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>API uptime</span>
                  <span className="font-semibold text-slate-900">99.9%</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Queue latency</span>
                  <span className="font-semibold text-slate-900">120ms</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Quick Actions
              </h2>
              <div className="mt-4 space-y-3">
                {quickActions.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <span>{item}</span>
                    <button className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-white">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Recently Posted Jobs
                </h2>
                <button className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50">
                  View all
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500">{job.company}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : job.status === "Flagged"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Latest Activity
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {activity.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
