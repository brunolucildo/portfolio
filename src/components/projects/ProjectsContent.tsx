import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { projects } from "@/config/projects";
import { measure } from "./layout";
import { ProjectEntry } from "./ProjectEntry";

/** Conteúdo da página Projects (SPEC-004): abertura e lista de projetos. */
export async function ProjectsContent() {
  const t = await getTranslations("projects");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className={`mt-6 text-body-lg text-muted ${measure}`}>
            {t("intro")}
          </p>
        </header>

        <ul id="projects-list">
          {projects.map((project) => (
            <ProjectEntry key={project.key} project={project} />
          ))}
        </ul>
      </Container>
    </div>
  );
}
