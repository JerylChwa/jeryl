import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Post } from "../../lib/types";
import { Spinner } from "../../components/ui/Spinner";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY_POST: Omit<Post, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_image_url: null,
  tags: [],
  status: "draft",
  published_at: null,
};

export function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [post, setPost] = useState<Partial<Post>>(EMPTY_POST);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSlug, setAutoSlug] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setMessage({ type: "error", text: error.message });
        else if (data) setPost(data);
        setLoading(false);
      });
  }, [id, isNew]);

  function handleTitleChange(title: string) {
    const updates: Partial<Post> = { ...post, title };
    if (autoSlug) updates.slug = slugify(title);
    setPost(updates);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image_url: post.cover_image_url || null,
      tags: post.tags,
      status: post.status,
      published_at: post.published_at,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("posts").insert(payload));
    } else {
      ({ error } = await supabase.from("posts").update(payload).eq("id", id));
    }

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Saved!" });
      if (isNew) navigate("/admin/posts", { replace: true });
    }
    setSaving(false);
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">{isNew ? "New Post" : "Edit Post"}</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          {showPreview ? "Editor" : "Preview"}
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

      {showPreview ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8">
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt="" className="mb-6 h-48 w-full rounded-lg object-cover" />
          )}
          <h1 className="mb-4 text-3xl font-bold">{post.title || "Untitled"}</h1>
          <MarkdownRenderer content={post.content ?? ""} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              value={post.title ?? ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug
              {autoSlug && <span className="ml-2 text-xs text-muted">(auto-generated)</span>}
            </label>
            <input
              value={post.slug ?? ""}
              onChange={(e) => {
                setAutoSlug(false);
                setPost({ ...post, slug: e.target.value });
              }}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea
              value={post.excerpt ?? ""}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cover Image URL</label>
            <input
              value={post.cover_image_url ?? ""}
              onChange={(e) => setPost({ ...post, cover_image_url: e.target.value || null })}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={post.status ?? "draft"}
                onChange={(e) => {
                  const status = e.target.value as "draft" | "published";
                  const updates: Partial<Post> = { ...post, status };
                  if (status === "published" && !post.published_at) {
                    updates.published_at = new Date().toISOString();
                  }
                  setPost(updates);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input
                value={(post.tags ?? []).join(", ")}
                onChange={(e) =>
                  setPost({
                    ...post,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Content (Markdown)</label>
            <textarea
              value={post.content ?? ""}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows={20}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
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
              onClick={() => navigate("/admin/posts")}
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm text-muted hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
