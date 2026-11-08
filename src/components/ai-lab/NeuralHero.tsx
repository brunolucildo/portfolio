import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NeuralNetwork } from "./neural/NeuralNetwork";

/**
 * Hero do AI Lab (SPEC-012, NEU-RF-02): rótulo e headline no `h1`, descrição, CTA
 * para a seção de experimentos e a rede neural como elemento visual dominante.
 * A máscara escura sob o texto mantém o contraste AA (NEU-RNF-04).
 */
export async function NeuralHero() {
  const t = await getTranslations("aiLab");

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="neural-glow pointer-events-none absolute inset-0"
      />
      <NeuralNetwork variant="hero" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/80 via-45% to-transparent to-85% lg:via-background/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent"
      />

      <Container className="relative z-10 flex min-h-[85svh] flex-col justify-center py-24 md:py-32">
        <h1 className="max-w-reading">
          <span className="block text-small font-medium tracking-[0.2em] text-primary uppercase">
            {t("title")}
          </span>
          <span className="mt-5 block text-display text-foreground">
            {t("neural.hero.headline")}
          </span>
        </h1>
        <p className={`mt-6 text-body-lg text-muted ${measure}`}>
          {t("neural.hero.description")}
        </p>
        <div className="mt-10">
          <a
            href="#experiments"
            className={buttonStyles({ variant: "primary", size: "lg" })}
          >
            {t("neural.hero.cta")}
          </a>
        </div>
      </Container>
    </section>
  );
}
