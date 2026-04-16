"use client";

import { useMemo, useState } from "react";
import { CatalogBrowser } from "./catalog-browser";
import { CategoryStrip } from "./category-strip";
import { CustomProductsShelf } from "./custom-products-shelf";
import { FeaturedStoreLayout } from "./featured-store-layout";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeroBanner } from "./hero-banner";
import { ProductGrid } from "./product-grid";
import { StoreInsights } from "./store-insights";
import { ProductStoreProvider, useProductStore } from "./product-store-provider";
import type { Product } from "@/data/products";

function StorefrontContent() {
  const { allProducts } = useProductStore();
  const [search, setSearch] = useState("");
  
  return (
    <main className="min-h-screen bg-[#07070a]">
      <Header searchValue={search} onSearchChange={setSearch} />
      <HeroBanner />
      <CategoryStrip />
      
      {/* Authority Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 text-center backdrop-blur-xl">
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-medium leading-relaxed text-white/70 italic">
            "Selecionamos produtos úteis e bem avaliados que realmente ajudam no dia a dia, evitando compras desnecessárias e facilitando sua rotina."
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-transparent opacity-20" />
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute -top-24 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--brand-primary)]/5 to-transparent blur-3xl" />
        <CatalogBrowser products={allProducts} searchValue={search} onSearchChange={setSearch} />
      </div>

      <div className="mt-8">
        <StoreInsights />
      </div>

      <Footer />
    </main>
  );
}

export function StorefrontHome({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <ProductStoreProvider initialProducts={initialProducts}>
      <StorefrontContent />
    </ProductStoreProvider>
  );
}
