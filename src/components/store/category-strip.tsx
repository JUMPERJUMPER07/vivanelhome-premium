import Link from "next/link";
import {
  Bath,
  Boxes,
  CookingPot,
  Flame,
  Lightbulb,
  Shirt,
  Sparkles,
} from "lucide-react";
import { storeConfig } from "@/lib/store";

const categoryIcons = [
  Boxes,
  Bath,
  CookingPot,
  Sparkles,
  Flame,
  Lightbulb,
  Shirt,
];

const categoryColors = [
  { bg: "from-blue-500/20 to-cyan-500/5", icon: "text-blue-400", hover: "hover:border-blue-500/40" },
  { bg: "from-teal-500/20 to-emerald-500/5", icon: "text-teal-400", hover: "hover:border-teal-500/40" },
  { bg: "from-orange-500/20 to-amber-500/5", icon: "text-orange-400", hover: "hover:border-orange-500/40" },
  { bg: "from-purple-500/20 to-pink-500/5", icon: "text-purple-400", hover: "hover:border-purple-500/40" },
  { bg: "from-rose-500/20 to-red-500/5", icon: "text-rose-400", hover: "hover:border-rose-500/40" },
  { bg: "from-yellow-500/20 to-amber-500/5", icon: "text-yellow-400", hover: "hover:border-yellow-500/40" },
  { bg: "from-pink-500/20 to-fuchsia-500/5", icon: "text-pink-400", hover: "hover:border-pink-500/40" },
];

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {storeConfig.categories.map((category, index) => {
          const Icon = categoryIcons[index] || Sparkles;
          const theme = categoryColors[index] || categoryColors[0];

          return (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-gradient-to-br ${theme.bg} p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 ${theme.hover}`}
            >
              {/* Glow no hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-[2rem]" />

              {/* Ícone */}
              <div
                className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 ${theme.icon} transition-all duration-300 group-hover:scale-110`}
              >
                <Icon size={24} />
              </div>

              {/* Nome */}
              <p className={`text-[11px] font-black uppercase tracking-widest text-[var(--brand-text)] transition-colors group-hover:${theme.icon}`}>
                {category.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
