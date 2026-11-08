import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { NeuralNetwork } from "./neural/NeuralNetwork";

/**
 * Encerramento (SPEC-012, NEU-RF-21): a headline sobre uma versão reduzida da
 * rede, com a base esmaecendo para o fundo do footer.
 */
export async function ClosingExperience() {
  const t = await getTranslations("aiLab");

  return (
    <section
      id="closing"
      aria-labelledby="closing-title"
      className="relative isolate overflow-hidden border-t border-border"
    >
      <div
        aria-hidden="true"
        className="neural-glow pointer-events-none absolute inset-0"
      />
      <NeuralNetwork variant="closing" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_50%,var(--color-background),transparent)] opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent"
      />
      <Container className="relative z-10 flex min-h-[60svh] items-center justify-center py-28 text-center">
        <h2 id="closing-title" className="text-display text-foreground">
          {t("neural.closing.headline")}
        </h2>
      </Container>
    </section>
  );
}
