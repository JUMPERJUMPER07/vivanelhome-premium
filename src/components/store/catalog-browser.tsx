"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgePercent, RotateCcw, Search, SlidersHorizontal, Star, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { storeConfig } from "@/lib/store";
import { ProductCard } from "./product-card";
import { SectionHeader } from "./section-header";

type CatalogBrowserProps = {
  products: Product[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function CatalogBrowser({
  products,
  searchValue,
  onSearchChange,
}: CatalogBrowserProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [flashOnly, setFlashOnly] = useState(false);
  const [cheapOnly, setCheapOnly] = useState(false);

  const router = useRouter();
  const search = searchValue ?? internalSearch;
  const deferredSearch = useDeferredValue(search);

  function updateSearch(value: string) {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }
    setInternalSearch(value);
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.shortDescription} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "featured" && product.isBestSeller) ||
        (selectedCategory === "flash" && product.isFlashDeal) ||
        (selectedCategory === "cheap" && product.price <= 29.9) ||
        product.categorySlug === selectedCategory ||
        product.iconKey === selectedCategory;

      const matchesFlash = !flashOnly || product.isFlashDeal;
      const matchesCheap = !cheapOnly || product.price <= 29.9;

      return matchesQuery && matchesCategory && matchesFlash && matchesCheap;
    });
  }, [cheapOnly, deferredSearch, flashOnly, products, selectedCategory]);

  // Auto-redirect if only one product remains and search is active
  useEffect(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (query.length >= 3 && filteredProducts.length === 1) {
      const timer = setTimeout(() => {
         router.push(`/produto/${filteredProducts[0].slug}`);
      }, 800); // 800ms of "stable" result before redirect
      return () => clearTimeout(timer);
    }
  }, [deferredSearch, filteredProducts, router]);

  function resetFilters() {
    updateSearch("");
    setSelectedCategory("all");
    setFlashOnly(false);
    setCheapOnly(false);
  }

  const tabItems = [
    { label: "Todos", id: "all", icon: undefined },
    { label: "Até 29,90", id: "cheap", icon: BadgePercent },
    ...storeConfig.categories.map(cat => ({ label: cat.name, id: cat.slug, icon: undefined }))
  ];

  return (
    <section id="catalogo" className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-12">
      {/* Tabs and Sidebar removed as requested */}
      <div className="w-full">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-black tracking-[0.2em] text-[var(--brand-text)] uppercase">
             {deferredSearch ? "Resultados da Busca" : "Coleção Completa"}
          </h2>
          <div className="h-1 w-12 bg-[var(--brand-primary)] rounded-full" />
          {deferredSearch ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-6 py-2 rounded-full border border-[var(--brand-primary)]/20 uppercase tracking-widest mt-2">
                 Buscando por: "{deferredSearch}"
              </p>
              <p className="text-[10px] font-bold text-[var(--brand-muted)] uppercase tracking-widest">{filteredProducts.length} itens encontrados</p>
            </div>
          ) : (
            <p className="text-sm font-bold text-[var(--brand-muted)] border border-white/10 px-6 py-2 rounded-full bg-white/5 uppercase tracking-widest mt-2">
               {filteredProducts.length} achadinhos selecionados
            </p>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[3rem] border border-dashed border-white/10 bg-white/5 p-16 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-white/20">
              <Zap size={40} className="text-[var(--brand-muted)]/30" />
            </div>
            <h3 className="text-2xl font-black text-[var(--brand-text)]">Estamos Preparando Novidades</h3>
            <p className="mt-3 text-[var(--brand-muted)] max-w-sm mx-auto text-sm font-medium">
              Esta categoria ainda não possui produtos cadastrados. Continue explorando nossos outros achadinhos especiais!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

