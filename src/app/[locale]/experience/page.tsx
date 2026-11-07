import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ExperienceContent } from "@/components/experience/ExperienceContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/experience",
    namespace: "experience.metadata",
  });
}

export default async function ExperiencePage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <ExperienceContent />;
}
