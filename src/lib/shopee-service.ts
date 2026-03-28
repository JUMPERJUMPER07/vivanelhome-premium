import { createHmac } from "crypto";

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
   * Nota: Esta API usa uma assinatura SHA256 simples concatenando appid+timestamp+body+secret
   */
  static async graphqlRequest(query: string, variables: any = {}) {
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({ query, variables });
    
    const partnerId = PARTNER_ID || "";
    const secret = SECRET_KEY || "";
    
    // Assinatura específica do GraphQL: appid + timestamp + body + secret
    const signatureBase = `${partnerId}${timestamp}${body}${secret}`;
    const signature = createHash("sha256").update(signatureBase).digest("hex");
    
    // Novo formato de cabeçalho: Assinatura primeiro (visto em alguns SDKs oficiais)
    const authHeader = `SHA256 ${signature}, Credential=${partnerId}, Timestamp=${timestamp}`;
    
    const url = "https://open-api.affiliate.shopee.com.br/v1/graphql";
    
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
      throw new Error(result.errors[0].message || "Erro desconhecido no GraphQL da Shopee");
    }

    return result;
  }

  /**
   * Resolve links curtos (shope.ee) para links canônicos que a API aceita
   */
  private static async resolveUrl(url: string): Promise<string> {
    if (!url.includes("shope.ee")) return url;
    
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "follow" });
      return response.url;
    } catch {
      return url;
    }
  }

  /**
   * Busca detalhes de um produto pela URL usando a API de Afiliados
   */
  static async getOfferDetails(url: string) {
    const resolvedUrl = await this.resolveUrl(url);
    
    // TENTATIVA 1: API REST V2 (Pode exigir ShopID, mas tentamos como Public)
    try {
      // Extraímos o item_id se possível da URL
      const itemMatch = resolvedUrl.match(/i\.(\d+)\.(\d+)/);
      if (itemMatch) {
        const itemId = itemMatch[2];
        const path = "/api/v2/ams/get_item_list";
        
        const response = await this.request({
          path,
          method: "GET", // AMS v2 costuma ser GET para lista
        });
        
        if (response && response.data && response.data.list) {
          const item = response.data.list.find((i: any) => String(i.item_id) === itemId);
          if (item) {
            return {
              productName: item.item_name,
              productImageUrl: item.image_url,
              price: item.price,
              itemId: item.item_id,
            };
          }
        }
      }
    } catch (err) {
      console.warn("REST v2 falhou, tentando GraphQL...", err);
    }

    // TENTATIVA 2: API GraphQL (Mais comum para afiliados puros)
    const query = `
      query getOfferList($url: String!) {
        productOfferV2(url: $url) {
          nodes {
            productName
            imageUrl
            price
            priceBeforeDiscount
            itemId
          }
        }
      }
    `;

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
      console.error("GraphQL também falhou:", error);
      throw error;
    }
  }
}

import { createHash } from "crypto";
