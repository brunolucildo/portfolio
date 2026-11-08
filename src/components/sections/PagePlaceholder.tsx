import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type PagePlaceholderProps = {
  page: "aiLab" | "contact";
};

/** Página provisória, substituída quando a SPEC correspondente for implementada. */
export async function PagePlaceholder({ page }: PagePlaceholderProps) {
  const t = await getTranslations("pages");

  return (
    <div className="py-24 md:py-32">
      <Container>
        <h1 className="text-h1 text-foreground">{t(`${page}.title`)}</h1>
        <p className="mt-6 max-w-reading text-body-lg text-muted">
          {t("placeholder")}
        </p>
      </Container>
    </div>
  );
}
