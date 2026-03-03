import { useSEO } from "../../hooks/useSEO";
import { IntroSection } from "../../components/sections/IntroSection";
import { ExperienceSection } from "../../components/sections/ExperienceSection";
import { ProjectsSection } from "../../components/sections/ProjectsSection";
import { BlogSection } from "../../components/sections/BlogSection";

export function HomePage() {
  useSEO({
    title: "Home",
    description: "Jeryl's personal website — intro, experience, projects, and blog.",
  });

  return (
    <>
      <IntroSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogSection />
    </>
  );
}
