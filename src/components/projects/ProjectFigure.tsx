import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { imageSource, type ProjectImage } from "@/config/projects";
import { cn } from "@/lib/utils/cn";
import { measure } from "./layout";

type ProjectFigureProps = {
  images: readonly ProjectImage[];
  /** Chave da legenda em `projects.captions`. */
  caption: "reelix" | "fintalab" | null;
  className?: string;
};

/**
 * Imagens de um projeto com a legenda visível (PROJ-RF-15). Telas de celular
 * (retrato) ficam estreitas; telas de computador (paisagem) dividem a largura.
 * Largura e altura declaradas evitam deslocamento de layout, e as imagens
 * carregam sob demanda.
 */
export async function ProjectFigure({
  images,
  caption,
  className,
}: ProjectFigureProps) {
  if (images.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const t = await getTranslations("projects");
  const portrait = (images[0]?.height ?? 0) > (images[0]?.width ?? 0);
  const single = images.length === 1;

  return (
    <figure className={className}>
      <div
        className={cn(
          "grid gap-4",
          portrait && single && "max-w-60",
          portrait && !single && "max-w-[46rem] md:grid-cols-3",
          !portrait && "md:grid-cols-3",
        )}
      >
        {images.map((image) => (
          <Image
            key={image.alt}
            src={imageSource(image, locale)}
            alt={t(`images.${image.alt}`)}
            width={image.width}
            height={image.height}
            sizes={
              portrait
                ? "(min-width: 768px) 245px, 240px"
                : "(min-width: 1024px) 300px, (min-width: 768px) 30vw, 100vw"
            }
            className={cn(
              "h-auto w-full rounded-lg border border-border",
              portrait && !single && "max-w-60 md:max-w-none",
            )}
          />
        ))}
      </div>
      {caption ? (
        <figcaption className={cn("mt-3 text-small text-muted", measure)}>
          {t(`captions.${caption}`)}
        </figcaption>
      ) : null}
    </figure>
  );
}
