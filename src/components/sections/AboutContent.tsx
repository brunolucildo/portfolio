import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

/** Coluna estreita do título e coluna larga do texto, a partir de 1024 px. */
const columns = "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-12";

/**
 * Largura de leitura (ABOUT-RF-07): 624 px, abaixo do container de leitura de
 * 760 px, para ficar em cerca de 75 caracteres por linha. Em `rem`, e não em
 * `ch`, para valer igual na abertura e nos blocos, que têm tamanhos de fonte
 * diferentes do contêiner.
 */
const measure = "max-w-[39rem]";

const educationKeys = ["undergraduate", "postgraduate"] as const;

type AboutBlockProps = {
  id: string;
  title: string;
  children: ReactNode;
};

function AboutBlock({ id, title, children }: AboutBlockProps) {
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
      <div className={cn("mt-4 space-y-6 lg:mt-0", measure)}>{children}</div>
    </section>
  );
}

export async function AboutContent() {
  const t = await getTranslations("about");

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className={cn(columns, "pb-16 md:pb-20")}>
          <h1 className="text-h1 text-foreground lg:col-span-2">
            {t("title")}
          </h1>
          <p
            className={cn(
              "mt-6 text-body-lg text-muted lg:col-start-2",
              measure,
            )}
          >
            {t("intro")}
          </p>
        </header>

        <AboutBlock id="journey" title={t("journey.title")}>
          <p className="text-body-lg text-foreground">{t("journey.text")}</p>
          <p>
            <Link
              href="/experience"
              className={buttonStyles({ variant: "text", size: "md" })}
            >
              {t("journey.link")}
            </Link>
          </p>
        </AboutBlock>

        <AboutBlock id="craft" title={t("craft.title")}>
          <p className="text-body-lg text-foreground">{t("craft.text")}</p>
        </AboutBlock>

        <AboutBlock id="ai" title={t("ai.title")}>
          <p className="text-body-lg text-foreground">{t("ai.text")}</p>
          <p>
            <Link
              href="/ai-lab"
              className={buttonStyles({ variant: "text", size: "md" })}
            >
              {t("ai.link")}
            </Link>
          </p>
        </AboutBlock>

        <AboutBlock id="education" title={t("education.title")}>
          <ul className="space-y-6">
            {educationKeys.map((key) => (
              <li key={key}>
                <p className="text-body-lg text-foreground">
                  {t(`education.items.${key}.course`)}
                </p>
                <p className="mt-1 text-body text-muted">
                  {t(`education.items.${key}.institution`)}
                </p>
                <p className="mt-1 text-small text-muted">
                  {t(`education.items.${key}.period`)}
                </p>
              </li>
            ))}
          </ul>
        </AboutBlock>
      </Container>
    </div>
  );
}
