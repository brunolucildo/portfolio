import type { ReactNode } from "react";
import { columns, measure } from "@/components/projects/layout";
import { cn } from "@/lib/utils/cn";

type ContactChannelSectionProps = {
  id: string;
  title: string;
  description: string;
  /** Endereço ou URL em texto selecionável; o currículo não tem valor. */
  value?: string;
  /** Linha de ações: links e, no e-mail, o botão Copiar. */
  children: ReactNode;
};

/** Seção de um canal da página Contact (CON-RF-01), no padrão editorial do site. */
export function ContactChannelSection({
  id,
  title,
  description,
  value,
  children,
}: ContactChannelSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(columns, "border-t border-border py-12 md:py-16")}
    >
      <h2 id={titleId} className="text-h3 text-foreground">
        {title}
      </h2>
      <div className="mt-4 lg:mt-0">
        <p className={cn("text-body text-muted", measure)}>{description}</p>
        {value ? (
          <p className="mt-4 text-body-lg break-words text-foreground select-all">
            {value}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
          {children}
        </div>
      </div>
    </section>
  );
}
