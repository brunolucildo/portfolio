import { monogramResponse } from "@/lib/brand/monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone de tela de início do iPhone; o sistema arredonda os cantos. */
export default function AppleIcon() {
  return monogramResponse(size.width);
}
