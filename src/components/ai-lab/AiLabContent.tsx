import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { Container } from "@/components/ui/Container";
import { aiLabExperiments } from "@/config/aiLab";
import { AiLabGraphic } from "./AiLabGraphic";
import { ExperimentCard } from "./ExperimentCard";

/** Conteúdo da página AI Lab (SPEC-006): abertura e lista de experimentos. */
export async function AiLabContent() {
  const t = await getTranslations("aiLab");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="relative pb-16 md:pb-20">
          <AiLabGraphic />
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className={`mt-6 text-body-lg text-muted ${measure}`}>
            {t("intro")}
          </p>
        </header>

        <ul
          id="ai-lab-list"
          aria-label={t("labels.experiments")}
          className="grid gap-6 lg:grid-cols-2"
        >
          {aiLabExperiments.map((experiment) => (
            <ExperimentCard key={experiment.key} experiment={experiment} />
          ))}
        </ul>
      </Container>
    </div>
  );
}
