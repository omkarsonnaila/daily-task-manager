import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Sun, CalendarClock, Star, CheckSquare,
  Calendar, Settings, LogOut, CheckCircle2, ChevronLeft, X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/tasks-context";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

export function Sidebar({
  collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const { signOut } = useAuth();
  const { tasks } = useTasks();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const today = new Date().toISOString().slice(0, 10);
  const counts = {
    today: tasks.filter((t) => t.due_date === today && t.status === "pending").length,
    upcoming: tasks.filter((t) => t.due_date && t.due_date > today && t.status === "pending").length,
    important: tasks.filter((t) => t.is_important && t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const items: Item[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/today", label: "Today", icon: Sun, badge: counts.today },
    { to: "/upcoming", label: "Upcoming", icon: CalendarClock, badge: counts.upcoming },
    { to: "/important", label: "Important", icon: Star, badge: counts.important },
    { to: "/completed", label: "Completed", icon: CheckSquare, badge: counts.completed },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const content = (mobile: boolean) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-4 py-5">
        <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          {!collapsed && <span className="text-lg">Plano</span>}
        </Link>
        {mobile ? (
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted md:block"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 hidden h-screen shrink-0 border-r md:block"
      >
        {content(false)}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r md:hidden"
            >
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
