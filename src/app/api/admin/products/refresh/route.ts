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
        
        if (officialData && (officialData.productName || officialData.price)) {
          const updates: any = {};
          
          // Só atualiza se houver mudança real para evitar escritas desnecessárias
          if (officialData.productName && officialData.productName !== product.name) {
            updates.name = officialData.productName;
          }
          
          if (officialData.price && officialData.price !== product.price) {
            updates.price = officialData.price;
            // Se houver preço antigo na API, atualiza também
            if (officialData.priceBeforeDiscount) {
              updates.oldPrice = officialData.priceBeforeDiscount;
            }
          }

          if (Object.keys(updates).length > 0) {
            await updateCustomProduct(product.id, updates);
            results.updated++;
            results.logs.push(`✅ [Sincronizado] ${product.name.substring(0, 20)}...`);
          } else {
            results.logs.push(`ℹ️ [Sem alteração] ${product.name.substring(0, 20)}...`);
          }
        } else {
          results.failed++;
          results.logs.push(`⚠️ [Não encontrado na API] ${product.name.substring(0, 20)}...`);
        }
      } catch (err: any) {
        results.failed++;
        results.logs.push(`❌ [ERRO] ${product.name.substring(0, 15)}... : ${err.message || 'Falha na API'}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Erro ao atualizar produtos" }, { status: 500 });
  }
}
