import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useTasks } from "@/lib/tasks-context";
import { TaskList } from "@/components/TaskList";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/important")({
  component: ImportantPage,
  head: () => ({ meta: [{ title: "Important — Plano" }] }),
});

function ImportantPage() {
  const { tasks } = useTasks();
  const items = tasks.filter((t) => t.is_important);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader icon={Star} title="Important" subtitle="Your starred tasks" count={items.length} />
      <TaskList tasks={items} emptyTitle="No important tasks" emptyDescription="Star your most important work to find it instantly." />
    </div>
  );
}
