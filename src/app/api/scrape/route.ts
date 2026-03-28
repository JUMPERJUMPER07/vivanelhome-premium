import { NextResponse } from "next/server";
import { ShopeeService } from "@/lib/shopee-service";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    // Tenta usar a API Oficial primeiro se for um link da Shopee
    if (url.includes("shopee") || url.includes("shope.ee")) {
      try {
        const officialData = await ShopeeService.getOfferDetails(url);
        if (officialData && officialData.productName) {
           return NextResponse.json({
            title: officialData.productName,
            image: officialData.productImageUrl,
            description: null, // API de oferta geralmente não traz descrição longa
            price: officialData.price?.toString().replace('.', ','),
            rating: "5.0", // API básica não traz rating, mas é 100% confiável no preço
            reviewCount: "1",
            soldCount: "Ver no Site",
            success: true,
            isOfficial: true
          });
        }
      } catch (apiError) {
        console.warn("Falha na API Oficial, tentando Scraper...", apiError);
      }
    }

    // Fallback para Scraper se a API falhar ou não for Shopee
    // Tenta buscar o conteúdo da página com um User-Agent que costuma ser aceito por scrapers de meta-tags
    const response = await fetch(url, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `O site ${new URL(url).hostname} recusou a conexão. Verifique o link.` }, { status: 500 });
    }

    const html = await response.text();

    // Funções auxiliares simples para extração por Regex
    const extractMeta = (patterns: RegExp[]) => {
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return match[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\\u002F/g, '/')
            .replace(/&#x27;/g, "'")
            .trim();
        }
      }
      return null;
    };

    // Estratégias múltiplas para capturar os dados
    const title = extractMeta([
      /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
      /<title[^>]*>([^<]+)<\/title>/i,
      /<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i,
      /item_name":\s*"([^"]+)"/i
    ]);
    
    // Imagem com fallback para padrões conhecidos da Shopee
    const image = extractMeta([
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i,
      /"image":\s*"([^"]+)"/i,
      /https:\/\/down-br\.img\.susercontent\.com\/file\/([a-z0-9_]+)/i
    ]);
    
    const description = extractMeta([
      /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="description"[^>]*content="([^"]+)"/i
    ]);

    // Busca de Preço - Prioridade para meta tags específicas de produto
    let priceFound = extractMeta([
      /<meta[^>]*property="product:price:amount"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="og:price:amount"[^>]*content="([^"]+)"/i,
      /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2}))/, // Padrão 1.234,56
      /R\$\s?(\d+[,.]\d{2})/, // Padrão 123,45
      /"price":\s*(\d+(?:\.\d+)?)/i,
      /"amount":\s*(\d+(?:\.\d+)?)/i
    ]);

    // Busca de Avaliações (Rating)
    const rating = extractMeta([
      /<meta[^>]*property="product:rating:average"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="og:rating:average"[^>]*content="([^"]+)"/i,
      /"ratingValue":\s*"?([\d.]+)"?/i,
      /rating_star":\s*([\d.]+)/i
    ]) || "5.0";

    const reviewCount = extractMeta([
      /<meta[^>]*property="product:rating:count"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="og:rating:count"[^>]*content="([^"]+)"/i,
      /"reviewCount":\s*"?(\d+)"?/i,
      /rating_count":\s*\[?(\d+)/i
    ]) || "1";

    // Busca de Vendidos (Sold)
    const soldCount = extractMeta([
      /(\d+)\s?vendidos/i,
      /(\d+)\s?sold/i,
      /historical_sold":\s*(\d+)/i,
      /show_sold":\s*(\d+)/i
    ]);

    return NextResponse.json({
      title: title?.replace(/\s*\|\s*Shopee\s*Brasil/i, ''),
      image,
      description: description?.substring(0, 3000),
      price: priceFound,
      rating,
      reviewCount,
      soldCount: soldCount ? `${soldCount}${Number(soldCount) > 1000 ? 'mil+' : ''} Vendidos` : null,
      success: !!title
    });

  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Erro interno ao processar o link" }, { status: 500 });
  }
}
