"use client";
// Hot reload trigger

import Link from "next/link";
import { BadgePercent, Menu, MessageCircle, Search, ShieldCheck, X } from "lucide-react";
import { storeConfig } from "@/lib/store";
import { Logo } from "./logo";
import { useStoreSettings } from "./store-settings-provider";
import { useState } from "react";

type HeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function Header({ searchValue = "", onSearchChange }: HeaderProps) {
  const { settings } = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-[rgba(2,6,23,0.85)] backdrop-blur-2xl">
      {/* Barra de anúncios topo */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)]/25 via-[var(--brand-secondary)]/12 to-transparent overflow-hidden relative">
        {/* Linha de brilho animada */}
        <div className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" style={{ backgroundSize: "200% 100%" }} />
        <div className="mx-auto flex max-w-[2000px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[10px] font-black tracking-wider uppercase sm:px-6 lg:px-12">
          <div className="inline-flex items-center gap-2 text-[var(--brand-text)]/90">
            <BadgePercent size={12} className="text-[var(--brand-primary)]" />
            Ofertas atualizadas diariamente
          </div>
          <div className="inline-flex items-center gap-2 text-[var(--brand-text)]/60">
            <ShieldCheck size={12} className="text-[var(--brand-secondary)]" />
            Pagamento seguro via parceiros
          </div>
        </div>
      </div>

      {/* Linha de brilho na base do header */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      <div className="mx-auto flex max-w-[2000px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-12">
        {/* Linha principal: logo + search + suporte */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-white/5 text-[var(--brand-text)] shadow-sm transition hover:bg-white/10 lg:hidden"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Logo compact />
          </div>

          {/* Search desktop */}
          <div className="relative hidden flex-1 lg:block max-w-2xl mx-auto">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
            />
            <input
              type="text"
              placeholder="Encontre o achadinho perfeito..."
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="h-11 w-full rounded-2xl border border-[var(--brand-border)] bg-white/5 pl-11 pr-12 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/8 focus:ring-2 focus:ring-[var(--brand-primary)]/15 placeholder:text-[var(--brand-muted)]/60"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange?.("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-white/5 text-[var(--brand-muted)] hover:text-white transition-colors"
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>

        {/* Search mobile */}
        <div className="relative lg:hidden">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
          />
          <input
            type="text"
            placeholder="Buscar achadinhos..."
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-10 w-full rounded-xl border border-[var(--brand-border)] bg-white/5 pl-11 pr-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/8 placeholder:text-[var(--brand-muted)]/60"
          />
        </div>

        {/* Nav de categorias */}
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {storeConfig.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="flex items-center gap-2 shrink-0 rounded-xl border border-[var(--brand-border)] bg-white/5 px-4 py-2 text-xs font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)]/40 hover:bg-[var(--brand-primary)]/8 hover:text-[var(--brand-primary)]"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
