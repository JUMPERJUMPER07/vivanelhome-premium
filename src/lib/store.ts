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
    { name: "Shopee", slug: "shopee" },
    { name: "Roupa Feminina", slug: "roupa-feminina" },
    { name: "Roupa Masculina", slug: "roupa-masculina" },
    { name: "Roupa de Cama e Banho", slug: "cama-e-banho" },
    { name: "Acessórios", slug: "acessorios" },
    { name: "Televisores", slug: "televisores" },
    { name: "Cozinha Prática", slug: "cozinha-pratica" },
    { name: "Casa Organizada", slug: "casa-organizada" },
    { name: "Banheiro e Limpeza", slug: "banheiro-e-limpeza" },
    { name: "Eletro", slug: "eletro" },
    { name: "Eletrônico", slug: "eletronicos" },
    { name: "Saúde", slug: "saude" },
    { name: "Beleza", slug: "beleza" },
    { name: "Infantil", slug: "infantil" },
    { name: "Pet", slug: "pet" },
    { name: "Academia", slug: "academia" },
    { name: "Ferramentas", slug: "ferramentas" },
    { name: "Automotiva", slug: "automotiva" },
    { name: "Informática", slug: "informatica" },
  ],
};

export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
