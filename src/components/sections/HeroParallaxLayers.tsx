"use client";

import { useEffect, useRef } from "react";

/**
 * Camadas decorativas do parallax do Hero (SPEC-001, HOME-RF-07 e HOME-RF-14).
 *
 * Onde o navegador suporta scroll-driven animations, o movimento é puro CSS
 * (globals.css) e este componente não registra nenhum listener. Nos demais
 * (ex.: Firefox), aplica o mesmo movimento por JavaScript, lendo os valores das
 * variáveis `--parallax-*` do CSS para não divergir dele.
 */
export function HeroParallaxLayers() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll()")
    ) {
      return;
    }

    const layers = {
      back: root.querySelector<HTMLElement>('[data-parallax-layer="back"]'),
      mid: root.querySelector<HTMLElement>('[data-parallax-layer="mid"]'),
      front: root.querySelector<HTMLElement>('[data-parallax-layer="front"]'),
    };
    const tokens = getComputedStyle(document.documentElement);
    const token = (name: string) =>
      Number.parseFloat(tokens.getPropertyValue(name)) || 0;
    const shifts = {
      back: token("--parallax-shift-back"),
      mid: token("--parallax-shift-mid"),
      front: token("--parallax-shift-front"),
    };
    const rangeVh = token("--parallax-range-vh");
    const rotateEnd = token("--parallax-rotate-front");

    const wide = window.matchMedia("(min-width: 64rem)");
    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );

    let active = false;
    let frame = 0;
    let range = 1;
    let rotateStart = 0;

    const apply = () => {
      frame = 0;
      const progress = Math.min(Math.max(window.scrollY / range, 0), 1);
      for (const key of ["back", "mid", "front"] as const) {
        layers[key]?.style.setProperty(
          "transform",
          `translate3d(0, ${-shifts[key] * progress}px, 0)`,
        );
      }
      layers.front?.style.setProperty(
        "rotate",
        `${rotateStart + (rotateEnd - rotateStart) * progress}deg`,
      );
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    const measure = () => {
      range = Math.max((window.innerHeight * rangeVh) / 100, 1);
      schedule();
    };

    const activate = () => {
      if (active) return;
      active = true;
      rotateStart = Number.parseFloat(
        layers.front ? getComputedStyle(layers.front).rotate : "0",
      );
      if (Number.isNaN(rotateStart)) rotateStart = 0;
      range = Math.max((window.innerHeight * rangeVh) / 100, 1);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
      root.dataset.parallaxFallback = "active";
      apply();
    };

    const deactivate = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      for (const layer of Object.values(layers)) {
        layer?.style.removeProperty("transform");
        layer?.style.removeProperty("rotate");
      }
      delete root.dataset.parallaxFallback;
    };

    const sync = () => {
      if (wide.matches && motionOk.matches) activate();
      else deactivate();
    };

    sync();
    wide.addEventListener("change", sync);
    motionOk.addEventListener("change", sync);

    return () => {
      wide.removeEventListener("change", sync);
      motionOk.removeEventListener("change", sync);
      deactivate();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div
        data-parallax-layer="back"
        className="hero-parallax hero-parallax-back absolute -top-32 -right-40 size-[58rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_30%,transparent),transparent)]"
      />
      <div
        data-parallax-layer="mid"
        className="hero-parallax hero-parallax-mid absolute top-8 right-[1%] size-[42rem] rounded-full border-2 border-primary/30"
      />
      <div
        data-parallax-layer="front"
        className="hero-parallax hero-parallax-front absolute top-[66%] left-[55%] size-24 rotate-12 rounded-lg border-2 border-primary/70 bg-primary/10"
      />
    </div>
  );
}
