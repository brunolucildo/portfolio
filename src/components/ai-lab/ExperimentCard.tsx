import { getTranslations } from "next-intl/server";
import { ProjectTechnologies } from "@/components/projects/ProjectTechnologies";
import { Card } from "@/components/ui/Card";
import type { AiLabExperiment } from "@/config/aiLab";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ExperimentMeta } from "./ExperimentMeta";

type ExperimentCardProps = {
  experiment: AiLabExperiment;
};

/**
 * AI Experiment Card (DESIGN_SYSTEM, 4.9). Quando há detalhe, o card inteiro é
 * um único link (o nome); o card "Em planejamento" não é um link (AIL-RF-02).
 */
export async function ExperimentCard({ experiment }: ExperimentCardProps) {
  const t = await getTranslations("aiLab");
  const { key, slug, type, state, model, technologies } = experiment;
  const name = t(`experiments.${key}.name`);

  return (
    <li className="flex">
      <Card
        interactive={slug !== null}
        className={cn(
          "relative flex w-full flex-col",
          slug === null && "border-dashed",
        )}
      >
        <ExperimentMeta type={type} state={state} />
        <h2 className="mt-4 text-h3 text-foreground">
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
        </h2>
        <p className="mt-3 text-body text-muted">
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
      </Card>
    </li>
  );
}
