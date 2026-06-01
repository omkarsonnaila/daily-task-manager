import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, Search, Plus, User } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";

export function Header({
  onOpenMobile, onOpenSearch, onNewTask,
}: {
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onNewTask: () => void;
}) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const username = (user?.user_metadata?.username as string) ?? user?.email?.split("@")[0] ?? "there";

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="sticky top-0 z-20 glass border-b">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-col md:flex">
          <span className="font-display text-base font-semibold leading-tight">
            {greeting}, {username} 👋
          </span>
          <span className="text-xs text-muted-foreground">{time} · Let's make today count</span>
        </div>

        <div className="flex-1" />

        <button
          onClick={onOpenSearch}
          className="hidden items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-muted md:inline-flex"
        >
          <Search className="h-4 w-4" />
          Search tasks…
          <kbd className="ml-2 hidden rounded border bg-background px-1.5 py-0.5 text-xs lg:inline">⌘K</kbd>
        </button>
        <button onClick={onOpenSearch} className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>

        <button
          onClick={onNewTask}
          className="hidden items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90 sm:inline-flex"
        >
          <Plus className="h-4 w-4" /> New task
        </button>

        <button onClick={toggle} className="rounded-lg p-2 hover:bg-muted" aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
