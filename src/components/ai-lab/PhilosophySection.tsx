import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ExperimentMark, ExploreMark, UnderstandMark } from "./PhilosophyMarks";

const concepts = [
  { key: "explore", Mark: ExploreMark },
  { key: "experiment", Mark: ExperimentMark },
  { key: "understand", Mark: UnderstandMark },
] as const;

/**
 * Philosophy (SPEC-012, NEU-RF-11): três conceitos lado a lado, separados por
 * filetes e com uma marca gráfica cada, em vez de três cards.
 */
export async function PhilosophySection() {
  const t = await getTranslations("aiLab");

  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="py-20 md:py-28"
    >
      <Container>
        <h2 id="philosophy-title" className="text-h2 text-foreground">
          {t("neural.philosophy.title")}
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-0">
          {concepts.map(({ key, Mark }) => (
            <div
              key={key}
              className="md:border-l md:border-border md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <Mark className="neural-mark h-28 w-40 text-neural-purple" />
              <h3 className="mt-6 text-h3 text-foreground">
                {t(`neural.philosophy.items.${key}.title`)}
              </h3>
              <p className="mt-3 max-w-[20rem] text-body text-muted">
                {t(`neural.philosophy.items.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
