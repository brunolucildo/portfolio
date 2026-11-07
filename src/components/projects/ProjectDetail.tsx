import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { DetailProject } from "@/config/projects";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { columns, measure } from "./layout";
import { ProjectFigure } from "./ProjectFigure";
import { ProjectTechnologies } from "./ProjectTechnologies";

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

type ProjectDetailProps = {
  project: DetailProject;
};

type Decision = { title: string; text: string };

/** Página de detalhe de um projeto (PROJ-RF-06): cabeçalho e sete seções. */
export async function ProjectDetail({ project }: ProjectDetailProps) {
  const { key, repositoryUrl, technologies, detailImages, caption } = project;
  const t = await getTranslations("projects");
  const tNav = await getTranslations("navigation");
  const base = `detail.${key}` as const;
  const decisions = t.raw(`${base}.decisions`) as Decision[];

  const repositoryLink = (className?: string) => (
    <a
      href={repositoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles({ variant: "text", size: "md", className })}
    >
      {t("labels.repository")}
      <span className="sr-only"> {tNav("newTab")}</span>
    </a>
  );

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <Link
            href="/projects"
            className={buttonStyles({ variant: "text", size: "md" })}
          >
            <span aria-hidden="true">←</span>
            {t("labels.back")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-small text-muted">
              {t(`items.${key}.category`)}
            </span>
            <Badge>{t(`items.${key}.status`)}</Badge>
          </div>
          <h1 className="mt-4 text-h1 text-foreground">
            {t(`items.${key}.name`)}
          </h1>
          <p className={cn("mt-6 text-body-lg text-muted", measure)}>
            {t(`items.${key}.description`)}
          </p>
          <ProjectTechnologies technologies={technologies} />
          <div className="mt-4">{repositoryLink()}</div>
          <ProjectFigure
            images={detailImages}
            caption={caption}
            className="mt-10"
          />
        </header>

        <DetailBlock id="overview" title={t("detail.sections.overview")}>
          <p className="text-body-lg text-foreground">
            {t(`${base}.overview`)}
          </p>
        </DetailBlock>

        <DetailBlock id="challenge" title={t("detail.sections.challenge")}>
          <p className="text-body-lg text-foreground">
            {t(`${base}.challenge`)}
          </p>
        </DetailBlock>

        <DetailBlock id="solution" title={t("detail.sections.solution")}>
          <p className="text-body-lg text-foreground">
            {t(`${base}.solution`)}
          </p>
        </DetailBlock>

        <DetailBlock
          id="architecture"
          title={t("detail.sections.architecture")}
        >
          <p className="text-body-lg text-foreground">
            {t(`${base}.architecture`)}
          </p>
        </DetailBlock>

        <DetailBlock id="decisions" title={t("detail.sections.decisions")}>
          <ul className="space-y-6">
            {decisions.map((decision) => (
              <li key={decision.title}>
                <p className="text-body-lg font-medium text-foreground">
                  {decision.title}
                </p>
                <p className="mt-1 max-w-[34rem] text-body text-muted">
                  {decision.text}
                </p>
              </li>
            ))}
          </ul>
        </DetailBlock>

        <DetailBlock id="state" title={t("detail.sections.state")}>
          <p className="text-body-lg text-foreground">{t(`${base}.state`)}</p>
        </DetailBlock>

        <DetailBlock id="links" title={t("detail.sections.links")}>
          <p>{repositoryLink()}</p>
        </DetailBlock>
      </Container>
    </div>
  );
}
