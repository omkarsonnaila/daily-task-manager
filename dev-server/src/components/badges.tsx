import type { Database } from "@/integrations/supabase/types";

type Priority = Database["public"]["Enums"]["task_priority"];
type Category = Database["public"]["Enums"]["task_category"];

const PRIORITY: Record<Priority, { label: string; cls: string; border: string }> = {
  high:   { label: "High",   cls: "bg-destructive/10 text-destructive",         border: "border-l-destructive" },
  medium: { label: "Medium", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400", border: "border-l-amber-500" },
  low:    { label: "Low",    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
};

const CATEGORY: Record<Category, { label: string; cls: string }> = {
  personal: { label: "Personal", cls: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  study:    { label: "Study",    cls: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
  work:     { label: "Work",     cls: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" },
  health:   { label: "Health",   cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
};

export function PriorityBadge({ value }: { value: Priority }) {
  const p = PRIORITY[value];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.cls}`}>{p.label}</span>;
}

export function CategoryBadge({ value }: { value: Category }) {
  const c = CATEGORY[value];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.cls}`}>{c.label}</span>;
}

export function priorityBorder(p: Priority) {
  return PRIORITY[p].border;
}
