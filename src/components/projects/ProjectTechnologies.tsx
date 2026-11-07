import { getTranslations } from "next-intl/server";

type ProjectTechnologiesProps = {
  technologies: readonly string[];
};

/** Tecnologias em uma linha de texto discreta, sem níveis de proficiência. */
export async function ProjectTechnologies({
  technologies,
}: ProjectTechnologiesProps) {
  const t = await getTranslations("projects.labels");

  return (
    <div className="mt-6">
      <p className="text-small font-medium text-muted">{t("technologies")}</p>
      <ul
        aria-label={t("technologies")}
        className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-small text-muted"
      >
        {technologies.map((technology) => (
          <li
            key={technology}
            className="before:mr-2 before:content-['·'] first:before:content-none"
          >
            {technology}
          </li>
        ))}
      </ul>
    </div>
  );
}
