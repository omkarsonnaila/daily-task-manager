import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { ConfirmDialog } from "./ConfirmDialog";
import { TaskModal } from "./TaskModal";
import { useTasks } from "@/lib/tasks-context";
import type { Task } from "@/lib/tasks";

export function TaskList({
  tasks, emptyTitle, emptyDescription,
}: { tasks: Task[]; emptyTitle: string; emptyDescription: string }) {
  const { toggle, remove, star } = useTasks();
  const [confirm, setConfirm] = useState<Task | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggle}
              onStar={star}
              onEdit={(t) => setEditing(t)}
              onDelete={(t) => setConfirm(t)}
            />
          ))}
        </AnimatePresence>
      </div>
      <ConfirmDialog
        open={!!confirm}
        title="Delete this task?"
        message="This action cannot be undone."
        onCancel={() => setConfirm(null)}
        onConfirm={() => { if (confirm) { remove(confirm); setConfirm(null); } }}
      />
      <TaskModal open={!!editing} editing={editing} onClose={() => setEditing(null)} />
    </>
  );
}
