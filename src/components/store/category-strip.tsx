import Link from "next/link";
import {
  ShoppingBag,
  Bath,
  CookingPot,
  Star,
  Flame,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { storeConfig } from "@/lib/store";

const categoryIcons = [
  ShoppingBag,
  Bath,
  CookingPot,
  Star,
  Flame,
  Lightbulb,
  Sparkles,
];

// Paleta feminina: rosas, mauves, uvas, pêssegos, fúcsias
const categoryThemes = [
  {
    gradient: "from-[#f9a8d4]/20 via-[#fce7f3]/5 to-transparent",
    border: "border-[#f472b6]/25",
    hoverBorder: "hover:border-[#f472b6]/60",
    icon: "text-[#ec4899]",
    iconBg: "bg-[#fce7f3]/20 border-[#f472b6]/20",
    dot: "bg-[#f472b6]",
    glow: "from-[#f472b6]/20",
    label: "text-[#f9a8d4]",
  },
  {
    gradient: "from-[#c4b5fd]/20 via-[#ede9fe]/5 to-transparent",
    border: "border-[#a78bfa]/25",
    hoverBorder: "hover:border-[#a78bfa]/60",
    icon: "text-[#a78bfa]",
    iconBg: "bg-[#ede9fe]/20 border-[#a78bfa]/20",
    dot: "bg-[#a78bfa]",
    glow: "from-[#a78bfa]/20",
    label: "text-[#c4b5fd]",
  },
  {
    gradient: "from-[#fdba74]/15 via-[#fff7ed]/5 to-transparent",
    border: "border-[#fb923c]/25",
    hoverBorder: "hover:border-[#fb923c]/55",
    icon: "text-[#fb923c]",
    iconBg: "bg-[#fff7ed]/20 border-[#fb923c]/20",
    dot: "bg-[#fb923c]",
    glow: "from-[#fb923c]/15",
    label: "text-[#fdba74]",
  },
  {
    gradient: "from-[#f0abfc]/20 via-[#fdf4ff]/5 to-transparent",
    border: "border-[#e879f9]/25",
    hoverBorder: "hover:border-[#e879f9]/60",
    icon: "text-[#e879f9]",
    iconBg: "bg-[#fdf4ff]/20 border-[#e879f9]/20",
    dot: "bg-[#e879f9]",
    glow: "from-[#e879f9]/20",
    label: "text-[#f0abfc]",
  },
  {
    gradient: "from-[#fda4af]/20 via-[#fff1f2]/5 to-transparent",
    border: "border-[#fb7185]/25",
    hoverBorder: "hover:border-[#fb7185]/60",
    icon: "text-[#fb7185]",
    iconBg: "bg-[#fff1f2]/20 border-[#fb7185]/20",
    dot: "bg-[#fb7185]",
    glow: "from-[#fb7185]/20",
    label: "text-[#fda4af]",
  },
  {
    gradient: "from-[#fcd34d]/15 via-[#fffbeb]/5 to-transparent",
    border: "border-[#fbbf24]/25",
    hoverBorder: "hover:border-[#fbbf24]/55",
    icon: "text-[#fbbf24]",
    iconBg: "bg-[#fffbeb]/20 border-[#fbbf24]/20",
    dot: "bg-[#fbbf24]",
    glow: "from-[#fbbf24]/15",
    label: "text-[#fcd34d]",
  },
  {
    gradient: "from-[#f9a8d4]/25 via-[#fbcfe8]/5 to-transparent",
    border: "border-[#f472b6]/30",
    hoverBorder: "hover:border-[#f472b6]/70",
    icon: "text-[#ec4899]",
    iconBg: "bg-[#fce7f3]/25 border-[#f472b6]/25",
    dot: "bg-[#ec4899]",
    glow: "from-[#ec4899]/25",
    label: "text-[#f9a8d4]",
  },
];

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Cabeçalho da seção */}
      <div className="mb-8 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#f472b6]" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f9a8d4]">
            Explore por categoria
          </p>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[var(--brand-text)]">
          O que você está buscando?
        </h2>
        <div className="h-px w-14 rounded-full bg-gradient-to-r from-[#f472b6] to-transparent mt-1" />
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {storeConfig.categories.map((category, index) => {
          const Icon = categoryIcons[index] || Sparkles;
          const theme = categoryThemes[index % categoryThemes.length];

          return (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className={`
                group relative flex flex-col items-center justify-center gap-4
                overflow-hidden rounded-3xl border p-6 text-center
                bg-gradient-to-br ${theme.gradient}
                ${theme.border} ${theme.hoverBorder}
                backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:-translate-y-2 hover:shadow-xl
              `}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 100%)`,
              }}
            >
              {/* Gradient overlay inner */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${theme.gradient} opacity-100`}
              />

              {/* Glow hover top */}
              <div
                className={`pointer-events-none absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-gradient-radial ${theme.glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60`}
              />

              {/* Ícone circular elegante */}
              <div
                className={`
                  relative z-10 flex h-14 w-14 items-center justify-center
                  rounded-2xl border ${theme.iconBg} ${theme.icon}
                  shadow-inner transition-all duration-300
                  group-hover:scale-110 group-hover:rotate-3
                `}
              >
                <Icon size={22} strokeWidth={1.8} />

                {/* Ponto brilhante no canto do ícone */}
                <span
                  className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--brand-bg)] ${theme.dot}`}
                />
              </div>

              {/* Nome da categoria */}
              <p
                className={`
                  relative z-10 text-[10px] font-black uppercase tracking-[0.18em]
                  text-[var(--brand-text)] transition-colors duration-200
                  group-hover:${theme.label}
                  leading-tight line-clamp-2
                `}
              >
                {/* Remove emoji para visual mais limpo */}
                {category.name.replace(/^[\u{1F300}-\u{1FAFF}\s]+/u, "").trim()}
              </p>

              {/* Linha decorativa inferior */}
              <div
                className={`
                  absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2
                  rounded-full bg-gradient-to-r from-transparent via-[${theme.dot.replace("bg-", "")}] to-transparent
                  transition-all duration-300 group-hover:w-3/4
                `}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
