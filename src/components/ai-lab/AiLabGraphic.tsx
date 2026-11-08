/**
 * Elemento gráfico abstrato do cabeçalho do AI Lab (SPEC-006, seção 6.1):
 * camadas geométricas em tom secundário, decorativas e estáticas. Aparece só a
 * partir de 1024 px, onde sobra espaço ao lado do texto.
 */
export function AiLabGraphic() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 240"
      className="pointer-events-none absolute top-0 right-0 hidden size-60 text-border lg:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <rect
        x="40"
        y="40"
        width="160"
        height="160"
        rx="12"
        transform="rotate(-9 120 120)"
      />
      <rect x="60" y="60" width="120" height="120" rx="10" />
      <rect
        x="80"
        y="80"
        width="80"
        height="80"
        rx="8"
        transform="rotate(9 120 120)"
      />
      <circle cx="120" cy="120" r="24" />
      <line x1="0" y1="120" x2="96" y2="120" />
      <line x1="144" y1="120" x2="240" y2="120" />
      <circle cx="120" cy="120" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
