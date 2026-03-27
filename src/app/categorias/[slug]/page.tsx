import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/store/breadcrumbs";
import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { ProductCard } from "@/components/store/product-card";
import { products } from "@/data/products";
import { readCustomProducts } from "@/lib/custom-products";
import { storeConfig } from "@/lib/store";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = storeConfig.categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: "Categoria nao encontrada" };
  }

  return {
    title: category.name,
    description: `Ofertas e achadinhos da categoria ${category.name} na Achadinhos Top.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = storeConfig.categories.find((item) => item.slug === slug);
  const customProducts = await readCustomProducts();
  const allProducts = [...customProducts, ...products];

  if (!category) {
    notFound();
  }

  const categoryProducts =
    slug === "mais-vendidos"
      ? allProducts.filter((product) => product.isBestSeller)
      : slug === "promocoes-do-dia"
        ? allProducts.filter((product) => product.isFlashDeal)
        : allProducts.filter((product) => 
            product.categorySlug === slug || product.iconKey === slug
          );

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-[2000px] px-4 py-8 sm:px-6 lg:px-12">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Categorias", href: "/" },
            { label: category.name },
          ]}
        />

        <div className="mt-8 rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-xl md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand-primary)]">
            Explorar Categoria
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--brand-text)] md:text-6xl">
            {category.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--brand-muted)]">
            Produtos uteis, bonitos e com otimo custo-beneficio
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
