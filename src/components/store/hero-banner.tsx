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
    // Se não houver nada em destaque, pega os últimos 6 cadastrados para não ficar vazio
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

  return (
    <section className="relative mx-auto max-w-[1800px] px-4 pt-8 pb-4 sm:px-6 lg:px-12">
      <div className="group relative overflow-hidden rounded-[4rem] border border-white/8 bg-[#080f1f] text-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-all duration-700">
        {/* Unified Background Effect */}
        <div
          className="animate-pulse pointer-events-none absolute -right-40 -top-40 h-[1200px] w-[1200px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.1) 60%, transparent 80%)",
          }}
        />

        <div className="relative z-10 grid items-center gap-16 lg:grid-cols-[38%_62%] p-10 md:p-20">
          {/* Left Side: Content */}
          <div className="flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-xl">
              <Sparkles size={14} className="text-[#a78bfa]" />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Curadoria Premium 2026
              </span>
            </div>

            <h1 className="text-6xl font-black leading-[0.9] tracking-tighter md:text-8xl">
              Sua casa <br />
              <span className="gradient-text">inteligente</span>
              <span className="text-white/20 block text-4xl md:text-6xl mt-4 tracking-tighter">&amp; sofisticada</span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-white/40 font-medium">
              Achadinhos selecionados para transformar sua rotina com tecnologia e estilo.
            </p>

            <div className="mt-8 flex items-center gap-8 text-white/10 uppercase tracking-[0.4em] text-[9px] font-black">
               <span>Estilo Superior</span>
               <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
               <span>VIP Selection</span>
            </div>
          </div>

          {/* Right Side: Integrated Carousel */}
          <div className="relative w-full">
             <div className="absolute -inset-40 bg-[var(--brand-primary)]/5 blur-[120px] rounded-full" />
             
             {featured.length > 0 ? (
               <div className="relative w-full perspective-2000">
                  <Link href={`/produto/${featured[currentIndex].slug}`} className="block relative z-20 group/item">
                    <div className="overflow-hidden rounded-[3.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-700 group-hover/item:border-white/20 group-hover/item:shadow-[0_40px_100px_rgba(139,92,246,0.2)] shadow-2xl">
                       <ProductVisual 
                         product={featured[currentIndex]} 
                         forceRatio="16/9" 
                         className="rounded-[2.5rem] shadow-2xl transition-all duration-700 object-cover" 
                       />
                       
                       {/* Overlay Info - Clean & Floating */}
                       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] rounded-[2rem] border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover/item:bottom-12">
                          <h3 className="text-base font-black text-white uppercase tracking-wider text-center line-clamp-1">
                            {featured[currentIndex].name}
                          </h3>
                          <div className="mt-2 flex items-center justify-center gap-4">
                             <div className="h-px flex-1 bg-white/10" />
                             <span className="text-xl font-black text-[var(--brand-primary)]">R$ {featured[currentIndex].price.toFixed(2)}</span>
                             <div className="h-px flex-1 bg-white/10" />
                          </div>
                       </div>
                    </div>

                  </Link>

                  {/* Indicators */}
                  <div className="mt-12 flex justify-center items-center gap-3">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === currentIndex ? "w-12 bg-[var(--brand-primary)]" : "w-2 bg-white/10 hover:bg-white/20"
                        }`}
                        aria-label={`Ver item ${i + 1}`}
                      />
                    ))}
                  </div>
               </div>
             ) : (
                <div className="h-96 w-full rounded-[3rem] bg-white/5 animate-pulse" />
             )}
          </div>
        </div>
      </div>
    </section>
  );
}
