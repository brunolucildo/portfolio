"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Lista ordenada cujos itens entram conforme o scroll (SPEC-012, NEU-RF-20).
 * Sem JavaScript, sem IntersectionObserver ou com movimento reduzido, nada é
 * escondido: o atributo `data-revealing` só é ligado quando o efeito vai rodar.
 */
export function RevealList({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(list.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    list.dataset.revealing = "true";
    for (const item of items) observer.observe(item);

    return () => {
      observer.disconnect();
      delete list.dataset.revealing;
      for (const item of items) delete item.dataset.visible;
    };
  }, []);

  return (
    <ol ref={listRef} className={className} {...rest}>
      {children}
    </ol>
  );
}
