import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { findProjectBySlug, projectsWithDetail } from "@/config/projects";
import { requireLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Só os slugs conhecidos existem; qualquer outro responde 404 (PROJ-RF-05). */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projectsWithDetail.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = findProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return buildPageMetadata({
    locale,
    href: { pathname: "/projects/[slug]", params: { slug } },
    namespace: `projects.detail.${project.key}.metadata`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(requireLocale(locale));

  const project = findProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
