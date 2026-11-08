import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import type { ProjectConfig } from "@/config/projects";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { columns, measure } from "./layout";
import { ProjectFigure } from "./ProjectFigure";
import { ProjectTechnologies } from "./ProjectTechnologies";

type ProjectEntryProps = {
  project: ProjectConfig;
};

/** Uma entrada da lista de Projects (PROJ-RF-02 e PROJ-RF-03). */
export async function ProjectEntry({ project }: ProjectEntryProps) {
  const t = await getTranslations("projects");
  const tNav = await getTranslations("navigation");
  const { key, slug, repositoryUrl, technologies, listImages, caption } =
    project;

  return (
    <li className={cn(columns, "border-t border-border py-12 md:py-16")}>
      <div>
        <h2 className="text-h3 text-foreground">{t(`items.${key}.name`)}</h2>
        <p className="mt-2 text-small text-muted">
          {t(`items.${key}.category`)}
        </p>
        <Badge className="mt-3">{t(`items.${key}.status`)}</Badge>
      </div>

      <div className="mt-6 lg:mt-0">
        <ProjectFigure images={listImages} caption={caption} className="mb-8" />
        <p className={cn("text-body-lg text-foreground", measure)}>
          {t(`items.${key}.description`)}
        </p>
        <ProjectTechnologies technologies={technologies} />
        <div className="mt-6 flex flex-wrap gap-x-8">
          {slug ? (
            <Link
              href={{ pathname: "/projects/[slug]", params: { slug } }}
              className={buttonStyles({ variant: "text", size: "md" })}
            >
              {t("labels.viewDetails")}
              <span className="sr-only"> — {t(`items.${key}.name`)}</span>
            </Link>
          ) : null}
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: "text", size: "md" })}
          >
            {t("labels.repository")}
            <span className="sr-only">
              {" — "}
              {t(`items.${key}.name`)} {tNav("newTab")}
            </span>
          </a>
        </div>
      </div>
    </li>
  );
}
