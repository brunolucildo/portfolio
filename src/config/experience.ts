/**
 * Linha do tempo de Experience (SPEC-003). Do mais recente ao mais antigo.
 *
 * Datas e tecnologias ficam aqui, em uma única fonte, porque não mudam com o
 * idioma: os períodos são formatados por idioma na renderização e as
 * tecnologias são nomes próprios. Os textos de cada cargo estão em
 * `experience.roles.<key>` nos arquivos de conteúdo.
 */
export type ExperienceRole = {
  /** Chave do cargo em `experience.roles`. */
  key:
    | "techLead"
    | "seniorBackend"
    | "fullStack2020"
    | "fullStack2018"
    | "fullStack2016";
  /** Início, no formato `AAAA-MM`. */
  start: string;
  /** Fim, no formato `AAAA-MM`, ou `null` para o cargo atual. */
  end: string | null;
  /** Só há conquistas onde existe resultado validado (EXP-RF-04). */
  hasAchievements: boolean;
  technologies: readonly string[];
};

export const experienceRoles: readonly ExperienceRole[] = [
  {
    key: "techLead",
    start: "2023-05",
    end: null,
    hasAchievements: true,
    technologies: [
      ".NET",
      "C#",
      "Clean Architecture",
      "SOLID",
      "PostgreSQL",
      "RabbitMQ",
    ],
  },
  {
    key: "seniorBackend",
    start: "2022-09",
    end: "2023-05",
    hasAchievements: false,
    technologies: [
      "C#",
      "ASP.NET Core",
      "PostgreSQL",
      "SQL Server",
      "MongoDB",
      "Redis",
      "RabbitMQ",
      "Entity Framework",
      "Dapper",
    ],
  },
  {
    key: "fullStack2020",
    start: "2020-03",
    end: "2022-08",
    hasAchievements: false,
    technologies: [
      "InterSystems Caché",
      "Azure Data Factory",
      "SQL Server",
      "JavaScript",
      "Node.js",
    ],
  },
  {
    key: "fullStack2018",
    start: "2018-06",
    end: "2020-03",
    hasAchievements: false,
    technologies: ["InterSystems Caché", "SQL Server", "JavaScript"],
  },
  {
    key: "fullStack2016",
    start: "2016-07",
    end: "2018-06",
    hasAchievements: false,
    technologies: ["InterSystems Caché", "SQL Server", "JavaScript"],
  },
];
