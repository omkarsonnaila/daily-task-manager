import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay,
  isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";
import { useTasks } from "@/lib/tasks-context";
import { TaskList } from "@/components/TaskList";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: CalendarPage,
  head: () => ({ meta: [{ title: "Calendar — Plano" }] }),
});

function CalendarPage() {
  const { tasks } = useTasks();
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const tasksOnSelected = tasks.filter(
    (t) => t.due_date && isSameDay(parseISO(t.due_date), selected)
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader icon={CalIcon} title="Calendar" subtitle={format(month, "MMMM yyyy")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setMonth(subMonths(month, 1))} className="rounded-lg p-2 hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="font-display font-semibold">{format(month, "MMMM yyyy")}</h2>
            <button onClick={() => setMonth(addMonths(month, 1))} className="rounded-lg p-2 hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const dayTasks = tasks.filter((t) => t.due_date && isSameDay(parseISO(t.due_date), d));
              const isSel = isSameDay(d, selected);
              const inMonth = isSameMonth(d, month);
              return (
                <motion.button
                  key={d.toISOString()}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(d)}
                  className={`relative aspect-square rounded-lg border p-2 text-left text-sm transition-colors ${
                    isSel
                      ? "border-primary bg-primary-soft text-primary"
                      : inMonth ? "border-transparent hover:bg-muted" : "border-transparent text-muted-foreground/40"
                  }`}
                >
                  <span className={`${isSameDay(d, new Date()) ? "font-bold text-primary" : ""}`}>
                    {format(d, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {dayTasks.slice(0, 3).map((t) => (
                        <span key={t.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            t.priority === "high" ? "bg-destructive" :
                            t.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display font-semibold">{format(selected, "EEEE, MMMM d")}</h3>
          <TaskList
            tasks={tasksOnSelected}
            emptyTitle="No tasks this day"
            emptyDescription="Pick another day or add a task for this date."
          />
        </section>
      </div>
    </div>
  );
}
