import {
  Baby,
  ChefHat,
  Droplets,
  Flower2,
  Globe,
  HeartPulse,
  Monitor,
  Package,
  PawPrint,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SprayCan,
  ShoppingBag,
  Tv,
  UtensilsCrossed,
  Shirt,
  Watch,
  Bed,
} from "lucide-react";
import type { Product } from "@/data/products";

const categoryThemes: Record<string, { from: string; to: string }> = {
  "roupa-feminina": { from: "#fdf2f8", to: "#ec4899" },
  "roupa-masculina": { from: "#eff6ff", to: "#3b82f6" },
  "cama-e-banho": { from: "#f0fdf4", to: "#22c55e" },
  acessorios: { from: "#fffbeb", to: "#f59e0b" },
  televisores: { from: "#1e1b4b", to: "#6366f1" },
  "cozinha-pratica": { from: "#111111", to: "#7c3aed" },
  "casa-organizada": { from: "#f5f3ff", to: "#8b5cf6" },
  "banheiro-e-limpeza": { from: "#1f1438", to: "#a855f7" },
  "utilidades-do-dia-a-dia": { from: "#111111", to: "#6d28d9" },
  academia: { from: "#111111", to: "#9333ea" },
  ferramentas: { from: "#27272a", to: "#7c3aed" },
  automotiva: { from: "#0f172a", to: "#8b5cf6" },
  "mais-vendidos": { from: "#111111", to: "#7c3aed" },
  eletro: { from: "#0f172a", to: "#3b82f6" },
  eletronicos: { from: "#1e1b4b", to: "#4f46e5" },
  saude: { from: "#450a0a", to: "#ef4444" },
  beleza: { from: "#4c1d95", to: "#d946ef" },
  informatica: { from: "#020617", to: "#334155" },
  shopee: { from: "#ee4d2d", to: "#f53d2d" },
  smartphone: { from: "#09090b", to: "#27272a" },
  infantil: { from: "#fdf2f8", to: "#f472b6" },
  pet: { from: "#fff7ed", to: "#f97316" },
};

const icons: Record<string, any> = {
  "chef-hat": ChefHat,
  droplets: Droplets,
  package: Package,
  shield: ShieldCheck,
  sparkles: Sparkles,
  bubbles: SprayCan,
  utensils: UtensilsCrossed,
  heart: HeartPulse,
  "flower-2": Flower2,
  monitor: Monitor,
  smartphone: Smartphone,
  tv: Tv,
  baby: Baby,
  paw: PawPrint,
  store: ShoppingBag,
  globe: Globe,
  shopee: ShoppingBag,
  shirt: Shirt,
  watch: Watch,
  bed: Bed,
};

type ProductVisualProps = {
  product: Product;
  large?: boolean;
  forceRatio?: string;
  className?: string;
};

export function ProductVisual({ product, large = false, forceRatio, className }: ProductVisualProps) {
  const Icon = icons[product.iconKey] || ShoppingBag;
  const hasCustomImage = Boolean(product.imageUrl);
  const palette = categoryThemes[product.categorySlug] ?? {
    from: "#111111",
    to: "#8b5cf6",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/70 bg-white ${className || ""}`}
      style={{
        background: `linear-gradient(140deg, ${palette.from}, ${palette.to})`,
        aspectRatio: forceRatio || "auto",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_32%)]" />
      <div
        className={`relative flex items-end justify-between ${
          large ? "min-h-[340px] p-8 md:min-h-[420px]" : "min-h-[210px] p-5"
        }`}
      >
        {hasCustomImage ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </>
        ) : (
          <>
            <div className="max-w-[65%] rounded-[1.5rem] border border-white/35 bg-white/15 p-4 text-white backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Achadinho Top
              </p>
              <h3 className={`${large ? "mt-3 text-3xl" : "mt-2 text-xl"} font-black leading-tight`}>
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-white/85">{product.shortDescription}</p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/35 bg-white/20 text-white shadow-2xl backdrop-blur-sm md:h-28 md:w-28">
              <Icon size={large ? 52 : 42} strokeWidth={2.2} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
