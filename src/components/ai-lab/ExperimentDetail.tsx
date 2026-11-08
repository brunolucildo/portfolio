import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { columns, measure } from "@/components/projects/layout";
import { ProjectTechnologies } from "@/components/projects/ProjectTechnologies";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { DetailExperiment } from "@/config/aiLab";
import { projects } from "@/config/projects";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ExperimentMeta } from "./ExperimentMeta";

/** Campos do detalhe, na ordem da SPEC-006 (AIL-RF-04). */
const sections = [
  "objective",
  "problem",
  "approach",
  "results",
  "limitations",
  "learned",
] as const;

type DetailBlockProps = {
  id: string;
  title: string;
  children: ReactNode;
};

function DetailBlock({ id, title, children }: DetailBlockProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(columns, "border-t border-border py-12 md:py-16")}
    >
      <h2 id={titleId} className="text-h3 text-foreground">
        {title}
      </h2>
      <div className={cn("mt-4 space-y-6 lg:mt-0", measure)}>{children}</div>
    </section>
  );
}

type ExperimentDetailProps = {
  experiment: DetailExperiment;
};

/** Página de detalhe de um experimento (AIL-RF-04): cabeçalho e seis seções. */
export async function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const { key, type, state, model, technologies, origin } = experiment;
  const t = await getTranslations("aiLab");
  const tProjects = await getTranslations("projects");
  const tNav = await getTranslations("navigation");
  const originProject = projects.find((project) => project.key === origin);

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <Link
            href="/ai-lab"
            className={buttonStyles({ variant: "text", size: "md" })}
          >
            <span aria-hidden="true">←</span>
            {t("labels.back")}
          </Link>
          <ExperimentMeta type={type} state={state} className="mt-6" />
          <h1 className="mt-4 text-h1 text-foreground">
            {t(`experiments.${key}.name`)}
          </h1>
          <p className={cn("mt-6 text-body-lg text-muted", measure)}>
            {t(`experiments.${key}.summary`)}
          </p>
          {model ? (
            <p className="mt-6 text-small text-muted">
              <span className="font-medium">{t("labels.model")}: </span>
              {model}
            </p>
          ) : null}
          <ProjectTechnologies technologies={technologies} />
          {originProject && origin ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-8">
              <p className="text-small text-muted">
                <span className="font-medium">{t("labels.partOf")}: </span>
                <Link
                  href={
                    originProject.slug
                      ? {
                          pathname: "/projects/[slug]",
                          params: { slug: originProject.slug },
                        }
                      : "/projects"
                  }
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {tProjects(`items.${origin}.name`)}
                </Link>
              </p>
              <a
                href={originProject.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "text", size: "md" })}
              >
                {t("labels.repository")}
                <span className="sr-only">
                  {" — "}
                  {tProjects(`items.${origin}.name`)} {tNav("newTab")}
                </span>
              </a>
            </div>
          ) : null}
        </header>

        {sections.map((section) => (
          <DetailBlock
            key={section}
            id={section}
            title={t(`labels.${section}`)}
          >
            <p className="text-body-lg text-foreground">
              {t(`experiments.${key}.${section}`)}
            </p>
          </DetailBlock>
        ))}
      </Container>
    </div>
  );
}
