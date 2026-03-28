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
    
    const url = "https://open-api.affiliate.shopee.com.br/v1/graphql";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `SHA256 Credential=${partnerId},Timestamp=${timestamp},Signature=${signature}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Erro no GraphQL Shopee: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca detalhes de um produto pela URL usando a API de Afiliados
   */
  static async getOfferDetails(url: string) {
    const query = `
      query getOfferList($url: String!) {
        productOfferList(url: $url) {
          nodes {
            productName
            productImageUrl
            price
            priceBeforeDiscount
            discount
            shopName
            shopId
            itemId
            commissionRate
          }
        }
      }
    `;

    try {
      const result = await this.graphqlRequest(query, { url });
      return result.data?.productOfferList?.nodes?.[0] || null;
    } catch (error) {
      console.error("Erro ao buscar oferta via GraphQL:", error);
      return null;
    }
  }
}

import { createHash } from "crypto";
