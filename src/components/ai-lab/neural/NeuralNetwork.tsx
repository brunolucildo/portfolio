"use client";

import { useEffect, useRef, useState } from "react";
import { NeuralFallback } from "./NeuralFallback";
import {
  type Capacity,
  type NeuralVariant,
  nodeCount,
  type ParallaxMode,
  parallaxModeFor,
  pixelRatioCap,
} from "./neuralConfig";

type NeuralState = "fallback" | "running" | "static";

type Meta = { nodes: number; parallax: ParallaxMode };

const SERVER_META: Meta = { nodes: 0, parallax: "off" };

function readCapacity(): Capacity {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    saveData: nav.connection?.saveData,
  };
}

/** Faixa de largura: o efeito reinicia ao cruzar 768 px e 1024 px. */
function widthBucket(width: number): number {
  if (width >= 1024) return 2;
  if (width >= 768) return 1;
  return 0;
}

/**
 * Rede neural decorativa (SPEC-012): desenho estático no servidor e, depois da
 * hidratação, canvas animado carregado sob demanda. O contêiner expõe o estado
 * em `data-neural-*`, que é o contrato dos testes (NEU-RNF-10).
 */
export function NeuralNetwork({ variant }: { variant: NeuralVariant }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<NeuralState>("fallback");
  const [meta, setMeta] = useState<Meta>(SERVER_META);
  const [degraded, setDegraded] = useState(0);
  const [bucket, setBucket] = useState(-1);
  const [reduced, setReduced] = useState<boolean | null>(null);

  // Faixa de largura e preferência de movimento: reiniciam o efeito quando mudam.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setBucket(widthBucket(window.innerWidth));
      setReduced(motion.matches);
    };
    update();

    const tablet = window.matchMedia("(min-width: 48rem)");
    const desktop = window.matchMedia("(min-width: 64rem)");
    for (const query of [motion, tablet, desktop]) {
      query.addEventListener("change", update);
    }
    return () => {
      for (const query of [motion, tablet, desktop]) {
        query.removeEventListener("change", update);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || bucket < 0 || reduced === null) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    const width = window.innerWidth;
    const nodes = nodeCount(variant, width, readCapacity());
    const parallax = parallaxModeFor(width);
    setMeta({ nodes, parallax });
    setDegraded(0);

    import("./neuralEngine").then(({ startNeuralNetwork }) => {
      if (cancelled) return;

      const engine = startNeuralNetwork({
        container,
        canvas,
        nodes,
        pixelRatioCap: pixelRatioCap(width),
        parallax,
        pointer: window.matchMedia("(hover: hover) and (pointer: fine)")
          .matches,
        animate: !reduced,
        onState: setState,
        onDegrade: setDegraded,
      });

      if (!engine) {
        setState("fallback");
        return;
      }
      stop = engine.destroy;
    });

    return () => {
      cancelled = true;
      stop?.();
      container.style.removeProperty("--neural-shift");
      delete container.dataset.neuralPointer;
    };
  }, [variant, bucket, reduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-neural-variant={variant}
      data-neural-state={state}
      data-neural-nodes={meta.nodes}
      data-neural-parallax={meta.parallax}
      data-neural-degraded={degraded}
      className="neural pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="neural-layer absolute inset-0">
        <NeuralFallback variant={variant} />
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}
