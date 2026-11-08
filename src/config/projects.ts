/**
 * Projetos do portfólio (SPEC-004): fonte única de nome do repositório,
 * slug, tecnologias e imagens, consumida pela Home, pela lista e pelos
 * detalhes. Nome, categoria, estado e descrição ficam em `projects.items.<key>`
 * nos arquivos de conteúdo.
 */
export type ProjectKey = "football" | "reelix" | "fintalab";

/** Arquivo de imagem, único ou por idioma (o protótipo do FintaLab é bilíngue). */
export type ProjectImageSource =
  | string
  | { readonly en: string; readonly "pt-BR": string };

export type ProjectImage = {
  /** Chave do texto alternativo em `projects.images`. */
  alt:
    | "reelixHome"
    | "reelixMovies"
    | "reelixSearch"
    | "reelixTitle"
    | "reelixReviews"
    | "reelixWatchlist"
    | "reelixProfile"
    | "reelixStats"
    | "reelixLogin"
    | "fintalabLanding"
    | "fintalabEvaluation"
    | "fintalabRoster";
  src: ProjectImageSource;
  width: number;
  height: number;
};

export type ProjectConfig = {
  key: ProjectKey;
  /** Slug da página de detalhe; `null` quando o projeto só aparece na lista. */
  slug: string | null;
  /** Repositório público no GitHub. */
  repositoryUrl: string;
  /** Tecnologias do que existe hoje nos repositórios (PROJ-RF-07). */
  technologies: readonly string[];
  /** Imagens da entrada na lista (a primeira é a capa). */
  listImages: readonly ProjectImage[];
  /** Imagens da página de detalhe. */
  detailImages: readonly ProjectImage[];
  /** Chave da legenda das imagens em `projects.captions`. */
  caption: "reelix" | "fintalab" | null;
};

const reelixHome: ProjectImage = {
  alt: "reelixHome",
  src: "/images/projects/reelix-home.jpg",
  width: 830,
  height: 1800,
};

const reelixMovies: ProjectImage = {
  alt: "reelixMovies",
  src: "/images/projects/reelix-movies.jpg",
  width: 860,
  height: 1800,
};

const reelixSearch: ProjectImage = {
  alt: "reelixSearch",
  src: "/images/projects/reelix-search.jpg",
  width: 860,
  height: 1800,
};

const reelixTitle: ProjectImage = {
  alt: "reelixTitle",
  src: "/images/projects/reelix-title.jpg",
  width: 860,
  height: 1800,
};

const reelixReviews: ProjectImage = {
  alt: "reelixReviews",
  src: "/images/projects/reelix-reviews.png",
  width: 860,
  height: 1800,
};

const reelixWatchlist: ProjectImage = {
  alt: "reelixWatchlist",
  src: "/images/projects/reelix-watchlist.jpg",
  width: 860,
  height: 1800,
};

const reelixProfile: ProjectImage = {
  alt: "reelixProfile",
  src: "/images/projects/reelix-profile.png",
  width: 860,
  height: 1340,
};

const reelixStats: ProjectImage = {
  alt: "reelixStats",
  src: "/images/projects/reelix-stats.png",
  width: 830,
  height: 1800,
};

const reelixLogin: ProjectImage = {
  alt: "reelixLogin",
  src: "/images/projects/reelix-login.png",
  width: 860,
  height: 1800,
};

const fintalabImages: readonly ProjectImage[] = [
  {
    alt: "fintalabLanding",
    src: {
      en: "/images/projects/fintalab-landing.en.png",
      "pt-BR": "/images/projects/fintalab-landing.pt-BR.png",
    },
    width: 2160,
    height: 1350,
  },
  {
    alt: "fintalabEvaluation",
    src: {
      en: "/images/projects/fintalab-evaluation.en.png",
      "pt-BR": "/images/projects/fintalab-evaluation.pt-BR.png",
    },
    width: 2160,
    height: 1350,
  },
  {
    alt: "fintalabRoster",
    src: {
      en: "/images/projects/fintalab-roster.en.png",
      "pt-BR": "/images/projects/fintalab-roster.pt-BR.png",
    },
    width: 2160,
    height: 1350,
  },
];

/** Ordem da Home e da lista (PROJ-RF-01 e PROJ-RF-14). */
export const projects: readonly ProjectConfig[] = [
  {
    key: "football",
    slug: "football-stat-analytics",
    repositoryUrl:
      "https://github.com/brunolucildo/football-stat-analytics-cli",
    technologies: ["TypeScript", "Node.js", "OpenAI API", "SQLite", "RAG"],
    listImages: [],
    detailImages: [],
    caption: null,
  },
  {
    key: "reelix",
    slug: "reelix",
    repositoryUrl: "https://github.com/brunolucildo/reelix",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "ASP.NET Core (.NET 10)",
      "PostgreSQL",
      "Entity Framework Core",
      "Supabase Auth",
      "TMDB",
    ],
    listImages: [reelixHome, reelixSearch, reelixWatchlist],
    detailImages: [
      reelixHome,
      reelixMovies,
      reelixSearch,
      reelixTitle,
      reelixReviews,
      reelixWatchlist,
      reelixProfile,
      reelixStats,
      reelixLogin,
    ],
    caption: "reelix",
  },
  {
    key: "fintalab",
    slug: null,
    repositoryUrl: "https://github.com/brunolucildo/fintalab",
    technologies: ["TypeScript", "OpenAI API", "SQLite"],
    listImages: fintalabImages,
    detailImages: [],
    caption: "fintalab",
  },
];

export type DetailProject = Omit<ProjectConfig, "key" | "slug"> & {
  key: "football" | "reelix";
  slug: string;
};

/** Projetos com página de detalhe e os slugs válidos (PROJ-RF-05). */
export const projectsWithDetail = projects.filter(
  (project): project is DetailProject => project.slug !== null,
);

export function findProjectBySlug(slug: string): DetailProject | undefined {
  return projectsWithDetail.find((project) => project.slug === slug);
}

/** Caminho do arquivo da imagem no idioma informado. */
export function imageSource(image: ProjectImage, locale: string): string {
  if (typeof image.src === "string") {
    return image.src;
  }

  return locale === "pt-BR" ? image.src["pt-BR"] : image.src.en;
}
