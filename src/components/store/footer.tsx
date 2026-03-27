"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Music2, Heart } from "lucide-react";
import { storeConfig } from "@/lib/store";
import { Logo } from "./logo";
import { useStoreSettings } from "./store-settings-provider";

export function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="mt-24 relative overflow-hidden border-t border-[var(--brand-border)]">
      {/* Gradiente de fundo do footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-bg)] via-[#080f1f] to-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--brand-primary)]/5 blur-[80px] pointer-events-none" />

      <div className="relative mx-auto grid max-w-[2000px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.8fr_0.6fr_0.6fr] lg:px-12">
        {/* Coluna 1 — Marca */}
        <div className="space-y-6">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--brand-muted)]">
            {storeConfig.slogan}. Uma vitrine sofisticada, projetada para quem busca praticidade sem abrir mão do estilo. Curadoria diária dos melhores achadinhos para seu lar.
          </p>

          {/* Redes sociais */}
          <div className="flex items-center gap-3">
            <Link
              href={settings.instagramUrl || storeConfig.instagramUrl}
              target="_blank"
              aria-label="Instagram"
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-[var(--brand-muted)] transition hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href={settings.tiktokUrl || storeConfig.tiktokUrl}
              target="_blank"
              aria-label="TikTok"
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-[var(--brand-muted)] transition hover:border-[var(--brand-primary)]/40 hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)]"
            >
              <Music2 size={18} />
            </Link>
          </div>
        </div>

        {/* Coluna 2 — Legal */}
        <div className="space-y-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-[var(--brand-text)]">
            Legal
          </h4>
          <div className="grid gap-3 text-sm text-[var(--brand-muted)]">
            <Link href="/politica-de-privacidade" className="hover:text-[var(--brand-primary)] transition-colors w-fit">
              Políticas de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-[var(--brand-primary)] transition-colors w-fit">
              Termos de Uso
            </Link>
            <Link href="/aviso-de-afiliados" className="hover:text-[var(--brand-primary)] transition-colors w-fit">
              Aviso de Afiliados
            </Link>
          </div>
        </div>

        {/* Coluna 3 — Loja */}
        <div className="space-y-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-[var(--brand-text)]">
            Loja
          </h4>
          <div className="grid gap-3 text-sm text-[var(--brand-muted)]">
            <Link href="#catalogo" className="hover:text-[var(--brand-primary)] transition-colors w-fit">
              Catálogo Completo
            </Link>
          </div>
        </div>
      </div>

      {/* Rodapé final */}
      <div className="relative border-t border-[var(--brand-border)] bg-black/30 py-6">
        <div className="mx-auto flex max-w-[2000px] flex-col gap-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
          <p className="flex items-center gap-1.5">
            © 2026 VivanelHOME · Feito com{" "}
            <Heart size={11} className="text-rose-500 fill-rose-500" />
          </p>
          <p className="max-w-md text-center md:text-right opacity-50 normal-case text-[9px]">
            {storeConfig.affiliateDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
