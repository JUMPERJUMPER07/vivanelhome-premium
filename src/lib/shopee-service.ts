import { createHmac, createHash } from "crypto";

const PARTNER_ID = process.env.SHOPEE_PARTNER_ID;
const SECRET_KEY = process.env.SHOPEE_SECRET_KEY;
const BASE_URL = "https://partner.shopeemobile.com";

/**
 * Serviço para integração oficial com a API da Shopee (Open Platform v2)
 */
export class ShopeeService {
  private static generateSign(path: string, timestamp: number, accessToken?: string, shopId?: string): string {
    const partnerId = PARTNER_ID || "";
    const secret = SECRET_KEY || "";
    
    // Concatenação obrigatória pela Shopee v2: partner_id + path + timestamp + access_token + shop_id
    const baseString = `${partnerId}${path}${timestamp}${accessToken || ""}${shopId || ""}`;
    
    return createHmac("sha256", secret).update(baseString).digest("hex");
  }

  /**
   * Faz uma requisição autenticada para a Shopee
   */
  static async request({
    path,
    method = "GET",
    body = null,
    accessToken,
    shopId,
  }: {
    path: string;
    method?: "GET" | "POST";
    body?: any;
    accessToken?: string;
    shopId?: string;
  }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = this.generateSign(path, timestamp, accessToken, shopId);
    
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.append("partner_id", PARTNER_ID || "");
    url.searchParams.append("timestamp", timestamp.toString());
    url.searchParams.append("sign", sign);
    
    if (accessToken) url.searchParams.append("access_token", accessToken);
    if (shopId) url.searchParams.append("shop_id", shopId);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method === "POST" && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro na API da Shopee: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição para a API de Afiliados (GraphQL v1)
   */
  static async graphqlRequest(query: string, variables: any = {}) {
    const timestamp = Math.round(Date.now() / 1000);
    
    // IMPORTANTE: Minificar a query para garantir que o corpo do JSON seja previsível para a assinatura
    const minifiedQuery = query.replace(/\s+/g, ' ').trim();
    const body = JSON.stringify({ query: minifiedQuery, variables });
    
    const partnerId = PARTNER_ID || "";
    const secret = SECRET_KEY || "";
    
    // Assinatura: AppID + Timestamp + Body + SecretKey (SHA256 simples)
    const signatureBase = `${partnerId}${timestamp}${body}${secret}`;
    const signature = createHash("sha256").update(signatureBase).digest("hex");
    
    // Cabeçalho sem espaços extras conforme exemplos oficiais
    const authHeader = `SHA256 Credential=${partnerId},Timestamp=${timestamp},Signature=${signature}`;
    
    const url = "https://open-api.affiliate.shopee.com.br/graphql";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body,
    });

    const result = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message || "Erro no GraphQL");
    }

    return result;
  }

  /**
   * Resolve links curtos (shope.ee) para links canônicos que a API aceita
   */
  private static async resolveUrl(url: string): Promise<string> {
    if (!url.includes("shope.ee")) return url;
    
    try {
      // Usar um User-Agent para evitar bloqueio no redirecionamento
      const response = await fetch(url, { 
        method: "GET", // A Shopee às vezes exige GET para seguir o redirect total
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      return response.url;
    } catch (error) {
      console.warn("Erro ao resolver URL curta, usando original:", error);
      return url;
    }
  }

  /**
   * Busca detalhes de um produto pela URL usando a API de Afiliados
   */
  static async getOfferDetails(url: string) {
    const resolvedUrl = await this.resolveUrl(url);
    
    // TENTATIVA 1: API REST V2 (Pode exigir ShopID)
    try {
      const itemMatch = resolvedUrl.match(/i\.(\d+)\.(\d+)/);
      if (itemMatch) {
        const itemId = itemMatch[2];
        const path = "/api/v2/ams/get_item_list";
        const response = await this.request({ path, method: "GET" });
        if (response?.data?.list) {
          const item = response.data.list.find((i: any) => String(i.item_id) === itemId);
          if (item) return { productName: item.item_name, productImageUrl: item.image_url, price: item.price };
        }
      }
    } catch { /* Ignora e vai pro GraphQL */ }

    // TENTATIVA 2: API GraphQL (Minificada na fonte)
    const query = "query getOfferList($url: String!) { productOfferV2(url: $url) { nodes { productName imageUrl price priceBeforeDiscount itemId } } }";

    try {
      const result = await this.graphqlRequest(query, { url: resolvedUrl });
      const nodes = result.data?.productOfferV2?.nodes;
      if (!nodes || nodes.length === 0) return null;
      
      const node = nodes[0];
      return {
        productName: node.productName,
        productImageUrl: node.imageUrl,
        price: node.price,
        priceBeforeDiscount: node.priceBeforeDiscount,
        itemId: node.itemId,
      };
    } catch (error) {
      console.error("Ambos os métodos falharam:", error);
      throw error;
    }
  }
}
