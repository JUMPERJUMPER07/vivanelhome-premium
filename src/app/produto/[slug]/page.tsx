import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/store/breadcrumbs";
import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import { ProductVisual } from "@/components/store/product-visual";
import { findProductBySlug, products } from "@/data/products";
import { findCustomProductBySlug, readCustomProducts } from "@/lib/custom-products";
import { currency, storeConfig } from "@/lib/store";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug) ?? (await findCustomProductBySlug(slug));

  if (!product) {
    return { title: "Produto nao encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = findProductBySlug(slug) ?? (await findCustomProductBySlug(slug));
  const customProducts = await readCustomProducts();
  const allProducts = [...customProducts, ...products];

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, 4);

  return (
    <main>
      <Header />

      <section className="mx-auto max-w-[2000px] px-4 py-8 sm:px-6 lg:px-12">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: product.category, href: `/categorias/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr] xl:gap-16">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ProductVisual product={product} large />
          </div>

          <div className="rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-2xl md:p-12">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--brand-accent)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-accent)] border border-[var(--brand-accent)]/20">
                {product.badge}
              </span>
              <span className="rounded-full bg-[var(--brand-primary)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                {product.category}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[var(--brand-text)] md:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--brand-muted)]">{product.description}</p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-[var(--brand-text)]">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-[var(--brand-muted)] font-medium">({product.reviewCount} avaliações de clientes)</span>
              {product.soldLabel && (
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-muted)]/30" />
                  <span className="text-sm font-bold text-[var(--brand-muted)]">{product.soldLabel}</span>
                </div>
              )}
            </div>

            <div className="mt-10 rounded-3xl bg-white/5 p-8 border border-white/5">
              {product.oldPrice > 0 && product.oldPrice > product.price && (
                <p className="text-sm font-medium text-[var(--brand-muted)] line-through">
                  de {currency.format(product.oldPrice)}
                </p>
              )}
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-5xl font-bold text-[var(--brand-primary)]">
                  {currency.format(product.price)}
                </span>
                {product.oldPrice > 0 && product.oldPrice > product.price && (
                  <span className="rounded-lg bg-[var(--brand-accent)] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-tight">
                    Economize {currency.format(product.oldPrice - product.price)}
                  </span>
                )}
              </div>
              {product.discountLabel && (
                <p className="mt-4 text-sm font-bold text-[var(--brand-accent)] uppercase tracking-wider">
                  {product.discountLabel} de desconto aplicado
                </p>
              )}
            </div>


            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href={product.affiliateUrl}
                target="_blank"
                className="group inline-flex flex-[2] items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[#7c3aed] px-8 py-5 text-lg font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:brightness-110 active:scale-95"
              >
                {product.cta}
                <ExternalLink size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/categorias/${product.categorySlug}`}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-base font-bold text-[var(--brand-text)] transition hover:bg-white/10"
              >
                Ver Categoria
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-1 text-[var(--brand-secondary)]" size={20} />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--brand-text)]">Venda Segura</p>
                  <p className="text-xs leading-relaxed text-[var(--brand-muted)]">
                    {storeConfig.affiliateDisclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
              Mais opcoes
            </p>
            <h2 className="mt-2 text-2xl font-black text-[var(--brand-text)] md:text-3xl">
              Continue explorando a vitrine
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
