"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Flame, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useProductStore } from "./product-store-provider";
import { ProductVisual } from "./product-visual";

const stats = [
  { value: "+2.4k", label: "Clientes felizes" },
  { value: "98%", label: "Satisfação" },
  { value: "Diária", label: "Curadoria" },
];
export function HeroBanner() {
  const { allProducts } = useProductStore();
  const featured = (() => {
    const explicitlyFeatured = allProducts.filter(p => p.isBestSeller || p.isFlashDeal);
    if (explicitlyFeatured.length > 0) return explicitlyFeatured.slice(0, 6);
    return allProducts.slice(0, 6);
  })();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];

  return (
    <section className="relative mx-auto max-w-[1800px] px-4 pt-8 pb-4 sm:px-6 lg:px-12">
      <div className="group relative overflow-hidden rounded-[3rem] border border-white/8 bg-[#080f1f] text-white shadow-2xl transition-all duration-700">
        {/* Unified Background Effect — Restored Glow */}
        <div
          className="animate-pulse pointer-events-none absolute -right-20 -top-20 h-[800px] w-[800px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.1) 60%, transparent 80%)",
          }}
        />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 p-8 md:p-12 lg:p-16">
          {/* Left Side: Sophisticated Content */}
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-xl">
              <Sparkles size={14} className="text-[#a78bfa]" />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Curadoria Premium 2026
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[0.9] tracking-tighter md:text-7xl">
              Sua casa <br />
              <span className="gradient-text">inteligente</span>
              <span className="text-white/20 block text-3xl md:text-5xl mt-3 tracking-tighter">&amp; sofisticada</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-white/40 font-medium">
              Achadinhos selecionados para transformar sua rotina com tecnologia e estilo.
            </p>

            <div className="mt-4 flex items-center gap-8 text-white/10 uppercase tracking-[0.4em] text-[8px] font-black">
               <span>Estilo Superior</span>
               <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
               <span>VIP Selection</span>
            </div>
          </div>

          {/* Right Side: Big Product Frame */}
          <div className="relative flex items-center justify-center p-4">
             <Link href={`/produto/${current.slug}`} className="relative block w-full max-w-lg transform transition-transform duration-500 hover:scale-[1.02]">
                <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl group-hover:border-white/20 transition-all">
                   <ProductVisual 
                     product={current} 
                     forceRatio="1/1" 
                     objectFit="contain"
                     imagePadding="1rem"
                     className="rounded-[2.5rem] shadow-2xl bg-white" 
                   />
                   
                   {/* Overlay Info - Modern & Clean */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] rounded-[2rem] border border-white/10 bg-black/70 p-5 backdrop-blur-xl shadow-2xl transition-all duration-500">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider text-center line-clamp-1">
                        {current.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-center gap-3">
                         <div className="h-px flex-1 bg-white/10" />
                         <span className="text-lg font-black text-[var(--brand-primary)]">R$ {current.price.toFixed(2)}</span>
                         <div className="h-px flex-1 bg-white/10" />
                      </div>
                   </div>
                </div>
             </Link>
          </div>
        </div>

        {/* Navigation Arrows — Discretely Styled */}
        <button 
          onClick={() => setCurrentIndex(prev => (prev - 1 + featured.length) % featured.length)}
          className="absolute left-4 top-1/2 z-30 flex -translate-y-1/2 h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/50 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={() => setCurrentIndex(prev => (prev + 1) % featured.length)}
          className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/50 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          <ArrowRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
           {featured.map((_, i) => (
             <button
               key={i}
               onClick={() => setCurrentIndex(i)}
               className={`h-1 rounded-full transition-all duration-500 ${
                 i === currentIndex ? "w-8 bg-[var(--brand-primary)]" : "w-1.5 bg-white/20"
               }`}
             />
           ))}
        </div>
      </div>
    </section>
  );
}
