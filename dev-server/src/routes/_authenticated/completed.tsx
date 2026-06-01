import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { useTasks } from "@/lib/tasks-context";
import { TaskList } from "@/components/TaskList";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/completed")({
  component: CompletedPage,
  head: () => ({ meta: [{ title: "Completed — Plano" }] }),
});

function CompletedPage() {
  const { tasks } = useTasks();
  const items = tasks.filter((t) => t.status === "completed");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader icon={CheckSquare} title="Completed" subtitle="Tasks you've finished" count={items.length} />
      <TaskList tasks={items} emptyTitle="No completed tasks yet" emptyDescription="Done tasks will appear here. Keep going!" />
    </div>
  );
}
