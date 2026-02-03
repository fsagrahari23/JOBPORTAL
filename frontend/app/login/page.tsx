import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const stats = [
  { label: "Live Jobs", value: "180K+" },
  { label: "Companies", value: "65K+" },
  { label: "Daily Applicants", value: "1.2M+" },
];

const highlights = [
  "Verified recruiters and fast responses",
  "Smart job matches based on your profile",
  "Track applications with real-time updates",
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f2e8ff,transparent_55%),radial-gradient(circle_at_85%_20%,#e7dcff,transparent_45%),linear-gradient(120deg,#f8f3ff,#fff)] text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-xl font-semibold text-white">
            N
          </div>
          <div>
            <p className="text-lg font-semibold">NaukriHub</p>
            <p className="text-xs text-slate-500">Jobs that fit your story</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <span className="cursor-pointer hover:text-purple-700">Jobs</span>
          <span className="cursor-pointer hover:text-purple-700">Companies</span>
          <span className="cursor-pointer hover:text-purple-700">Services</span>
          <span className="cursor-pointer hover:text-purple-700">Career Tools</span>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden text-slate-600 md:inline-flex">
            Create Account
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            Recruiter Login
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-purple-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-purple-600" />
            India&apos;s leading job network
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Discover purple-powered careers that match your ambition.
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Built like a modern Naukri-style portal, this experience keeps your
              profile at the center and makes hiring teams notice you faster.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-purple-100 bg-white/80 px-4 py-5 shadow-sm"
              >
                <p className="text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-sm">
            <p className="text-sm font-semibold text-purple-700">
              Why professionals choose us
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {highlights.map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-purple-200/70 blur-2xl" />
          <div className="absolute -bottom-8 right-2 h-32 w-32 rounded-full bg-purple-300/60 blur-3xl" />
          <div className="relative rounded-3xl border border-purple-100 bg-white/95 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700">
                  Create your profile
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Join NaukriHub
                </h2>
              </div>
              <div className="rounded-2xl bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">
                Secure
              </div>
            </div>

            <form className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full name</Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="What is your name?"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tell us your Email ID"
                  className="h-11"
                />
                <p className="text-xs text-slate-500">
                  We&apos;ll send relevant jobs and updates to this email.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="h-11"
                />
                <p className="text-xs text-slate-500">
                  This helps your account stay protected.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 Enter your mobile number"
                  className="h-11"
                />
                <p className="text-xs text-slate-500">
                  Recruiters will contact you on this number.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Work status</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50 px-4 py-4 text-left text-sm text-slate-700 shadow-sm transition hover:border-purple-400"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">
                        I&apos;m experienced
                      </span>
                      <span className="text-xs text-slate-500">
                        I have work experience (excluding internships)
                      </span>
                    </span>
                    <span className="text-lg">💼</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white px-4 py-4 text-left text-sm text-slate-700 shadow-sm transition hover:border-purple-400"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">
                        I&apos;m a fresher
                      </span>
                      <span className="text-xs text-slate-500">
                        I am a student / Haven&apos;t worked after graduation
                      </span>
                    </span>
                    <span className="text-lg">🎓</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Resume</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    className="h-10 rounded-full bg-purple-600 px-5 text-xs text-white hover:bg-purple-700"
                  >
                    Upload Resume
                  </Button>
                  <span className="text-xs text-slate-500">
                    DOC, DOCx, PDF, RTF | Max: 2 MB
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Recruiters prefer candidates who have a resume on their profile.
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs text-slate-500">
                <input type="checkbox" className="mt-1 h-4 w-4" />
                <span>
                  Send me important updates & promotions via SMS, email, and
                  WhatsApp
                </span>
              </label>

              <Button className="h-11 w-full bg-purple-600 text-white hover:bg-purple-700">
                Register now
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Continue with Google
              </Button>
            </form>

            <div className="mt-6 rounded-2xl bg-purple-50 px-4 py-3 text-xs text-purple-700">
              By clicking Register, you agree to the Terms &amp; Conditions and
              Privacy Policy of NaukriHub.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
