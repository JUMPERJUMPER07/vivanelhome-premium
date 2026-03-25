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
          className="animate-blob pointer-events-none absolute -right-20 -top-20 h-[800px] w-[800px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(6,182,212,0.3) 50%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] p-8 md:p-16">
          {/* Left Side: Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles size={14} className="text-[#a78bfa]" />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Seleção Premium VivanelHome
              </span>
            </div>

            <h1 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight md:text-8xl">
              Sua casa com <br />
              <span className="gradient-text">tecnologia</span>
              <span className="text-white/40 block text-4xl md:text-6xl mt-4 tracking-tighter">&amp; estilo</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/50 font-medium">
              Descubra os melhores achadinhos que transformam rotinas. Praticidade 
              inteligente curada todos os dias.
            </p>

            <div className="mt-16 flex flex-wrap items-center gap-12 text-white/10 uppercase tracking-[0.3em] text-[10px] font-black">
               {/* Stats removed as requested */}
               <span>Curadoria Exclusiva</span>
               <span className="h-1 w-1 rounded-full bg-white/20" />
               <span>Qualidade Premium</span>
            </div>
          </div>

          {/* Right Side: Integrated Carousel */}
          <div className="relative flex items-center justify-center">
             <div className="absolute -inset-20 bg-[var(--brand-primary)]/5 blur-[100px] rounded-full" />
             
             {featured.length > 0 ? (
               <div className="relative w-full max-w-[440px] perspective-1000">
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
                       
                       {/* Overlay Info directly in the visual box */}
                       <div className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md shadow-2xl translate-y-4 opacity-0 transition-all duration-500 group-hover/item:translate-y-0 group-hover/item:opacity-100">
                          <h3 className="text-sm font-black text-white uppercase tracking-wider text-center">
                            {featured[currentIndex].name}
                          </h3>
                       </div>
                    </div>

                    {/* Badge lateral flutuante */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/10 bg-[var(--brand-primary)] text-white shadow-2xl shadow-purple-500/40 rotate-12 group-hover/item:rotate-0 transition-transform duration-500">
                       <p className="text-[10px] font-black uppercase tracking-tighter">Por apenas</p>
                       <p className="text-lg font-black tracking-tighter">R$ {featured[currentIndex].price.toFixed(0)}</p>
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
