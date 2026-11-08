import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { columns, measure } from "@/components/projects/layout";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getResumeFile, hasLocalizedResume } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";
import {
  fileNameOf,
  formatFileSize,
  formatResumeMonth,
  readPublicFileSize,
} from "./format";

const insideItems = [
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
] as const;

const textLinkClass = buttonStyles({ variant: "text", size: "md" });

/** Conteúdo da página Resume (SPEC-009): ações, dados do arquivo e o que o PDF traz. */
export async function ResumeContent() {
  const t = await getTranslations("resume");
  const tNav = await getTranslations("navigation");
  const current = await getLocale();
  const locale = hasLocale(routing.locales, current)
    ? current
    : routing.defaultLocale;

  const file = getResumeFile(locale);
  const localized = hasLocalizedResume(locale);
  const fileLocale = localized ? locale : routing.defaultLocale;
  // O aviso só faz sentido quando a página está em um idioma sem PDF próprio.
  const showLanguageNotice = !localized;
  const bytes = readPublicFileSize(file.href);

  const details: { label: string; value: string }[] = [
    { label: t("details.format"), value: t("details.formatValue") },
    { label: t("details.language"), value: t(`fileLanguage.${fileLocale}`) },
    {
      label: t("details.updated"),
      value: formatResumeMonth(file.updatedAt, locale),
    },
    ...(bytes === undefined
      ? []
      : [{ label: t("details.size"), value: formatFileSize(bytes, locale) }]),
  ];

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className={`mt-6 text-body-lg text-muted ${measure}`}>
            {t("intro")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <a
              href={file.href}
              target="_blank"
              rel="noopener noreferrer"
              hrefLang={fileLocale}
              className={buttonStyles({ variant: "secondary", size: "md" })}
            >
              {t("actions.view")}
              <span className="sr-only">
                {" — "}
                {t("details.formatValue")} {tNav("newTab")}
              </span>
            </a>
            <a
              href={file.href}
              download={fileNameOf(file.href)}
              hrefLang={fileLocale}
              className={textLinkClass}
            >
              {t("actions.download")}
            </a>
          </div>

          {showLanguageNotice ? (
            <p className="mt-4 text-small text-muted">{t("languageNotice")}</p>
          ) : null}

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-small text-muted">{label}</dt>
                <dd className="mt-1 text-body text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section
          id="resume-inside"
          aria-labelledby="resume-inside-title"
          className={cn(columns, "border-t border-border py-12 md:py-16")}
        >
          <h2 id="resume-inside-title" className="text-h3 text-foreground">
            {t("inside.title")}
          </h2>
          <ul className={cn("mt-4 flex flex-col gap-3 lg:mt-0", measure)}>
            {insideItems.map((item) => (
              <li key={item} className="text-body text-muted">
                <strong className="font-medium text-foreground">
                  {t(`inside.items.${item}.title`)}:
                </strong>{" "}
                {t(`inside.items.${item}.text`)}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border pt-10">
          <Link href="/experience" className={textLinkClass}>
            {t("links.experience")}
          </Link>
          <Link href="/contact" className={textLinkClass}>
            {t("links.contact")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
