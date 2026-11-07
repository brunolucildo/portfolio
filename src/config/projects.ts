type FeaturedProjectConfig = {
  /** Chave da tradução em `home.projects.items`. */
  key: "football" | "reelix";
  /** Repositório público no GitHub. */
  repositoryUrl: string;
};

export const featuredProjects: readonly FeaturedProjectConfig[] = [
  {
    key: "football",
    repositoryUrl:
      "https://github.com/brunolucildo/football-stat-analytics-cli",
  },
  {
    key: "reelix",
    repositoryUrl: "https://github.com/brunolucildo/reelix",
  },
];
