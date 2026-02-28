import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Post } from "../../lib/types";
import { Spinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";

export function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setPosts(data ?? []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPosts(); }, []);

  async function toggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    const payload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published" && !post.published_at) {
      payload.published_at = new Date().toISOString();
    }
    const { error } = await supabase.from("posts").update(payload).eq("id", post.id);
    if (error) setMessage({ type: "error", text: error.message });
    else await fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else await fetchPosts();
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light"
        >
          + New Post
        </Link>
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

      {posts.length === 0 && <p className="text-muted">No posts yet.</p>}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{post.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge>{post.status}</Badge>
                {post.published_at && (
                  <span className="text-xs text-muted">
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-4 flex gap-2">
              <button
                onClick={() => toggleStatus(post)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <Link
                to={`/admin/posts/${post.id}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
