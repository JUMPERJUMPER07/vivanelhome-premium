import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/data/products";
import { currency } from "@/lib/store";
import { ProductVisual } from "./product-visual";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card-glow group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2">
      {/* Imagem / Visual */}
      <div className="relative p-3">
        {/* Badge de desconto */}
        {product.discountLabel && (
          <div className="absolute left-5 top-5 z-10 flex items-center gap-1 rounded-full bg-[var(--brand-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-rose-500/30">
            {product.discountLabel}
          </div>
        )}

        {/* Badges de status */}
        <div className="absolute right-5 top-5 z-10 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-400 border border-amber-400/30">
              Top ⭐
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-400/30">
              Novo
            </span>
          )}
        </div>

        <ProductVisual product={product} />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        {/* Nome e descrição */}
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-black tracking-tight text-[var(--brand-text)] transition-colors group-hover:text-[var(--brand-primary)]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--brand-muted)]">
            {product.shortDescription}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 border border-amber-400/20">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-400">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-[var(--brand-muted)]">
            ({product.reviewCount} avaliações)
          </span>
          {product.soldLabel && (
            <>
              <span className="h-1 w-1 rounded-full bg-[var(--brand-muted)]/30" />
              <span className="text-[11px] font-bold text-[var(--brand-muted)]">{product.soldLabel}</span>
            </>
          )}
        </div>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-2xl font-black text-[var(--brand-primary)]">
            {currency.format(product.price)}
          </span>
          {product.oldPrice > 0 && product.oldPrice > product.price && (
            <span className="text-sm text-[var(--brand-muted)] line-through">
              {currency.format(product.oldPrice)}
            </span>
          )}
        </div>

        <div className={product.isCustom ? "pt-1 mt-auto" : "grid grid-cols-2 gap-2 pt-1 mt-auto"}>
          {!product.isCustom && (
            <Link
              href={`/produto/${product.slug}`}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/10 py-3 text-xs font-bold text-[var(--brand-text)] transition hover:bg-white/20"
            >
              Detalhes
            </Link>
          )}

          {(() => {
            // Default Shopee style
            let finalClasses = "bg-[#ff4d2d] text-white shadow-xl shadow-orange-500/20 ring-1 ring-orange-400/20";
            
            return (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-black shadow-lg transition hover:brightness-110 active:scale-95 flex-1 ${finalClasses}`}
              >
                Ver na Shopee ↗
              </a>
            );
          })()}
        </div>
      </div>
    </article>
  );
}
