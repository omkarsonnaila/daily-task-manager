import { motion } from "framer-motion";
import { Calendar, Clock, Pencil, Star, Trash2 } from "lucide-react";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { CategoryBadge, PriorityBadge, priorityBorder } from "./badges";
import type { Task } from "@/lib/tasks";

export function TaskCard({
  task, onToggle, onEdit, onDelete, onStar,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onStar: (t: Task) => void;
}) {
  const completed = task.status === "completed";
  const overdue =
    !completed && task.due_date && isBefore(parseISO(task.due_date), startOfToday());

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`group relative flex items-start gap-3 rounded-xl border border-l-4 bg-card p-4 shadow-card transition-shadow hover:shadow-lift ${priorityBorder(task.priority)} ${completed ? "opacity-60" : ""}`}
    >
      <button
        onClick={() => onToggle(task)}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all ${
          completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {completed && (
          <motion.svg
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium leading-snug ${completed ? "line-through" : ""}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <IconBtn onClick={() => onStar(task)} title="Star">
              <Star className={`h-4 w-4 ${task.is_important ? "fill-amber-400 text-amber-400" : ""}`} />
            </IconBtn>
            <IconBtn onClick={() => onEdit(task)} title="Edit">
              <Pencil className="h-4 w-4" />
            </IconBtn>
            <IconBtn onClick={() => onDelete(task)} title="Delete" danger>
              <Trash2 className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <PriorityBadge value={task.priority} />
          <CategoryBadge value={task.category} />
          {task.due_date && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${overdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
              <Calendar className="h-3 w-3" />
              {format(parseISO(task.due_date), "MMM d")}
              {overdue && " · overdue"}
            </span>
          )}
          {task.due_time && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.due_time.slice(0, 5)}
            </span>
          )}
          {task.is_important && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-600 dark:text-amber-400">
              <Star className="h-3 w-3 fill-current" /> Important
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function IconBtn({
  children, onClick, title, danger,
}: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-md p-1.5 transition-colors ${danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
