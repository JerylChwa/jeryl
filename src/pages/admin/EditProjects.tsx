import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { Project } from "../../lib/types";
import { Spinner } from "../../components/ui/Spinner";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";

const EMPTY_PROJECT: Omit<Project, "id" | "created_at" | "updated_at"> = {
  title: "",
  description: "",
  url: null,
  image_url: null,
  tags: [],
  display_order: 0,
  status: "draft",
};

export function EditProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) setMessage({ type: "error", text: error.message });
    else setItems(data ?? []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchItems(); }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `projects/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      setMessage({ type: "error", text: error.message });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    setEditing((prev) => (prev ? { ...prev, image_url: data.publicUrl } : prev));
    setUploading(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    const payload = {
      title: editing.title,
      description: editing.description,
      url: editing.url || null,
      image_url: editing.image_url || null,
      tags: editing.tags,
      display_order: editing.display_order,
      status: editing.status,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Saved!" });
      setEditing(null);
      await fetchItems();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else await fetchItems();
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Projects</h1>
        <button
          onClick={() => setEditing({ ...EMPTY_PROJECT, display_order: items.length })}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light"
        >
          + Add
        </button>
      </div>

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

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-gray-100 bg-surface p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
            <input
              value={editing.url ?? ""}
              onChange={(e) => setEditing({ ...editing, url: e.target.value || null })}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
            <div className="flex items-center gap-3">
              <input
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value || null })}
                placeholder="Image URL or upload below"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm text-muted hover:bg-gray-50">
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>
            {editing.image_url && (
              <img src={editing.image_url} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
              <input
                type="number"
                value={editing.display_order ?? 0}
                onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editing.status ?? "draft"}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as "draft" | "published" })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              value={(editing.tags ?? []).join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Description (Markdown)</label>
              <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-xs text-accent hover:text-accent-light">
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-[120px] rounded-lg border border-gray-200 bg-white p-4">
                <MarkdownRenderer content={editing.description ?? ""} />
              </div>
            ) : (
              <textarea
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm text-muted hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-muted">No projects yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.status === "published" ? "Published" : "Draft"} · Order: {item.display_order}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(item)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
