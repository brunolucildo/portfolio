import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { projects } from "@/config/projects";
import { Link } from "@/i18n/navigation";

/**
 * Destaques da Home (HOME-RF-04 e PROJ-RF-14): os mesmos projetos, na mesma
 * ordem e com os mesmos textos da página Projects.
 */
export async function FeaturedProjects() {
  const t = await getTranslations("home.projects");
  const tProjects = await getTranslations("projects");
  const tNav = await getTranslations("navigation");

  return (
    <Section id="featured-projects" title={t("title")}>
      <ul className="grid gap-6 lg:grid-cols-2">
        {projects.map(({ key, repositoryUrl }) => (
          <li key={key} className="flex">
            <Card interactive className="flex w-full flex-col p-8">
              <div className="flex flex-wrap gap-2">
                <Badge>{tProjects(`items.${key}.category`)}</Badge>
                <Badge>{tProjects(`items.${key}.status`)}</Badge>
              </div>
              <h3 className="mt-6 text-h3 text-foreground">
                {tProjects(`items.${key}.name`)}
              </h3>
              <p className="mt-3 text-muted">
                {tProjects(`items.${key}.description`)}
              </p>
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({
                  variant: "text",
                  size: "md",
                  className: "mt-auto self-start pt-6",
                })}
              >
                {t("repository")}
                <span className="sr-only"> {tNav("newTab")}</span>
              </a>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link
          href="/projects"
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          {t("link")}
        </Link>
      </p>
    </Section>
  );
}
