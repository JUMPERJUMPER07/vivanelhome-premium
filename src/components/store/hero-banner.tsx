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
          className="animate-pulse pointer-events-none absolute -right-40 -top-40 h-[1000px] w-[1000px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(6,182,212,0.2) 60%, transparent 80%)",
          }}
        />

        <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2 p-10 md:p-20 xl:p-28">
          {/* Left Side: Content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-black tracking-[0.3em] uppercase backdrop-blur-xl">
              <Sparkles size={16} className="text-[#a78bfa]" />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Seleção Ultra Premium 2026
              </span>
            </div>

            <h1 className="mt-10 text-7xl font-black leading-[0.95] tracking-tighter md:text-9xl xl:text-[10rem]">
              Sua casa <br />
              <span className="gradient-text">evoluída</span>
              <span className="text-white/30 block text-5xl md:text-7xl xl:text-8xl mt-6 tracking-tighter">&amp; sofisticada</span>
            </h1>

            <p className="mt-10 max-w-xl text-xl leading-relaxed text-white/40 font-medium">
              A curadoria definitiva de achadinhos inteligentes para transformar o seu dia a dia com estilo e praticidade.
            </p>

            <div className="mt-20 flex flex-wrap items-center gap-14 text-white/10 uppercase tracking-[0.4em] text-xs font-black">
               <span>Estilo Superior</span>
               <span className="h-2 w-2 rounded-full bg-white/10" />
               <span>Curadoria Exclusiva</span>
               <span className="h-2 w-2 rounded-full bg-white/10" />
               <span>Achadinhos VIP</span>
            </div>
          </div>

          {/* Right Side: Integrated Carousel */}
          <div className="relative flex items-center justify-center">
             <div className="absolute -inset-40 bg-[var(--brand-primary)]/10 blur-[120px] rounded-full" />
             
             {featured.length > 0 ? (
               <div className="relative w-full max-w-[620px] perspective-2000">
                  {/* Floating Elements Around Carousel */}
                  <div className="absolute -top-10 -right-10 animate-bounce duration-[3s] text-purple-500/30">
                     <Zap size={40} strokeWidth={1} />
                  </div>

                  <Link href={`/produto/${featured[currentIndex].slug}`} className="block relative z-20 group/item">
                    <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-500 group-hover/item:border-white/20 group-hover/item:scale-[1.02] shadow-2xl">
                       <ProductVisual 
                         product={featured[currentIndex]} 
                         forceRatio="4/5" 
                         className="rounded-[2.5rem] shadow-2xl grayscale-[0.2] group-hover/item:grayscale-0 transition-all duration-700" 
                       />
                       
                       {/* Overlay Info - Always visible */}
                       <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md shadow-2xl transition-all duration-500">
                          <h3 className="text-sm font-black text-white uppercase tracking-wider text-center line-clamp-1">
                            {featured[currentIndex].name}
                          </h3>
                          <div className="mt-2 flex items-center justify-center gap-2">
                             <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Oferta:</span>
                             <span className="text-sm font-black text-[var(--brand-primary)]">R$ {featured[currentIndex].price.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>

                  </Link>

                  {/* Indicators inside the banner flow */}
                  <div className="mt-10 flex justify-center items-center gap-4">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === currentIndex ? "w-10 bg-[var(--brand-primary)]" : "w-2 bg-white/10 hover:bg-white/20"
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
