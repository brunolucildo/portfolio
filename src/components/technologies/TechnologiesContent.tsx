import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { Container } from "@/components/ui/Container";
import { technologyCategories } from "@/config/technologies";
import { TechnologyCategorySection } from "./TechnologyCategorySection";

/** Conteúdo da página Technologies (SPEC-005): abertura e categorias. */
export async function TechnologiesContent() {
  const t = await getTranslations("technologies");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className={`mt-6 text-body-lg text-muted ${measure}`}>
            {t("intro")}
          </p>
          <p className="mt-4 max-w-[30rem] text-small text-muted">
            {t("note")}
          </p>
        </header>

        <div id="technologies-list">
          {technologyCategories.map((category) => (
            <TechnologyCategorySection key={category.key} category={category} />
          ))}
        </div>
      </Container>
    </div>
  );
}
