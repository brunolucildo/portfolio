import type { TechnologyIcon as TechnologyIconData } from "@/config/technologies";

type TechnologyIconProps = {
  icon: TechnologyIconData;
};

/**
 * Ícone decorativo de uma tecnologia, sempre ao lado do nome em texto. O ícone
 * de marca é uma máscara do SVG versionado, pintada com a cor secundária (sem
 * cores de marca); o monograma é um quadrado com as iniciais, no mesmo tamanho
 * e tom (SPEC-005, seção 7.5).
 */
export function TechnologyIcon({ icon }: TechnologyIconProps) {
  if (icon.kind === "monogram") {
    return (
      <span
        aria-hidden="true"
        data-icon="monogram"
        className="grid size-6 shrink-0 place-items-center rounded-md border border-muted text-[0.6875rem] font-medium leading-none text-muted"
      >
        {icon.letters}
      </span>
    );
  }

  const mask = `url(/images/technologies/${icon.file}.svg)`;

  return (
    <span
      aria-hidden="true"
      data-icon="brand"
      className="block size-6 shrink-0 bg-muted"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
