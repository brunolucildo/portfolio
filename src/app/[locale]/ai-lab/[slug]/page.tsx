import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ExperimentDetail } from "@/components/ai-lab/ExperimentDetail";
import { experimentsWithDetail, findExperimentBySlug } from "@/config/aiLab";
import { requireLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Só os slugs conhecidos existem; qualquer outro responde 404 (AIL-RF-03). */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    experimentsWithDetail.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const experiment = findExperimentBySlug(slug);

  if (!experiment) {
    return {};
  }

  return buildPageMetadata({
    locale,
    href: { pathname: "/ai-lab/[slug]", params: { slug } },
    namespace: `aiLab.experiments.${experiment.key}`,
  });
}

export default async function AiLabExperimentPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(requireLocale(locale));

  const experiment = findExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  return <ExperimentDetail experiment={experiment} />;
}
