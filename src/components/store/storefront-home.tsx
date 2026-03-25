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
      <StoreInsights />
      
      <div className="relative">
        <div className="absolute -top-24 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--brand-primary)]/5 to-transparent blur-3xl" />
        <CatalogBrowser products={allProducts} searchValue={search} onSearchChange={setSearch} />
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
