import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { projectHref } from "@/components/projects/href";
import { columns, measure } from "@/components/projects/layout";
import { ProjectTechnologies } from "@/components/projects/ProjectTechnologies";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { type DetailExperiment, experimentsWithDetail } from "@/config/aiLab";
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

/** Link para o experimento vizinho: rótulo pequeno e nome, com alvo de 44 px. */
const neighborClass =
  "group flex min-h-11 flex-col justify-center gap-1 decoration-primary underline-offset-4 hover:[&>span:last-child]:underline";

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

  // Vizinhos na ordem da lista, só entre experimentos com página (AIL-RF-16).
  const position = experimentsWithDetail.findIndex(
    (item) => item.slug === experiment.slug,
  );
  const previous = experimentsWithDetail[position - 1];
  const next = experimentsWithDetail[position + 1];

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
          {technologies.length > 0 ? (
            <ProjectTechnologies technologies={technologies} />
          ) : null}
          {originProject && origin ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-8">
              <p className="text-small text-muted">
                <span className="font-medium">{t("labels.partOf")}: </span>
                <Link
                  href={projectHref(origin)}
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

        {previous || next ? (
          <nav
            aria-label={t("labels.experimentNavigation")}
            className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 border-t border-border pt-10"
          >
            {previous ? (
              <Link
                href={{
                  pathname: "/ai-lab/[slug]",
                  params: { slug: previous.slug },
                }}
                className={neighborClass}
              >
                <span className="text-small text-muted">
                  <span aria-hidden="true">← </span>
                  {t("labels.previousExperiment")}
                </span>
                <span className="text-body text-foreground">
                  {t(`experiments.${previous.key}.name`)}
                </span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={{
                  pathname: "/ai-lab/[slug]",
                  params: { slug: next.slug },
                }}
                className={cn(neighborClass, "ml-auto text-right")}
              >
                <span className="text-small text-muted">
                  {t("labels.nextExperiment")}
                  <span aria-hidden="true"> →</span>
                </span>
                <span className="text-body text-foreground">
                  {t(`experiments.${next.key}.name`)}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Container>
    </div>
  );
}
