import { useSEO } from "../../hooks/useSEO";
import { IntroSection } from "../../components/sections/IntroSection";
import { ExperienceSection } from "../../components/sections/ExperienceSection";
import { ProjectsSection } from "../../components/sections/ProjectsSection";

export function HomePage() {
  useSEO({
    title: "Home",
    description: "Jeryl's personal website — intro, experience, and projects.",
  });

  return (
    <>
      <IntroSection />
      <ExperienceSection />
      <ProjectsSection />
    </>
  );
}
