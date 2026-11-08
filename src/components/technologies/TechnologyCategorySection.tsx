import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import { projectHref } from "@/components/projects/href";
import { columns } from "@/components/projects/layout";
import type { TechnologyCategory } from "@/config/technologies";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { TechnologyIcon } from "./TechnologyIcon";

type TechnologyCategorySectionProps = {
  category: TechnologyCategory;
};

/** Link da linha de contexto: sublinhado discreto, destaque ao passar o mouse. */
const contextLinkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-(--duration-fast) ease-standard hover:text-foreground hover:decoration-primary";

/** Uma categoria da página Technologies (TECH-RF-01, TECH-RF-03 e TECH-RF-10). */
export async function TechnologyCategorySection({
  category,
}: TechnologyCategorySectionProps) {
  const t = await getTranslations("technologies");
  const tProjects = await getTranslations("projects");
  const headingId = `technologies-${category.key}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(columns, "border-t border-border py-12 md:py-16")}
    >
      <h2 id={headingId} className="text-h3 text-foreground">
        {t(`categories.${category.key}`)}
      </h2>

      <ul className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:mt-0">
        {category.technologies.map((technology) => {
          // "Experience" leva à página de Experience; cada projeto, ao detalhe
          // (ou à lista, quando não há detalhe).
          const context = [
            ...(technology.experience
              ? [
                  {
                    key: "experience",
                    label: t("experience"),
                    href: "/experience" as const,
                  },
                ]
              : []),
            ...technology.projects.map((key) => ({
              key,
              label: tProjects(`items.${key}.name`),
              href: projectHref(key),
            })),
          ];

          return (
            <li key={technology.name} className="flex items-start gap-3">
              {technology.icon ? (
                <span className="mt-0.5">
                  <TechnologyIcon icon={technology.icon} />
                </span>
              ) : null}
              <div>
                <span className="block text-foreground">{technology.name}</span>
                {context.length > 0 ? (
                  <span className="mt-1 block text-small text-muted">
                    {context.map(({ key, label, href }, index) => (
                      <Fragment key={key}>
                        {index > 0 ? " · " : null}
                        <Link href={href} className={contextLinkClass}>
                          {label}
                        </Link>
                      </Fragment>
                    ))}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
