import { type ProjectKey, projects } from "@/config/projects";

/**
 * Destino de um projeto: a página de detalhe quando existe e, para o projeto
 * que só aparece na lista (FintaLab), a lista de Projects. É a mesma regra de
 * Technologies (TECH-RF-10) e do AI Lab (projeto de origem).
 */
export function projectHref(key: ProjectKey) {
  const slug = projects.find((project) => project.key === key)?.slug;

  return slug
    ? ({ pathname: "/projects/[slug]", params: { slug } } as const)
    : ("/projects" as const);
}
