import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProjectsContent } from "@/components/projects/ProjectsContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/projects",
    namespace: "projects.metadata",
  });
}

export default async function ProjectsPage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <ProjectsContent />;
}
