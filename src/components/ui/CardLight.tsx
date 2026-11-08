"use client";

import { useEffect } from "react";

let users = 0;
let frame = 0;
let stop: (() => void) | undefined;

/** Uma única escuta de ponteiro para todos os cards com luz, não uma por card. */
function listen() {
  const motion = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );

  const onMove = (event: PointerEvent) => {
    if (!motion.matches) return;
    const card = (event.target as Element | null)?.closest<HTMLElement>(
      "[data-card-light]",
    );
    if (!card) return;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("pointermove", onMove);
  };
}

/**
 * Faz a luz dos cards interativos acompanhar o cursor (só com ponteiro fino e
 * sem movimento reduzido). Não renderiza nada; é montado pelo `Card`.
 */
export function CardLight() {
  useEffect(() => {
    if (users === 0) stop = listen();
    users += 1;

    return () => {
      users -= 1;
      if (users === 0) {
        stop?.();
        stop = undefined;
      }
    };
  }, []);

  return null;
}
