import { getTranslations } from "next-intl/server";
import { columns } from "@/components/projects/layout";
import type { TechnologyCategory } from "@/config/technologies";
import { cn } from "@/lib/utils/cn";
import { TechnologyIcon } from "./TechnologyIcon";

type TechnologyCategorySectionProps = {
  category: TechnologyCategory;
};

/** Uma categoria da página Technologies (TECH-RF-01 e TECH-RF-03). */
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
          const context = [
            ...(technology.experience ? [t("experience")] : []),
            ...technology.projects.map((key) => tProjects(`items.${key}.name`)),
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
                    {context.join(" · ")}
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
