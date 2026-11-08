import { ClosingExperience } from "./ClosingExperience";
import { ExperimentsSection } from "./ExperimentsSection";
import { NeuralHero } from "./NeuralHero";
import { PhilosophySection } from "./PhilosophySection";
import { ResearchLog } from "./ResearchLog";

/**
 * Conteúdo da página AI Lab (SPEC-012): Hero, Philosophy, Experiments & Research,
 * Research Log e Closing. Os dados e os textos dos experimentos são os da SPEC-006.
 */
export async function AiLabContent() {
  return (
    <>
      <NeuralHero />
      <PhilosophySection />
      <ExperimentsSection />
      <ResearchLog />
      <ClosingExperience />
    </>
  );
}
