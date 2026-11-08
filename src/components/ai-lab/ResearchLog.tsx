import { getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { Container } from "@/components/ui/Container";
import { experimentNumber, experimentsWithDetail } from "@/config/aiLab";
import { Link } from "@/i18n/navigation";
import { RevealList } from "./RevealList";

/**
 * Research Log (SPEC-012, NEU-RF-19 e NEU-RF-20): linha vertical com os
 * experimentos que têm página, na ordem da lista e sem datas. Cada registro
 * reaproveita o resumo (contexto) e o aprendizado já aprovados na SPEC-006.
 */
export async function ResearchLog() {
  const t = await getTranslations("aiLab");

  return (
    <section
      id="research-log"
      aria-labelledby="research-log-title"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <h2 id="research-log-title" className="text-h2 text-foreground">
          {t("neural.log.title")}
        </h2>
        <p className={`mt-6 text-body-lg text-muted ${measure}`}>
          {t("neural.log.intro")}
        </p>

        <RevealList className="neural-log mt-14">
          {experimentsWithDetail.map(({ key, slug }) => (
            <li
              key={key}
              className="neural-log-item relative pb-14 pl-10 last:pb-0 md:pl-14"
            >
              <span aria-hidden="true" className="neural-log-dot" />
              <p className="text-caption tracking-[0.18em] text-muted">
                {experimentNumber(key)}
              </p>
              <h3 className="mt-2 text-h3 text-foreground">
                {t(`experiments.${key}.name`)}
              </h3>
              <div className={`mt-4 space-y-3 ${measure}`}>
                <p className="text-body text-muted">
                  <span className="font-medium text-foreground">
                    {t("neural.log.context")}:{" "}
                  </span>
                  {t(`experiments.${key}.summary`)}
                </p>
                <p className="text-body text-muted">
                  <span className="font-medium text-foreground">
                    {t("labels.learned")}:{" "}
                  </span>
                  {t(`experiments.${key}.learned`)}
                </p>
              </div>
              <Link
                href={{ pathname: "/ai-lab/[slug]", params: { slug } }}
                className="mt-4 inline-flex min-h-11 items-center text-small font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("neural.log.read")}
                <span className="sr-only">
                  {" — "}
                  {t(`experiments.${key}.name`)}
                </span>
              </Link>
            </li>
          ))}
        </RevealList>
      </Container>
    </section>
  );
}
