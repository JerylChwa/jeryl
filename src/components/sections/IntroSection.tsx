import { useProfile } from "../../hooks/useProfile";
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
import { Spinner } from "../ui/Spinner";
import { ErrorMessage } from "../ui/ErrorMessage";

export function IntroSection() {
  const { profile, loading, error } = useProfile();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return (
    <section id="intro" className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center text-muted dark:text-dark-muted">
        <p>No intro yet. Add one from the <a href="/admin/intro" className="text-accent underline">admin dashboard</a>.</p>
      </div>
    </section>
  );

  return (
    <section id="intro" className="pt-12 pb-4">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover shadow-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">{profile.name}</h1>
            <p className="mt-1 text-lg text-muted dark:text-dark-muted">{profile.tagline}</p>
          </div>
        </div>
        <div className="mt-6">
          <MarkdownRenderer content={profile.bio} />
        </div>
      </div>
    </section>
  );
}
