export type StoreSettings = {
  whatsappUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export const defaultStoreSettings: StoreSettings = {
  whatsappUrl: "https://wa.me/5500000000000",
  instagramUrl: "https://instagram.com/vivanelhome",
  tiktokUrl: "https://tiktok.com/@vivanelhome",
};

export const storeConfig = {
  name: "VivanelHOME",
  slogan: "Os melhores achadinhos para facilitar sua rotina",
  niche: "Casa, cozinha e organizacao",
  ...defaultStoreSettings,
  affiliateDisclaimer:
    "Alguns produtos podem direcionar voce para lojas parceiras. Se a compra for realizada por esses links, podemos receber uma comissao, sem custo extra para voce.",
  promoPhrases: [
    "Ofertas elegantes para o dia a dia",
    "Novidades com mais estilo e economia",
    "Praticidade para casa, treino e carro",
  ],
  categories: [
    { name: "🏠 Organização e praticidade", slug: "organizacao-praticidade" },
    { name: "🛁 Banheiro e conforto", slug: "banheiro-conforto" },
    { name: "🍽 Cozinha e dia a dia", slug: "cozinha-dia-a-dia" },
    { name: "✨ Itens que facilitam sua rotina", slug: "itens-rotina" },
    { name: "🔥 Mais vendidos", slug: "mais-vendidos" },
    { name: "💡 Achados úteis", slug: "achados-uteis" },
    { name: "👗 Moda Feminina", slug: "moda-feminina" },
  ],
};

export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const compactNumber = {
  format: (n: number) => {
    return new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n).replace(/\s/g, "").toLowerCase();
  }
};



