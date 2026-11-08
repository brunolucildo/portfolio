"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { mainNavigation } from "@/config/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";

const MENU_ID = "mobile-menu";

function isActivePath(current: string, href: string): boolean {
  return href === "/"
    ? current === "/"
    : current === href || current.startsWith(`${href}/`);
}

/**
 * Botão secundário que leva à página do currículo (SPEC-009, RES-RF-07). Na
 * página do currículo, a borda passa para a cor primary (LAY-RF-04). O alvo de
 * toque tem 44 px (LAY-RF-12); o `!` vence o `min-h-9` do tamanho `sm`.
 */
function ResumeLink({
  active,
  onNavigate,
}: {
  active: boolean;
  onNavigate: () => void;
}) {
  const t = useTranslations("navigation");

  return (
    <Link
      href="/resume"
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={buttonStyles({
        variant: "secondary",
        size: "sm",
        className: cn("min-h-11!", active && "border-primary!"),
      })}
    >
      {t("resume")}
    </Link>
  );
}

export function HeaderNav() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  // Guarda a rota em que o menu foi aberto: ao navegar, ele fecha sem effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fechar também ao acionar o link da página atual, que não muda a rota
  // (LAY-RF-06).
  const closeMenu = () => setOpenPath(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
        buttonRef.current?.focus();
      }
    }

    // Ao chegar à largura do desktop, o painel não faz mais sentido: fecha,
    // para não reaparecer aberto ao voltar ao celular (LAY-RF-07).
    const desktop = window.matchMedia("(min-width: 64rem)");
    function onViewportChange(event: MediaQueryListEvent) {
      if (event.matches) setOpenPath(null);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open]);

  const resumeActive = isActivePath(pathname, "/resume");

  const links = mainNavigation.map(({ key, href }) => {
    const active = isActivePath(pathname, href);

    return (
      <li key={key}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={closeMenu}
          className={cn(
            "inline-flex min-h-11 items-center text-small font-medium transition-colors duration-(--duration-fast) ease-standard",
            active
              ? "text-foreground underline decoration-primary decoration-2 underline-offset-8"
              : "text-muted hover:text-foreground",
          )}
        >
          {t(`items.${key}`)}
        </Link>
      </li>
    );
  });

  return (
    <>
      <nav aria-label={t("label")} className="hidden lg:block">
        <ul className="flex items-center gap-6">{links}</ul>
      </nav>

      <div className="hidden items-center gap-4 lg:flex">
        <LanguageSwitcher />
        <ResumeLink active={resumeActive} onNavigate={closeMenu} />
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpenPath(open ? null : pathname)}
        className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors duration-(--duration-fast) ease-standard hover:bg-surface-elevated lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        id={MENU_ID}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background lg:hidden"
      >
        <div className="mx-auto w-full max-w-main px-5 py-6 md:px-6">
          <nav aria-label={t("label")}>
            <ul className="flex flex-col gap-1">{links}</ul>
          </nav>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
            <LanguageSwitcher />
            <ResumeLink active={resumeActive} onNavigate={closeMenu} />
          </div>
        </div>
      </div>
    </>
  );
}
