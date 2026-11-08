/**
 * Regras da rede neural do AI Lab (SPEC-012): densidade, parallax e degradação.
 * Funções puras, sem DOM, para o motor e os testes usarem os mesmos números.
 */

export type NeuralVariant = "hero" | "closing";
export type ParallaxMode = "full" | "scroll" | "off";

/** Menor quantidade de nós antes de a animação parar (NEU-RF-07). */
export const MIN_NODES = 20;
/** Tempo médio de quadro, em ms, acima do qual a rede degrada (NEU-RF-07). */
export const SLOW_FRAME_MS = 22;
/** Quadros seguidos usados para medir o tempo médio. */
export const SLOW_FRAME_WINDOW = 90;
/** Quantas vezes a rede reduz os nós antes de parar em um quadro estático. */
export const MAX_DEGRADES = 2;
/** Fração dos nós do Hero usada no encerramento (NEU-RF-21). */
export const CLOSING_RATIO = 0.4;

export type Capacity = {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  saveData?: boolean;
};

/** Nós por largura de tela: 90 no desktop, 56 no tablet e 32 no celular. */
export function densityFor(width: number): number {
  if (width >= 1024) return 90;
  if (width >= 768) return 56;
  return 32;
}

/** Parallax por largura: completo, só scroll ou desligado (NEU-RF-05). */
export function parallaxModeFor(width: number): ParallaxMode {
  if (width >= 1024) return "full";
  if (width >= 768) return "scroll";
  return "off";
}

/** Aparelho com 4 núcleos ou menos, 4 GB ou menos, ou economia de dados. */
export function isLowCapacity(capacity: Capacity): boolean {
  const { hardwareConcurrency, deviceMemory, saveData } = capacity;
  return (
    saveData === true ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 4) ||
    (deviceMemory !== undefined && deviceMemory <= 4)
  );
}

/**
 * Quantidade inicial de nós. Aparelhos de baixa capacidade começam na
 * densidade do tablet; o encerramento usa 40% do Hero.
 */
export function nodeCount(
  variant: NeuralVariant,
  width: number,
  capacity: Capacity = {},
): number {
  const effectiveWidth = width >= 1024 && isLowCapacity(capacity) ? 768 : width;
  const hero = densityFor(effectiveWidth);

  return variant === "closing" ? Math.round(hero * CLOSING_RATIO) : hero;
}

/** Reduz os nós em 30%, sem passar do piso. */
export function degrade(nodes: number): number {
  // Aritmética inteira: `90 * 0.7` dá 62,99… em ponto flutuante e perderia um nó.
  return Math.max(MIN_NODES, Math.floor((nodes * 7) / 10));
}

/** Limite de resolução do canvas: 2x no desktop e 1,5x no celular. */
export function pixelRatioCap(width: number): number {
  return width >= 1024 ? 2 : 1.5;
}

export type FrameVerdict = "collecting" | "ok" | "slow";

/** Mede o tempo médio de quadro em janelas de `SLOW_FRAME_WINDOW` quadros. */
export function createFrameMonitor() {
  let total = 0;
  let count = 0;

  return {
    push(deltaMs: number): FrameVerdict {
      total += deltaMs;
      count += 1;
      if (count < SLOW_FRAME_WINDOW) return "collecting";

      const average = total / count;
      total = 0;
      count = 0;
      return average > SLOW_FRAME_MS ? "slow" : "ok";
    },
    reset() {
      total = 0;
      count = 0;
    },
  };
}
