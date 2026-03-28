import { NextResponse } from "next/server";
import { readCustomProducts, updateCustomProduct } from "@/lib/custom-products";
import { ShopeeService } from "@/lib/shopee-service";

export async function POST() {
  try {
    const products = await readCustomProducts();
    const shopeeProducts = products.filter(p => 
      p.affiliateUrl.includes("shopee") || p.affiliateUrl.includes("shope.ee")
    );

    const results = {
      total: shopeeProducts.length,
      updated: 0,
      failed: 0,
      logs: [] as string[]
    };

    for (const product of shopeeProducts) {
      try {
        const officialData = await ShopeeService.getOfferDetails(product.affiliateUrl);
        
        if (officialData && officialData.productName) {
          const updates: any = {
            name: officialData.productName,
            price: officialData.price || product.price,
            oldPrice: officialData.priceBeforeDiscount || product.oldPrice,
            // Mantemos a imagem original do usuário se existir, senão usamos a da API
            imageUrl: product.imageUrl || officialData.productImageUrl,
          };

          await updateCustomProduct(product.id, updates);
          results.updated++;
          results.logs.push(`✅ ${product.name.substring(0, 30)}... atualizado.`);
        } else {
          results.failed++;
          results.logs.push(`⚠️ ${product.name.substring(0, 30)}... sem dados na API.`);
        }
      } catch (err) {
        results.failed++;
        results.logs.push(`❌ Erro em ${product.name.substring(0, 30)}...`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Erro ao atualizar produtos" }, { status: 500 });
  }
}
