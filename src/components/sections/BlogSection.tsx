import { Link } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { ErrorMessage } from "../ui/ErrorMessage";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSection() {
  const { posts, loading, error } = usePosts();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-4">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-8 text-2xl font-bold text-primary dark:text-dark-primary">Blog</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <h3 className="text-xl font-semibold text-primary dark:text-dark-primary">{post.title}</h3>
                {post.published_at && (
                  <p className="mt-1 text-sm text-muted dark:text-dark-muted">{formatDate(post.published_at)}</p>
                )}
                {post.excerpt && <p className="mt-2 text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
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
    </section>
  );
}
