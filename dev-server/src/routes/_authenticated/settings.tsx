import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Moon, Sun, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Plano" }] }),
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { signOut, user } = useAuth();
  const [confirm, setConfirm] = useState(false);

  async function deleteAccount() {
    if (!user) return;
    // Delete profile triggers cascade
    const { error } = await supabase.from("profiles").delete().eq("id", user.id);
    if (error) toast.error(error.message);
    else { toast.success("Account data deleted"); await signOut(); }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Customize your experience" />

      <section className="rounded-2xl border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold">Appearance</h3>
        <p className="mb-4 text-sm text-muted-foreground">Switch between light and dark themes.</p>
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between rounded-lg border bg-background px-4 py-3 hover:bg-muted"
        >
          <span className="text-sm font-medium">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold">Account</h3>
        <p className="mb-4 text-sm text-muted-foreground">{user?.email}</p>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>

      <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
        <h3 className="font-display font-semibold text-destructive">Danger zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Permanently delete your account data. This cannot be undone.
        </p>
        <button
          onClick={() => setConfirm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"
        >
          <Trash2 className="h-4 w-4" /> Delete account data
        </button>
      </section>

      <ConfirmDialog
        open={confirm}
        title="Delete account data?"
        message="All your tasks and profile information will be permanently removed."
        confirmLabel="Delete everything"
        onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); deleteAccount(); }}
      />
    </div>
  );
}
