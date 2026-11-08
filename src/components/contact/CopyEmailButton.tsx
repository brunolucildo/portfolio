"use client";

import { useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";

type Status = "idle" | "copied" | "failed";

/** Tempo até o aviso voltar ao estado inicial (CON-RF-03). */
const RESET_MS = 3000;

type CopyEmailButtonProps = {
  address: string;
  /**
   * Textos vindos do servidor: o provedor de mensagens só envia ao navegador os
   * namespaces `navigation` e `languageSwitcher`.
   */
  labels: { copy: string; copied: string; failed: string };
};

/**
 * Botão que copia o endereço de e-mail (CON-RF-03 e CON-RF-04). Só aparece
 * quando a Clipboard API está disponível: sem JavaScript ou sem a API, a página
 * mostra apenas o endereço e o link `mailto:`, sem botão inoperante.
 *
 * Devolve dois itens da linha de ações: o botão e a região de status, que ocupa
 * a linha de baixo e reserva a altura para o aviso não deslocar o conteúdo.
 */
export function CopyEmailButton({ address, labels }: CopyEmailButtonProps) {
  const [canCopy, setCanCopy] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanCopy(typeof navigator.clipboard?.writeText === "function");

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    let next: Status = "copied";

    try {
      await navigator.clipboard.writeText(address);
    } catch {
      next = "failed";
    }

    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), RESET_MS);
  }

  if (!canCopy) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={buttonStyles({ variant: "secondary", size: "md" })}
      >
        {labels.copy}
      </button>
      <p role="status" className="min-h-6 basis-full text-small text-muted">
        {status === "copied" ? labels.copied : null}
        {status === "failed" ? labels.failed : null}
      </p>
    </>
  );
}
