import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { Experience } from "../../lib/types";
import { Spinner } from "../../components/ui/Spinner";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";

const EMPTY_EXPERIENCE: Omit<Experience, "id" | "created_at" | "updated_at"> = {
  company: "",
  role: "",
  start_date: "",
  end_date: null,
  description: "",
  tags: [],
  display_order: 0,
};

export function EditExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewIdx, setPreviewIdx] = useState(false);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) setMessage({ type: "error", text: error.message });
    else setItems(data ?? []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchItems(); }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    const payload = {
      company: editing.company,
      role: editing.role,
      start_date: editing.start_date,
      end_date: editing.end_date || null,
      description: editing.description,
      tags: editing.tags,
      display_order: editing.display_order,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("experience").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("experience").insert(payload));
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
    if (!confirm("Delete this experience entry?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else await fetchItems();
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Experience</h1>
        <button
          onClick={() => setEditing({ ...EMPTY_EXPERIENCE, display_order: items.length })}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <input
                value={editing.role ?? ""}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
              <input
                value={editing.company ?? ""}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={editing.start_date ?? ""}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End Date (blank = current)</label>
              <input
                type="date"
                value={editing.end_date ?? ""}
                onChange={(e) => setEditing({ ...editing, end_date: e.target.value || null })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
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
              <button type="button" onClick={() => setPreviewIdx(!previewIdx)} className="text-xs text-accent hover:text-accent-light">
                {previewIdx ? "Edit" : "Preview"}
              </button>
            </div>
            {previewIdx ? (
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
          {items.length === 0 && <p className="text-muted">No experience entries yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div>
                <p className="font-medium">{item.role} @ {item.company}</p>
                <p className="text-sm text-muted">Order: {item.display_order}</p>
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
