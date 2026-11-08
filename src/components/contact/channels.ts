import type { ContactChannels } from "@/config/site";

export type ContactChannelKey = "email" | "linkedin" | "github";

export type ContactChannel = {
  key: ContactChannelKey;
  /** Texto exibido: o endereço de e-mail ou a URL pública sem protocolo. */
  value: string;
  /** Destino do link principal. */
  href: string;
  /** Links de perfil abrem em nova aba; o `mailto:` não. */
  external: boolean;
};

/** Endereço público sem protocolo, `www` nem barra final (ex.: `github.com/user`). */
export function displayUrl(url: string): string {
  const { host, pathname } = new URL(url);
  return `${host.replace(/^www\./, "")}${pathname.replace(/\/$/, "")}`;
}

/**
 * Canais exibidos na página Contact, na ordem Email, LinkedIn e GitHub. Só os
 * definidos em `siteConfig.contact` entram (CON-RF-07).
 */
export function buildContactChannels(
  contact: ContactChannels,
): ContactChannel[] {
  const channels: ContactChannel[] = [];

  if (contact.email) {
    channels.push({
      key: "email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
    });
  }

  if (contact.linkedin) {
    channels.push({
      key: "linkedin",
      value: displayUrl(contact.linkedin),
      href: contact.linkedin,
      external: true,
    });
  }

  if (contact.github) {
    channels.push({
      key: "github",
      value: displayUrl(contact.github),
      href: contact.github,
      external: true,
    });
  }

  return channels;
}
