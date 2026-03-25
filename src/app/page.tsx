import { StorefrontHome } from "@/components/store/storefront-home";
import { listCustomProducts } from "@/lib/product-service";

export const revalidate = 60; // Revalidate every minute para manter o DB e cache em sincronia

export default async function HomePage() {
  const initialProducts = await listCustomProducts();
  
  return <StorefrontHome initialProducts={initialProducts} />;
}
