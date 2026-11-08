import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { Container } from "@/components/ui/Container";
import {
  aiLabExperiments,
  type ExperimentFilter,
  filterOf,
} from "@/config/aiLab";
import { ExperimentFilters } from "./ExperimentFilters";
import { ExperimentTile } from "./ExperimentTile";

/**
 * Largura de cada item na grade de 12 colunas (a partir de 1024 px), na ordem
 * da lista: o destaque ocupa 7 colunas e 2 linhas; os demais, 4, 5 ou 7.
 * Entre 768 e 1023 px a grade tem 2 colunas e o destaque ocupa a largura toda.
 */
const spans = [
  "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-7",
  "lg:col-span-5",
] as const;

const FILTER_ORDER: ExperimentFilter[] = [
  "experiments",
  "research",
  "projects",
];

/**
 * Experiments & Research (SPEC-012, NEU-RF-12 a NEU-RF-18): abertura aprovada da
 * SPEC-006, filtros, destaque e grade assimétrica. O filtro "Projects" só
 * existe quando algum experimento for um projeto concluído.
 */
export async function ExperimentsSection() {
  const t = await getTranslations("aiLab");

  const counts = new Map<ExperimentFilter, number>();
  for (const experiment of aiLabExperiments) {
    const filter = filterOf(experiment.type);
    counts.set(filter, (counts.get(filter) ?? 0) + 1);
  }

  const options = [
    {
      key: "all" as const,
      label: t("neural.experiments.filters.all"),
      count: aiLabExperiments.length,
    },
    ...FILTER_ORDER.filter((filter) => (counts.get(filter) ?? 0) > 0).map(
      (filter) => ({
        key: filter,
        label: t(`neural.experiments.filters.${filter}`),
        count: counts.get(filter) ?? 0,
      }),
    ),
  ];

  return (
    <section
      id="experiments"
      aria-labelledby="experiments-title"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <h2 id="experiments-title" className="text-h2 text-foreground">
          {t("neural.experiments.title")}
        </h2>
        <p className={`mt-6 text-body-lg text-muted ${measure}`}>
          {t("intro")}
        </p>

        <ExperimentFilters
          listId="ai-lab-list"
          groupLabel={t("neural.experiments.filtersLabel")}
          options={options}
          total={aiLabExperiments.length}
          showing={t("neural.experiments.showing")}
          of={t("neural.experiments.of")}
        />

        <ul
          id="ai-lab-list"
          aria-label={t("labels.experiments")}
          className="neural-grid mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:grid-flow-dense"
        >
          {aiLabExperiments.map((experiment, index) => (
            <ExperimentTile
              key={experiment.key}
              experiment={experiment}
              className={spans[index]}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
