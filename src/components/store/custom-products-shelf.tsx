"use client";

import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";

type CustomProductsShelfProps = {
  products: Product[];
  isLoading?: boolean;
};

export function CustomProductsShelf({ products, isLoading = false }: CustomProductsShelfProps) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[1.25rem] border border-white/8 bg-[var(--brand-surface)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-orange)]">
            Vitrine personalizada
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--brand-text)]">
            Carregando produtos salvos
          </h2>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[2000px] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-orange)]">
          Destaques da loja
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--brand-text)] md:text-3xl">
          Selecao especial em destaque
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
