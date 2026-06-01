import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Sun } from "lucide-react";
import { useTasks } from "@/lib/tasks-context";
import { TaskList } from "@/components/TaskList";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/today")({
  component: TodayPage,
  head: () => ({ meta: [{ title: "Today — Plano" }] }),
});

function TodayPage() {
  const { tasks } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const filtered = tasks.filter((t) => t.due_date === today);
  const pending = filtered.filter((t) => t.status === "pending");
  const completed = filtered.filter((t) => t.status === "completed");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        icon={Sun}
        title="Today"
        subtitle={format(new Date(), "EEEE, MMMM d")}
        count={filtered.length}
      />
      <TaskList
        tasks={pending}
        emptyTitle="You're all caught up ☀️"
        emptyDescription="No pending tasks for today. Add one or enjoy the calm."
      />
      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Completed ({completed.length})
          </h3>
          <TaskList tasks={completed} emptyTitle="" emptyDescription="" />
        </div>
      )}
    </div>
  );
}
