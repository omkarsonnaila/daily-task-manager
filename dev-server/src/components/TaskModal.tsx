import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createTask, updateTask, type Task } from "@/lib/tasks";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/tasks-context";
import type { Database } from "@/integrations/supabase/types";

type Priority = Database["public"]["Enums"]["task_priority"];
type Category = Database["public"]["Enums"]["task_category"];

export function TaskModal({
  open, onClose, editing, defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Task | null;
  defaultDate?: string;
}) {
  const { user } = useAuth();
  const { refresh } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [important, setImportant] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setDescription(editing?.description ?? "");
      setPriority(editing?.priority ?? "medium");
      setCategory(editing?.category ?? "personal");
      setDueDate(editing?.due_date ?? defaultDate ?? "");
      setDueTime(editing?.due_time?.slice(0, 5) ?? "");
      setImportant(editing?.is_important ?? false);
    }
  }, [open, editing, defaultDate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function save() {
    if (!user) return;
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        category,
        due_date: dueDate || null,
        due_time: dueTime || null,
        is_important: important,
      };
      if (editing) {
        await updateTask(editing.id, payload);
        toast.success("Task updated");
      } else {
        await createTask({ ...payload, user_id: user.id });
        toast.success("Task created");
      }
      await refresh();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-lift"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="font-display text-lg font-semibold">
                  {editing ? "Edit task" : "New task"}
                </h2>
                <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-6 py-5">
                <input
                  autoFocus
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-base font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  placeholder="Add a description (optional)"
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select label="Priority" value={priority} onChange={(v) => setPriority(v as Priority)}
                    options={[["high","High"],["medium","Medium"],["low","Low"]]} />
                  <Select label="Category" value={category} onChange={(v) => setCategory(v as Category)}
                    options={[["personal","Personal"],["study","Study"],["work","Work"],["health","Health"]]} />
                  <Input label="Due date" type="date" value={dueDate} onChange={setDueDate} />
                  <Input label="Due time" type="time" value={dueTime} onChange={setDueTime} />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={important}
                    onChange={(e) => setImportant(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  Mark as important
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-6 py-4">
                <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted">
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing ? "Save changes" : "Create task"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Input({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
