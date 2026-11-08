import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ResumeContent } from "@/components/resume/ResumeContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/resume",
    namespace: "resume.metadata",
  });
}

export default async function ResumePage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <ResumeContent />;
}
