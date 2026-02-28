import { Link } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { useSEO } from "../../hooks/useSEO";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogListPage() {
  useSEO({ title: "Blog", description: "Blog posts by Jeryl." });
  const { posts, loading, error } = usePosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-primary">Blog</h1>
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && posts.length === 0 && (
        <p className="text-muted">No posts yet.</p>
      )}
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="block">
            <Card className="transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-primary">{post.title}</h2>
              {post.published_at && (
                <p className="mt-1 text-sm text-muted">{formatDate(post.published_at)}</p>
              )}
              {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
