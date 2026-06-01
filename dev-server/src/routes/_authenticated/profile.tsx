import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User as UserIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — Plano" }] }),
});

function ProfilePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase.from("profiles").select("username").eq("id", user.id).single().then(({ data }) => {
      if (data?.username) setUsername(data.username);
      setLoading(false);
    });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader icon={UserIcon} title="Profile" subtitle="Manage your details" />

      <section className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft font-display text-xl font-bold text-primary">
            {(username || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-display text-lg font-semibold">{username || "Your name"}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Username</span>
          <input
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </button>
      </section>
    </div>
  );
}
