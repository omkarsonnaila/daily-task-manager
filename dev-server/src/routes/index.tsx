import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2, Calendar, Sparkles, Zap, Target, BarChart3, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Plano — Smart Daily Planner & Task Manager" },
      { name: "description", content: "Plan your day, track tasks, and stay productive with Plano — a beautiful planner built for focus." },
    ],
  }),
});

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span>Plano</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#workflow" className="hover:text-foreground">Workflow</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Open app
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted sm:block">Sign in</Link>
                <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card hover:opacity-90">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Built for focused days
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            Plan your day.<br />
            <span className="text-gradient">Own your focus.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            A delightful task manager and daily planner. Capture tasks, schedule your time,
            and track your productivity streaks — all in one calm space.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to={user ? "/dashboard" : "/register"}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Start planning free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className="rounded-xl border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted">
              See features
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="rounded-2xl border bg-card p-3 shadow-lift">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Today", value: "8", sub: "Tasks scheduled", icon: Calendar, tint: "from-primary to-accent" },
                { label: "Completed", value: "62%", sub: "This week", icon: BarChart3, tint: "from-emerald-500 to-teal-400" },
                { label: "Streak", value: "12d", sub: "Keep it going", icon: Zap, tint: "from-amber-500 to-orange-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-4 rounded-xl border bg-background p-5">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="font-display text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold">Everything you need to ship your day</h2>
            <p className="mt-3 text-muted-foreground">Lightweight, fast, and beautifully designed.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Target, title: "Smart task lists", desc: "Filter by priority, category, due date — sorted exactly how you think." },
              { icon: Calendar, title: "Calendar & timeline", desc: "See your week at a glance and plot your day hour by hour." },
              { icon: BarChart3, title: "Productivity insights", desc: "Track completion trends and grow your daily streak." },
              { icon: Sparkles, title: "Beautiful by default", desc: "Calming light & dark themes designed for long focus sessions." },
              { icon: Zap, title: "Keyboard fast", desc: "Capture tasks instantly with shortcuts. Stay in flow." },
              { icon: CheckCircle2, title: "Made for you", desc: "Personal, study, work, health — categorize and conquer." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-gradient-to-br from-primary to-accent p-10 text-center text-white shadow-lift">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to take back your time?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Join Plano and turn chaotic to-do lists into a calm, focused daily plan.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-card hover:bg-white/90"
          >
            Get started — it's free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Plano. Crafted for focused makers.
      </footer>
    </div>
  );
}
