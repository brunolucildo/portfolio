import { getTranslations } from "next-intl/server";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { Container } from "@/components/ui/Container";
import { experienceRoles } from "@/config/experience";

/** Conteúdo da página Experience (SPEC-003): abertura e linha do tempo. */
export async function ExperienceContent() {
  const t = await getTranslations("experience");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className="mt-6 max-w-[39rem] text-body-lg text-muted">
            {t("intro")}
          </p>
        </header>

        <ol className="border-t border-border pt-12 md:pt-16">
          {experienceRoles.map((role) => (
            <ExperienceItem key={role.key} role={role} />
          ))}
        </ol>
      </Container>
    </div>
  );
}
