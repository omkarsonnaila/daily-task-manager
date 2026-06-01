import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTasks } from "@/lib/tasks-context";
import { PriorityBadge } from "./badges";

export function SearchModal({
  open, onClose, onSelect,
}: { open: boolean; onClose: () => void; onSelect: (id: string) => void }) {
  const { tasks } = useTasks();
  const [q, setQ] = useState("");

  useEffect(() => { if (open) setQ(""); }, [open]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = q.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(q.toLowerCase())
      ).slice(0, 12)
    : tasks.slice(0, 8);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border bg-card shadow-lift"
            >
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search your tasks…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
                {results.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-muted-foreground">No tasks found</div>
                ) : results.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { onSelect(t.id); onClose(); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-sm font-medium ${t.status === "completed" ? "line-through opacity-60" : ""}`}>
                        {t.title}
                      </div>
                      {t.description && <div className="truncate text-xs text-muted-foreground">{t.description}</div>}
                    </div>
                    <PriorityBadge value={t.priority} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
