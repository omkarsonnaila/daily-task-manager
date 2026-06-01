import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function PageHeader({
  icon: Icon, title, subtitle, count,
}: { icon: LucideIcon; title: string; subtitle?: string; count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {typeof count === "number" && (
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
          {count}
        </span>
      )}
    </motion.div>
  );
}
