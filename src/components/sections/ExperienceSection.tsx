import { useExperience } from "../../hooks/useExperience";
import { Badge } from "../ui/Badge";
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
import { Spinner } from "../ui/Spinner";
import { ErrorMessage } from "../ui/ErrorMessage";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection() {
  const { experience, loading, error } = useExperience();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-4">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-8 text-2xl font-bold text-primary dark:text-dark-primary">Experience</h2>
        <div className="space-y-10">
          {experience.map((exp) => (
            <div key={exp.id} className="relative border-l-2 border-accent/20 pl-6">
              <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent" />
              <div className="flex items-center gap-3">
                {exp.logo_url && (
                  <img
                    src={exp.logo_url}
                    alt={exp.company}
                    className="h-9 w-9 shrink-0 rounded-lg border border-gray-100 bg-white object-contain p-1 shadow-sm dark:border-dark-border dark:bg-dark-surface"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{exp.role}</h3>
                  <span className="text-sm text-muted dark:text-dark-muted">{exp.company}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted dark:text-dark-muted">
                {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : "Present"}
              </p>
              <div className="mt-3">
                <MarkdownRenderer content={exp.description} />
              </div>
              {exp.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
