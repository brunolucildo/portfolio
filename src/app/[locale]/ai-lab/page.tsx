import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AiLabContent } from "@/components/ai-lab/AiLabContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/ai-lab",
    namespace: "aiLab.metadata",
  });
}

export default async function AiLabPage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <AiLabContent />;
}
