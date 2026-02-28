import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { Profile } from "../../lib/types";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";
import { Spinner } from "../../components/ui/Spinner";

export function EditIntro() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setMessage({ type: "error", text: error.message });
        }
        setProfile(
          data ?? {
            id: "",
            name: "",
            tagline: "",
            bio: "",
            avatar_url: null,
            updated_at: new Date().toISOString(),
          }
        );
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    const payload = {
      name: profile.name,
      tagline: profile.tagline,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (profile.id) {
      ({ error } = await supabase.from("profile").update(payload).eq("id", profile.id));
    } else {
      ({ error } = await supabase.from("profile").insert(payload));
    }

    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Saved!" });
    setSaving(false);
  }

  if (loading) return <Spinner />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-primary">Edit Intro</h1>
      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-2 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
          <input
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Avatar URL</label>
          <input
            value={profile.avatar_url ?? ""}
            onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value || null })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Bio (Markdown)</label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-accent hover:text-accent-light"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>
          {showPreview ? (
            <div className="min-h-[200px] rounded-lg border border-gray-200 p-4">
              <MarkdownRenderer content={profile.bio} />
            </div>
          ) : (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={10}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
