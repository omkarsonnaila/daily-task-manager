import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, ListTodo, Inbox } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { format, startOfWeek, addDays, parseISO, isSameDay, subDays } from "date-fns";
import { useTasks } from "@/lib/tasks-context";
import { dailyQuote } from "@/lib/quotes";
import { TaskList } from "@/components/TaskList";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Plano" }] }),
});

function Dashboard() {
  const { tasks, loading } = useTasks();
  const quote = useMemo(() => dailyQuote(), []);
  const today = new Date().toISOString().slice(0, 10);

  const todayTasks = tasks.filter((t) => t.due_date === today);
  const completedToday = todayTasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const upcoming = tasks
    .filter((t) => t.due_date && t.due_date > today && t.status === "pending")
    .slice(0, 5);

  const streak = useMemo(() => computeStreak(tasks), [tasks]);
  const weekData = useMemo(() => buildWeekData(tasks), [tasks]);

  const stats = [
    { label: "Today", value: todayTasks.length, icon: ListTodo, tint: "from-indigo-500 to-violet-500" },
    { label: "Completed", value: completedToday, icon: CheckCircle2, tint: "from-emerald-500 to-teal-400" },
    { label: "Pending", value: pending, icon: Clock, tint: "from-amber-500 to-orange-400" },
    { label: "Streak", value: `${streak}d`, icon: Flame, tint: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-accent p-6 text-white shadow-card md:p-8"
      >
        <div className="text-sm text-white/80">{format(new Date(), "EEEE, MMMM d")}</div>
        <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">
          Let's make today productive ✨
        </h1>
        <p className="mt-3 max-w-2xl text-white/90">
          "{quote.q}" <span className="text-white/70">— {quote.a}</span>
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card"
          >
            <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="font-display text-2xl font-bold">{s.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Today's tasks</h2>
              <span className="text-xs text-muted-foreground">{todayTasks.length} total</span>
            </div>
            {loading ? <Skeletons /> : (
              <TaskList
                tasks={todayTasks}
                emptyTitle="Nothing for today"
                emptyDescription="A clear list is a calm mind. Add a task to plan your day."
              />
            )}
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-display text-lg font-semibold">This week</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barCategoryGap={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12, fontSize: 12,
                    }}
                  />
                  <Bar dataKey="completed" fill="var(--color-primary)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-display text-lg font-semibold">Upcoming</h2>
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center text-sm text-muted-foreground">
                <Inbox className="mb-2 h-8 w-8 opacity-50" />
                Nothing scheduled
              </div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((t) => (
                  <li key={t.id} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.due_date && format(parseISO(t.due_date), "EEE, MMM d")}
                        {t.due_time && ` · ${t.due_time.slice(0,5)}`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-2">
      {[0,1,2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function buildWeekData(tasks: { status: string; updated_at: string }[]) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i);
    const count = tasks.filter((t) => t.status === "completed" && isSameDay(parseISO(t.updated_at), day)).length;
    return { day: format(day, "EEE"), completed: count };
  });
}

function computeStreak(tasks: { status: string; updated_at: string }[]) {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const day = subDays(new Date(), i);
    const has = tasks.some((t) => t.status === "completed" && isSameDay(parseISO(t.updated_at), day));
    if (has) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}
