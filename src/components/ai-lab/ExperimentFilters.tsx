"use client";

import { useEffect, useState } from "react";
import type { ExperimentFilter } from "@/config/aiLab";
import { cn } from "@/lib/utils/cn";

type FilterOption = {
  key: "all" | ExperimentFilter;
  label: string;
  count: number;
};

type ExperimentFiltersProps = {
  /** Id da lista (`ul`) cujos itens o filtro mostra e esconde. */
  listId: string;
  groupLabel: string;
  options: FilterOption[];
  total: number;
  /** Partes da frase de status: "Showing" + n + "of" + total. */
  showing: string;
  of: string;
};

/**
 * Filtros da lista de experimentos (SPEC-012, NEU-RF-16 e NEU-RF-17). A lista é
 * renderizada inteira no servidor; os botões só aparecem com JavaScript e
 * escondem os itens com o atributo `hidden`, sem recarregar a página. Uma única
 * escuta de ponteiro na lista acompanha o cursor para a iluminação dos itens
 * (NEU-RF-24).
 */
export function ExperimentFilters({
  listId,
  groupLabel,
  options,
  total,
  showing,
  of,
}: ExperimentFiltersProps) {
  const [active, setActive] = useState<FilterOption["key"]>("all");
  // Sem JavaScript os botões não fariam nada: a barra só existe depois da hidratação.
  const [mounted, setMounted] = useState(false);
  const count = options.find((option) => option.key === active)?.count ?? total;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;

    for (const item of list.querySelectorAll<HTMLElement>("[data-tile]")) {
      item.hidden = active !== "all" && item.dataset.filter !== active;
    }
    list.dataset.filtered = active === "all" ? "false" : "true";
  }, [active, listId]);

  useEffect(() => {
    const list = document.getElementById(listId);
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!list || !canHover.matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const tile = (event.target as Element | null)?.closest<HTMLElement>(
        ".neural-tile",
      );
      if (!tile) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = tile.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        tile.style.setProperty("--mx", `${x}px`);
        tile.style.setProperty("--my", `${y}px`);
        tile.style.setProperty("--tilt-y", `${(x / rect.width - 0.5) * 4}deg`);
        tile.style.setProperty(
          "--tilt-x",
          `${(y / rect.height - 0.5) * -4}deg`,
        );
      });
    };

    list.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("pointermove", onMove);
    };
  }, [listId]);

  if (!mounted) return null;

  return (
    <div className="mt-10">
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        <fieldset className="m-0 flex w-max min-w-0 gap-2 border-0 p-0 md:w-auto md:flex-wrap">
          <legend className="sr-only">{groupLabel}</legend>
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={active === option.key}
              onClick={() => setActive(option.key)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-small font-medium transition-colors duration-(--duration-fast) ease-standard",
                active === option.key
                  ? "border-primary bg-surface-elevated text-foreground"
                  : "border-border text-muted hover:border-neural-purple/60 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </fieldset>
      </div>
      <p role="status" className="mt-3 text-small text-muted">
        {`${showing} ${count} ${of} ${total}`}
      </p>
    </div>
  );
}
