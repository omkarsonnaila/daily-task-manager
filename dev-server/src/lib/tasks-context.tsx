import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth-context";
import { fetchTasks, updateTask, deleteTask, type Task } from "./tasks";
import toast from "react-hot-toast";

type Ctx = {
  tasks: Task[];
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (t: Task) => Promise<void>;
  remove: (t: Task) => Promise<void>;
  star: (t: Task) => Promise<void>;
};

const TasksContext = createContext<Ctx | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchTasks(user.id);
      setTasks(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refresh();
    else setTasks([]);
  }, [user, refresh]);

  const toggle = async (t: Task) => {
    const nextStatus = t.status === "completed" ? "pending" : "completed";
    setTasks((cur) => cur.map((x) => x.id === t.id ? { ...x, status: nextStatus } : x));
    try {
      await updateTask(t.id, { status: nextStatus });
      if (nextStatus === "completed") toast.success("Nice work! 🎉");
    } catch (e) {
      setTasks((cur) => cur.map((x) => x.id === t.id ? { ...x, status: t.status } : x));
      toast.error("Couldn't update task");
    }
  };

  const star = async (t: Task) => {
    const next = !t.is_important;
    setTasks((cur) => cur.map((x) => x.id === t.id ? { ...x, is_important: next } : x));
    try { await updateTask(t.id, { is_important: next }); }
    catch { setTasks((cur) => cur.map((x) => x.id === t.id ? { ...x, is_important: t.is_important } : x)); }
  };

  const remove = async (t: Task) => {
    const prev = tasks;
    setTasks((cur) => cur.filter((x) => x.id !== t.id));
    try {
      await deleteTask(t.id);
      toast.success("Task deleted");
    } catch {
      setTasks(prev);
      toast.error("Couldn't delete task");
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, refresh, toggle, remove, star }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be inside TasksProvider");
  return ctx;
}
