import { useParams, Link } from "react-router-dom";
import { usePost } from "../../hooks/usePosts";
import { useSEO } from "../../hooks/useSEO";
import { Badge } from "../../components/ui/Badge";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug ?? "");

  useSEO({
    title: post?.title,
    description: post?.excerpt,
    ogTitle: post?.title,
    ogDescription: post?.excerpt,
    ogImage: post?.cover_image_url ?? undefined,
  });

  if (loading) return <Spinner />;
  if (error) return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ErrorMessage message={error} />
    </div>
  );
  if (!post) return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-muted dark:text-dark-muted">Post not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-accent hover:text-accent-light">
        &larr; Back to blog
      </Link>
    </div>
  );

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/blog" className="mb-6 inline-block text-sm text-muted hover:text-primary dark:text-dark-muted dark:hover:text-dark-primary">
        &larr; Back to blog
      </Link>
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="mb-8 h-64 w-full rounded-xl object-cover"
        />
      )}
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">{post.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {post.published_at && (
          <span className="text-sm text-muted dark:text-dark-muted">{formatDate(post.published_at)}</span>
        )}
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-8">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}
