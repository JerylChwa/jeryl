import { useProjects } from "../../hooks/useProjects";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
import { Spinner } from "../ui/Spinner";
import { ErrorMessage } from "../ui/ErrorMessage";

export function ProjectsSection() {
  const { projects, loading, error } = useProjects();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-4">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-10 text-2xl font-bold text-primary dark:text-dark-primary">Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
              )}
              <h3 className="text-lg font-semibold dark:text-dark-primary">{project.title}</h3>
              <div className="mt-2">
                <MarkdownRenderer content={project.description} />
              </div>
              {project.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-light"
                >
                  View Project &rarr;
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
