import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";
import { SectionHeader } from "./section-header";

type ProductGridProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
};

export function ProductGrid({ id, eyebrow, title, description, products }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section id={id} className="mx-auto max-w-[2000px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
