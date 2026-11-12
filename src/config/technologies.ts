import type { ProjectKey } from "./projects";

/**
 * Tecnologias do portfólio (SPEC-005): fonte única de categoria, ícone e
 * contexto de uso, na ordem em que a página Technologies as exibe. Os nomes
 * são nomes próprios e não mudam com o idioma; os títulos das categorias e o
 * rótulo "Experience" ficam em `technologies` nos arquivos de conteúdo.
 *
 * O contexto só registra fatos documentados: `experience` indica que a
 * tecnologia consta em um cargo de `experience.ts` ou no currículo, e
 * `projects` lista os projetos de `projects.ts` que a usam.
 */
export type TechnologyCategoryKey =
  | "languages"
  | "backend"
  | "databases"
  | "messaging"
  | "architecture"
  | "ai"
  | "frontend"
  | "tools";

/**
 * Ícone da tecnologia: arquivo versionado em `public/images/technologies/`
 * (devicon, MIT, ou Simple Icons, CC0) ou monograma próprio quando não existe
 * ícone licenciado. O monograma nunca imita o logotipo da marca.
 */
export type TechnologyIcon =
  | { readonly kind: "brand"; readonly file: string }
  | { readonly kind: "monogram"; readonly letters: string };

export type Technology = {
  readonly name: string;
  /** Ausente nas categorias de conceitos (sem ícone e sem espaço reservado). */
  readonly icon?: TechnologyIcon;
  /** Aparece em Experience (cargo ou currículo). */
  readonly experience: boolean;
  /** Projetos que a usam, na ordem de `projects.ts`. */
  readonly projects: readonly ProjectKey[];
};

export type TechnologyCategory = {
  readonly key: TechnologyCategoryKey;
  readonly technologies: readonly Technology[];
};

const brand = (file: string): TechnologyIcon => ({ kind: "brand", file });
const monogram = (letters: string): TechnologyIcon => ({
  kind: "monogram",
  letters,
});

export const technologyCategories: readonly TechnologyCategory[] = [
  {
    key: "languages",
    technologies: [
      { name: "C#", icon: brand("csharp"), experience: true, projects: [] },
      {
        name: "JavaScript",
        icon: brand("javascript"),
        experience: true,
        projects: [],
      },
      {
        name: "TypeScript",
        icon: brand("typescript"),
        experience: false,
        projects: ["football", "reelix", "rondo", "fintalab"],
      },
      {
        name: "InterSystems Caché",
        icon: monogram("IC"),
        experience: true,
        projects: [],
      },
    ],
  },
  {
    key: "backend",
    technologies: [
      {
        name: ".NET",
        icon: brand("dotnetcore"),
        experience: true,
        projects: ["reelix"],
      },
      {
        name: "ASP.NET Core",
        icon: monogram("AS"),
        experience: true,
        projects: ["reelix"],
      },
      {
        name: "Node.js",
        icon: brand("nodejs"),
        experience: true,
        projects: ["football", "rondo"],
      },
      {
        name: "Entity Framework Core",
        icon: brand("entityframeworkcore"),
        experience: true,
        projects: ["reelix"],
      },
      {
        name: "Dapper",
        icon: monogram("Da"),
        experience: true,
        projects: [],
      },
    ],
  },
  {
    key: "databases",
    technologies: [
      {
        name: "PostgreSQL",
        icon: brand("postgresql"),
        experience: true,
        projects: ["reelix", "rondo"],
      },
      {
        name: "SQL Server",
        icon: brand("microsoftsqlserver"),
        experience: true,
        projects: [],
      },
      {
        name: "MongoDB",
        icon: brand("mongodb"),
        experience: true,
        projects: [],
      },
      {
        name: "SQLite",
        icon: brand("sqlite"),
        experience: false,
        projects: ["football", "fintalab"],
      },
    ],
  },
  {
    key: "messaging",
    technologies: [
      {
        name: "RabbitMQ",
        icon: brand("rabbitmq"),
        experience: true,
        projects: [],
      },
      {
        name: "Redis",
        icon: brand("redis"),
        experience: true,
        projects: [],
      },
      {
        name: "Azure Service Bus",
        icon: monogram("SB"),
        experience: false,
        projects: [],
      },
    ],
  },
  {
    key: "architecture",
    technologies: [
      { name: "REST APIs", experience: true, projects: ["reelix"] },
      { name: "Microservices", experience: true, projects: [] },
      { name: "Clean Architecture", experience: true, projects: [] },
      { name: "SOLID", experience: true, projects: [] },
      { name: "Event-Driven Architecture", experience: true, projects: [] },
      { name: "Automated testing", experience: false, projects: ["football"] },
    ],
  },
  {
    key: "ai",
    technologies: [
      {
        name: "OpenAI API",
        icon: monogram("OA"),
        experience: false,
        projects: ["football", "fintalab"],
      },
      {
        name: "RAG",
        icon: monogram("RG"),
        experience: false,
        projects: ["football"],
      },
    ],
  },
  {
    key: "frontend",
    technologies: [
      {
        name: "React Native",
        icon: brand("reactnative"),
        experience: false,
        projects: ["reelix"],
      },
      {
        name: "Expo",
        icon: brand("expo"),
        experience: false,
        projects: ["reelix"],
      },
    ],
  },
  {
    key: "tools",
    technologies: [
      {
        name: "Azure Data Factory",
        icon: brand("azuredatafactory"),
        experience: true,
        projects: [],
      },
      {
        name: "Supabase Auth",
        icon: brand("supabase"),
        experience: false,
        projects: ["reelix"],
      },
      {
        name: "TMDB",
        icon: brand("themoviedatabase"),
        experience: false,
        projects: ["reelix"],
      },
    ],
  },
];

/**
 * Nomes que `experience.ts` e `projects.ts` usam e que a página Technologies
 * unifica. Serve ao teste de consistência entre as páginas (TECH-RF-08).
 */
export const technologyAliases: Readonly<Record<string, readonly string[]>> = {
  "Entity Framework": ["Entity Framework Core"],
  "ASP.NET Core (.NET 10)": ["ASP.NET Core", ".NET"],
};
