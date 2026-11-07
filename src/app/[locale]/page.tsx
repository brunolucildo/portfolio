import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="py-24 md:py-32">
      <Container>
        <h1 className="max-w-4xl text-display text-foreground">
          {t("headline")}
        </h1>
        <p className="mt-6 max-w-reading text-body-lg text-muted">
          {t("subheadline")}
        </p>
      </Container>
    </div>
  );
}
