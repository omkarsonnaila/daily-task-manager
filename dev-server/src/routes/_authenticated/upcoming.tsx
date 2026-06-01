import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { useTasks } from "@/lib/tasks-context";
import { TaskCard } from "@/components/TaskCard";
import { TaskList } from "@/components/TaskList";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { TaskModal } from "@/components/TaskModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Task } from "@/lib/tasks";

export const Route = createFileRoute("/_authenticated/upcoming")({
  component: UpcomingPage,
  head: () => ({ meta: [{ title: "Upcoming — Plano" }] }),
});

function UpcomingPage() {
  const { tasks, toggle, remove, star } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = tasks.filter((t) => t.due_date && t.due_date > today && t.status === "pending");

  const grouped = useMemo(() => {
    const m = new Map<string, Task[]>();
    upcoming.forEach((t) => {
      const k = t.due_date!;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(t);
    });
    return Array.from(m.entries()).sort(([a],[b]) => a.localeCompare(b));
  }, [upcoming]);

  const [editing, setEditing] = useState<Task | null>(null);
  const [confirm, setConfirm] = useState<Task | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader icon={CalendarClock} title="Upcoming" subtitle="Plan ahead" count={upcoming.length} />
      {grouped.length === 0 ? (
        <TaskList tasks={[]} emptyTitle="No upcoming tasks" emptyDescription="Future you will thank you for planning ahead." />
      ) : grouped.map(([date, items]) => (
        <section key={date} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {format(parseISO(date), "EEEE, MMMM d")}
          </h3>
          {items.map((t) => (
            <TaskCard key={t.id} task={t}
              onToggle={toggle} onStar={star}
              onEdit={(t) => setEditing(t)} onDelete={(t) => setConfirm(t)} />
          ))}
        </section>
      ))}
      <TaskModal open={!!editing} editing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!confirm}
        title="Delete this task?" message="This action cannot be undone."
        onCancel={() => setConfirm(null)}
        onConfirm={() => { if (confirm) { remove(confirm); setConfirm(null); } }}
      />
    </div>
  );
}
