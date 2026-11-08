import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

/** Conteúdo da página 404 localizada (SPEC-008, I18N-RF-12). */
export async function NotFoundContent() {
  const t = await getTranslations("notFound");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <h1 className="text-h1 text-foreground">{t("title")}</h1>
        <p className={`mt-6 text-body-lg text-muted ${measure}`}>
          {t("description")}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className={buttonStyles({ variant: "text", size: "md" })}
          >
            {t("home")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
