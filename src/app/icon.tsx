import { monogramResponse } from "@/lib/brand/monogram";

/** Ícone do site: aba do navegador (32 px) e ícone grande (512 px). */
export function generateImageMetadata() {
  return [
    { id: "small", size: { width: 32, height: 32 }, contentType: "image/png" },
    {
      id: "large",
      size: { width: 512, height: 512 },
      contentType: "image/png",
    },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  return monogramResponse((await id) === "large" ? 512 : 32);
}
