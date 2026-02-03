import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  {
    label: "Prepare",
    menu: [
      "Pathfinder",
      "NCAT",
      "Expert speak",
      "Resume maker",
      "Personalised interview Q/A",
      "Career guidance",
      "Interview Experiences",
      "Speech assessment",
    ],
  },
  {
    label: "Participate",
    menu: [
      "Contests",
      "All India NCAT",
      "Naukri Campus Young Turks",
      "Naukri Campus Squad",
      "Engineers' Ring of Honour",
    ],
  },
  {
    label: "Opportunities",
    menu: [
      "Recommended jobs",
      "Job invites",
      "Jobs from alerts",
      "Application status",
      "Saved jobs",
    ],
  },
  {
    label: "Career Tools",
    menu: ["Resume builder", "Salary insights", "Skill tests", "Job tracker"],
  },
];

const statCards = [
  { label: "Profile strength", value: "72%" },
  { label: "Active applications", value: "14" },
  { label: "Recruiter views", value: "39" },
];

const contests = [
  {
    title: "Coding Ninjas - Admission Counsellor Hiring Contest",
    tag: "Hiring contest",
    meta: "Individual · Round 1 · 28 Feb",
  },
  {
    title: "Naukri Campus CareerVerse Virtual Career Fair",
    tag: "Career fair",
    meta: "Individual · 11-15 Mar",
  },
];

const interviewCards = [
  {
    title: "SDE - 1",
    subtitle: "Interviewed by Amazon",
    meta: "0-2 years · 4 Rounds",
  },
  {
    title: "SDE - 2",
    subtitle: "Interviewed by TCS",
    meta: "1-3 years · 5 Rounds",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f2e8ff,transparent_55%),linear-gradient(180deg,#fff,#f7f2ff)] text-slate-900">
      <header className="border-b border-purple-100/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-600 text-sm font-semibold text-white">
              N
            </div>
            <span className="text-sm font-semibold">NaukriHub Campus</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            {quickLinks.map((item) => (
              <div key={item.label} className="group relative">
                <span className="cursor-pointer pb-2 text-sm font-medium text-slate-600 transition hover:text-purple-700">
                  {item.label}
                </span>
                <div className="absolute left-0 top-full z-20 h-4 w-40" />
                <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 min-w-[240px] translate-y-2 rounded-2xl border border-purple-100 bg-white p-4 text-xs text-slate-600 opacity-0 shadow-xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto">
                  <div className="space-y-3">
                    {item.menu.map((entry) => (
                      <div
                        key={entry}
                        className="cursor-pointer rounded-lg px-2 py-1 text-slate-600 transition hover:bg-purple-50 hover:text-purple-700"
                      >
                        {entry}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <div className="hidden w-72 md:block">
            <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <Input
                placeholder="Search jobs here"
                className="h-6 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-100 bg-white text-xs font-semibold text-purple-700">
              AC
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                AC
              </div>
              <div>
                <p className="text-sm font-semibold">Aryan Choudhary</p>
                <p className="text-xs text-slate-500">
                  B.Tech · IIITM Gwalior
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
                <div className="h-full w-[72%] rounded-full bg-purple-500" />
              </div>
              <p className="mt-2 text-xs text-slate-500">Profile strength 72%</p>
            </div>
            <Button className="mt-4 h-9 w-full bg-purple-600 text-xs text-white hover:bg-purple-700">
              Complete profile
            </Button>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-purple-700">
              Quick insights
            </p>
            <div className="mt-3 space-y-3">
              {statCards.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-purple-50 px-4 py-3 text-xs"
                >
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-purple-700">
                India&apos;s largest virtual career fair
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                CareerVerse 2026 is live for students
              </h2>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-purple-50 px-3 py-1">
                  25k+ early career jobs
                </span>
                <span className="rounded-full bg-purple-50 px-3 py-1">
                  200+ industry mentors
                </span>
                <span className="rounded-full bg-purple-50 px-3 py-1">
                  5L worth rewards
                </span>
              </div>
              <Button className="mt-4 h-9 bg-purple-600 text-xs text-white hover:bg-purple-700">
                Tell me more
              </Button>
            </div>
            <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-purple-700">
                Track all activities
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Keep a track of everything in one place
              </h3>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Monitor progress and profile strength
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Get personalized insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Manage job alerts in minutes
                </li>
              </ul>
              <Button className="mt-4 h-9 bg-purple-600 text-xs text-white hover:bg-purple-700">
                Check your activity
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-700">
                  Pathfinder
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Discover the career path that&apos;s right for you
                </h3>
              </div>
              <span className="text-xs text-purple-700">Explore more</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {["All", "B.Tech", "B.Com", "B.Sc", "B.A", "BCA"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-purple-100 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                "Data Analyst",
                "Software Development Engineer",
              ].map((role) => (
                <div
                  key={role}
                  className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4"
                >
                  <p className="text-sm font-semibold">{role}</p>
                  <p className="text-xs text-slate-500">
                    Avg salary · ₹4 LPA
                  </p>
                  <Button className="mt-3 h-8 bg-purple-600 text-xs text-white hover:bg-purple-700">
                    Learn about this role
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Popular contests among students
                </h3>
                <span className="text-xs text-purple-700">View all</span>
              </div>
              <div className="mt-4 space-y-3">
                {contests.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-purple-100 p-4"
                  >
                    <p className="text-xs text-purple-700">{item.tag}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{item.meta}</p>
                    <Button className="mt-3 h-8 bg-purple-600 text-xs text-white hover:bg-purple-700">
                      Participate
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ace your tech interviews
                </h3>
                <span className="text-xs text-purple-700">View all</span>
              </div>
              <div className="mt-4 grid gap-3">
                {interviewCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-purple-100 bg-white p-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-700">
                  Resume builder
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Your resume is ready. Choose a template & download for free.
                </h3>
              </div>
              <Button className="h-8 bg-purple-600 text-xs text-white hover:bg-purple-700">
                Build resume
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Classic", "Modern", "Creative"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 text-xs text-slate-500"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {item} template
                  </p>
                  <p className="mt-2">
                    Clean typography, easy scanning, hiring friendly.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
