import { getTranslations } from "next-intl/server";
import { ProjectTechnologies } from "@/components/projects/ProjectTechnologies";
import {
  type AiLabExperiment,
  experimentNumber,
  filterOf,
} from "@/config/aiLab";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ExperimentMeta } from "./ExperimentMeta";

type ExperimentTileProps = {
  experiment: AiLabExperiment;
  /** Largura do item na grade assimétrica (classes de coluna). */
  className?: string;
};

/**
 * Item da grade de experimentos (SPEC-012, NEU-RF-13 a NEU-RF-15): número `EXP`,
 * estado em texto e cor, resumo, modelo e tecnologias. Quando há detalhe, o item
 * inteiro é um único link (o nome); o card "Em planejamento" não é um link.
 */
export async function ExperimentTile({
  experiment,
  className,
}: ExperimentTileProps) {
  const t = await getTranslations("aiLab");
  const { key, slug, type, state, model, technologies, featured } = experiment;
  const name = t(`experiments.${key}.name`);

  return (
    <li
      data-tile=""
      data-filter={filterOf(type)}
      data-featured={featured ? "true" : undefined}
      className={cn("flex", className)}
    >
      <div
        data-linked={slug ? "true" : undefined}
        className={cn(
          "neural-tile group relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-surface p-6 md:p-8",
          slug === null && "border-dashed",
          featured && "lg:p-10",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-caption tracking-[0.18em] text-muted">
            {experimentNumber(key)}
          </p>
          {featured ? (
            <p className="text-caption font-medium tracking-wide text-primary uppercase">
              {t("neural.experiments.featured")}
            </p>
          ) : null}
        </div>
        <ExperimentMeta type={type} state={state} className="mt-4" />
        <h3
          className={cn(
            "mt-4 text-foreground",
            featured ? "text-h2" : "text-h3",
          )}
        >
          {slug ? (
            <Link
              href={{ pathname: "/ai-lab/[slug]", params: { slug } }}
              className="inline-flex min-h-11 items-center after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-primary"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>
        <p
          className={cn(
            "mt-3 text-muted",
            featured ? "text-body-lg" : "text-body",
          )}
        >
          {t(`experiments.${key}.summary`)}
        </p>
        {model || technologies.length > 0 ? (
          <div className="mt-auto">
            {model ? (
              <p className="mt-6 text-small text-muted">
                <span className="font-medium">{t("labels.model")}: </span>
                {model}
              </p>
            ) : null}
            {technologies.length > 0 ? (
              <ProjectTechnologies technologies={technologies} />
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}
