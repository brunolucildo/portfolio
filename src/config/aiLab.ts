import type { ProjectKey } from "./projects";

/**
 * Experimentos do AI Lab (SPEC-006): fonte única de slug, tipo, estado, modelo,
 * tecnologias e projeto de origem, na ordem da lista. Nome, resumo e os textos
 * de cada experimento ficam em `aiLab.experiments.<key>` nos arquivos de
 * conteúdo. Modelo e tecnologias são nomes próprios e não mudam com o idioma.
 */
export type AiLabExperimentKey =
  | "ragGrounding"
  | "outputValidation"
  | "scoreConsistency"
  | "analystPersonas"
  | "approachAndModelChoice"
  | "promptTestFramework"
  | "loraFineTuning"
  | "rondo";

/** "Projeto concluído" existe no vocabulário, mas nenhum experimento o usa na v1. */
export type ExperimentType = "study" | "proofOfConcept" | "completed";

export type ExperimentState = "inDevelopment" | "concluded" | "planning";

export type AiLabExperiment = {
  key: AiLabExperimentKey;
  /** Slug da página de detalhe; `null` no card "Em planejamento". */
  slug: string | null;
  /** Projeto cuja página o card "Em planejamento" abre (SPEC-014); `null` nos demais. */
  projectPage?: Extract<ProjectKey, "rondo">;
  type: ExperimentType;
  state: ExperimentState;
  /** Modelo documentado; `null` quando o repositório não o define. */
  model: string | null;
  /** Tecnologias que o experimento usa de fato (nomes de `technologies.ts`). */
  technologies: readonly string[];
  /** Projeto de onde o experimento saiu; `null` quando não há página de origem. */
  origin: Extract<ProjectKey, "football" | "fintalab"> | null;
  /** Experimento em destaque na lista (SPEC-012, NEU-RF-13). */
  featured?: boolean;
};

export const aiLabExperiments: readonly AiLabExperiment[] = [
  {
    key: "ragGrounding",
    slug: "rag-grounding",
    featured: true,
    type: "proofOfConcept",
    state: "inDevelopment",
    model: "gpt-4o-mini, OpenAI embeddings",
    technologies: ["TypeScript", "Node.js", "OpenAI API", "SQLite", "RAG"],
    origin: "football",
  },
  {
    key: "outputValidation",
    slug: "output-validation",
    type: "proofOfConcept",
    state: "inDevelopment",
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "Node.js", "OpenAI API", "SQLite"],
    origin: "football",
  },
  {
    key: "scoreConsistency",
    slug: "score-consistency",
    type: "study",
    state: "concluded",
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "Node.js", "OpenAI API"],
    origin: "football",
  },
  {
    key: "analystPersonas",
    slug: "analyst-personas",
    type: "study",
    state: "concluded",
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "OpenAI API", "SQLite"],
    origin: "fintalab",
  },
  // Material de estudo sem repositório público (SPEC-006 v0.5.0, seção 7.7):
  // sem projeto de origem e sem tecnologias listadas.
  {
    key: "approachAndModelChoice",
    slug: "approach-and-model-choice",
    type: "study",
    state: "concluded",
    model: null,
    technologies: [],
    origin: null,
  },
  {
    key: "promptTestFramework",
    slug: "prompt-test-framework",
    type: "study",
    state: "concluded",
    model: null,
    technologies: [],
    origin: null,
  },
  {
    key: "loraFineTuning",
    slug: "lora-fine-tuning",
    type: "study",
    state: "concluded",
    model: "Qwen2.5-1.5B-Instruct, LoRA adapter",
    technologies: [],
    origin: null,
  },
  {
    key: "rondo",
    slug: null,
    projectPage: "rondo",
    type: "study",
    state: "planning",
    model: null,
    technologies: [],
    origin: null,
  },
];

export type DetailExperiment = Omit<AiLabExperiment, "key" | "slug"> & {
  key: Exclude<AiLabExperimentKey, "rondo">;
  slug: string;
};

/** Experimentos com página de detalhe e os slugs válidos (AIL-RF-03). */
export const experimentsWithDetail = aiLabExperiments.filter(
  (experiment): experiment is DetailExperiment => experiment.slug !== null,
);

export function findExperimentBySlug(
  slug: string,
): DetailExperiment | undefined {
  return experimentsWithDetail.find((experiment) => experiment.slug === slug);
}

/** Filtros da lista do AI Lab (SPEC-012, NEU-RF-16). */
export type ExperimentFilter = "experiments" | "research" | "projects";

/**
 * Filtro de cada tipo: prova de conceito é "Experiments", estudo é "Research"
 * e projeto concluído é "Projects" (nenhum na v1).
 */
export function filterOf(type: ExperimentType): ExperimentFilter {
  switch (type) {
    case "proofOfConcept":
      return "experiments";
    case "study":
      return "research";
    case "completed":
      return "projects";
  }
}

/** Identificador do experimento, pela posição na lista: `EXP / 001`. */
export function experimentNumber(key: AiLabExperimentKey): string {
  const index = aiLabExperiments.findIndex((item) => item.key === key);
  return `EXP / ${String(index + 1).padStart(3, "0")}`;
}
