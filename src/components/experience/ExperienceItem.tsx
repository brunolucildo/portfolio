import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { ExperienceRole } from "@/config/experience";
import { cn } from "@/lib/utils/cn";
import { formatMonth } from "@/lib/utils/format-month";

/**
 * Largura de leitura (EXP-RNF-05): 624 px, como no About, para ficar abaixo de
 * 80 caracteres por linha.
 */
const measure = "max-w-[39rem]";

type ItemListProps = {
  items: readonly string[];
  /** Conquistas recebem o marcador em verde-limão e peso de fonte maior. */
  highlight?: boolean;
};

function ItemList({ items, highlight = false }: ItemListProps) {
  return (
    <ul className="mt-3 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "relative pl-5 text-body text-foreground",
            "before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-full",
            highlight ? "font-medium before:bg-primary" : "before:bg-muted",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-small font-medium text-muted">{children}</h3>;
}

type ExperienceItemProps = {
  role: ExperienceRole;
};

/**
 * Uma entrada da linha do tempo (DESIGN_SYSTEM 4.7). O trilho com o marcador
 * é decorativo; a ordem de leitura é período, cargo, contexto, responsabilidades,
 * conquistas e tecnologias.
 */
export async function ExperienceItem({ role }: ExperienceItemProps) {
  const locale = await getLocale();
  const t = await getTranslations("experience");
  const isCurrent = role.end === null;

  const responsibilities = t.raw(
    `roles.${role.key}.responsibilities`,
  ) as string[];
  const achievements = role.hasAchievements
    ? (t.raw(`roles.${role.key}.achievements`) as string[])
    : [];

  return (
    <li
      className={cn(
        "group grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4",
        "lg:grid-cols-[12rem_1.25rem_minmax(0,1fr)] lg:gap-x-6",
      )}
    >
      <div
        aria-hidden="true"
        className="relative col-start-1 row-span-2 row-start-1 lg:col-start-2 lg:row-span-1"
      >
        <span className="absolute top-2 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border group-last:hidden" />
        <span
          className={cn(
            "absolute top-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full border-2 border-primary",
            isCurrent ? "bg-primary" : "bg-background",
          )}
        />
      </div>

      <p className="col-start-2 row-start-1 text-small text-muted lg:col-start-1 lg:pt-1.5">
        <time dateTime={role.start}>{formatMonth(locale, role.start)}</time>
        {" – "}
        {role.end ? (
          <time dateTime={role.end}>{formatMonth(locale, role.end)}</time>
        ) : (
          t("present")
        )}
      </p>

      <div
        className={cn(
          "col-start-2 row-start-2 pb-14 group-last:pb-0 lg:col-start-3 lg:row-start-1",
          measure,
        )}
      >
        <h2 className="mt-1 text-h3 text-foreground lg:mt-0">
          {t(`roles.${role.key}.title`)}
        </h2>
        <p className="mt-3 text-body-lg text-foreground">
          {t(`roles.${role.key}.context`)}
        </p>

        <Label>{t("labels.responsibilities")}</Label>
        <ItemList items={responsibilities} />

        {achievements.length > 0 ? (
          <>
            <Label>{t("labels.achievements")}</Label>
            <ItemList items={achievements} highlight />
          </>
        ) : null}

        <Label>{t("labels.technologies")}</Label>
        <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-small text-muted">
          {role.technologies.map((technology) => (
            <li
              key={technology}
              className="before:mr-2 before:content-['·'] first:before:content-none"
            >
              {technology}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
