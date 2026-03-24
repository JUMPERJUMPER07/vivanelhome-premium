"use client";

import { ChangeEvent, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  Save,
  Search,
  Trash2,
  Wand2,
  X,
  CheckCircle2, ExternalLink, ImagePlus, Pencil, PlusCircle, UploadCloud
} from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useProductStore } from "./product-store-provider";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const initialForm = {
  name: "",
  shortDescription: "",
  description: "",
  oldPrice: "",
  price: "",
  category: "Cozinha Pratica",
  categorySlug: "cozinha-pratica",
  affiliateUrl: "https://shopee.com.br/",
  cta: "Ver Produto",
  badge: "Novo",
  discountLabel: "",
  rating: "5.0",
  reviewCount: "1",
  soldLabel: "4mil+ Vendidos",
  iconKey: "package",
  imageUrl: "",
};

const categoryOptions = [
  { label: "Cozinha Prática", value: "cozinha-pratica" },
  { label: "Casa Organizada", value: "casa-organizada" },
  { label: "Banheiro e Limpeza", value: "banheiro-e-limpeza" },
  { label: "Eletro", value: "eletro" },
  { label: "Eletrônico", value: "eletronicos" },
  { label: "Saúde", value: "saude" },
  { label: "Beleza", value: "beleza" },
  { label: "Infantil", value: "infantil" },
  { label: "Pet", value: "pet" },
  { label: "Academia", value: "academia" },
  { label: "Ferramentas", value: "ferramentas" },
  { label: "Automotiva", value: "automotiva" },
  { label: "Informática", value: "informatica" },
];

const storeOptions = [
  { label: "Shopee", value: "shopee" },
  { label: "Amazon", value: "amazon" },
  { label: "Mercado Livre", value: "mercado-livre" },
];


export function ProductManager() {
  const { addProduct, allProducts, customProducts, removeProduct, updateProduct } = useProductStore();
  const [form, setForm] = useState(initialForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [importProgress, setImportProgress] = useState({ total: 0, current: 0, active: false, logs: [] as string[] });

  async function handleBatchImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    // Extraímos qualquer link que contenha http nas colunas do CSV (resolve o caso do link não estar na primeira coluna)
    const lines = text.split(/\r?\n/).map(l => {
      const match = l.match(/(https?:\/\/[^\s,;"']+)/);
      return match ? match[1] : "";
    }).filter(url => 
      url !== "" && (url.includes("shopee") || url.includes("shope.ee") || url.includes("amazon") || url.includes("amzn") || url.includes("mercadolivre") || url.includes("meli") || url.includes("ml"))
    );

    if (lines.length === 0) {
       setErrorMessage("O arquivo não contém links válidos da Shopee, Amazon ou ML.");
       return;
    }

    // Reset input
    event.target.value = '';
    
    setSuccessMessage("");
    setErrorMessage("");
    setImportProgress({ total: lines.length, current: 0, active: true, logs: [] });

    let successCount = 0;

    for (let i = 0; i < lines.length; i++) {
       const url = lines[i];
       const logPrefix = `[${i + 1}/${lines.length}]`;
       
       try {
         const storeMatch = url.includes("amazon") || url.includes("amzn") ? "amazon" : url.includes("meli") || url.includes("mercadolivre") ? "mercado-livre" : "shopee";
         
         const response = await fetch("/api/scrape", {
           method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url })
         });
         
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Erro no scraper");

         const cleanPrice = data.price ? String(data.price).replace(/[^\d.,]/g, "").replace(".", ",") : "0,00";
         let finalPrice = 0;
         
         if (cleanPrice !== "0,00") {
             let clean = cleanPrice;
             const lastDot = clean.lastIndexOf(".");
             const lastComma = clean.lastIndexOf(",");
             if (lastComma > lastDot) {
               clean = clean.replace(/\./g, "");
               const parts = clean.split(",");
               const dec = parts.pop();
               clean = parts.join("") + "." + dec;
             } else if (lastDot > lastComma) {
               clean = clean.replace(/,/g, "");
             }
             finalPrice = Number(clean) || 0;
         }

         const payload = {
           name: data.title || "Produto sem título importado",
           shortDescription: data.title ? data.title.substring(0, 120) : "Importado automaticamente",
           description: data.description ? data.description.substring(0, 3000) : "Sem descrição disponível.",
           oldPrice: 0,
           price: finalPrice > 0 ? finalPrice : 10,
           discountLabel: "",
           category: "Diversos", // Fallback, usaremos Casa Organizada
           categorySlug: "casa-organizada",
           affiliateUrl: url,
           cta: "Ver Produto",
           badge: "Novidade",
           iconKey: storeMatch as any,
           accentFrom: "#FF6000",
           accentTo: "#E63946",
           imageUrl: data.image || undefined,
           rating: 5,
           reviewCount: 1,
           soldLabel: "Em alta",
           benefits: [],
           isNew: true,
           isFavorite: true,
         };

         await addProduct(payload, null);
         successCount++;
         
         setImportProgress(p => ({ ...p, current: i + 1, logs: [`✅ ${logPrefix} ${payload.name.substring(0, 40)}...`, ...p.logs] }));
       } catch (err) {
         setImportProgress(p => ({ ...p, current: i + 1, logs: [`❌ ${logPrefix} Falha na URL: ${url.substring(0, 30)}...`, ...p.logs] }));
       }
    }

    setImportProgress(p => ({ ...p, active: false }));
    setSuccessMessage(`Importação concluída! ${successCount} produtos adicionados com sucesso.`);
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => {
      const updated = { ...current, [field]: value };
      
      // Auto-set categorySlug if category name matches
      if (field === "category") {
        const option = categoryOptions.find(o => o.label === value);
        if (option) updated.categorySlug = option.value;
      }
      
      return updated;
    });
  }

  function resetForm() {
    setForm(initialForm);
    setEditingProductId(null);
    setImageFile(null);
    setRemoveCurrentImage(false);
  }

  async function handleScrape() {
    if (!form.affiliateUrl || !form.affiliateUrl.startsWith("http")) {
      setErrorMessage("Insira um link válido para buscar os dados.");
      return;
    }

    setIsScraping(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.affiliateUrl }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao buscar dados.");
      // Atualiza os campos se encontrar dados
      console.log("Scraped data:", data);
      
      const cleanPrice = data.price 
        ? String(data.price).replace(/[^\d.,]/g, "").replace(".", ",") 
        : "";

      setForm(prev => ({
        ...prev,
        name: data.title || prev.name,
        description: (data.description || prev.description || "").substring(0, 3000),
        imageUrl: data.image || prev.imageUrl,
        price: cleanPrice || prev.price,
        shortDescription: data.title ? (data.title.substring(0, 120)) : prev.shortDescription,
      }));

      setSuccessMessage("Dados capturados com sucesso! Revise os campos preenchidos.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível puxar os dados automaticamente.");
    } finally {
      setIsScraping(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateField("imageUrl", result);
      setImageFile(file);
      setRemoveCurrentImage(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const selectedCategory = categoryOptions.find((item) => item.value === form.categorySlug);
    const sanitize = (val: string) => {
      if (!val) return 0;
      let clean = String(val).trim();
      const lastDot = clean.lastIndexOf(".");
      const lastComma = clean.lastIndexOf(",");
      
      if (lastComma > lastDot) {
        clean = clean.replace(/\./g, "");
        const parts = clean.split(",");
        const dec = parts.pop();
        clean = parts.join("") + "." + dec;
      } else if (lastDot > lastComma) {
        clean = clean.replace(/,/g, "");
      }
      return Number(clean) || 0;
    };
    const promoPrice = sanitize(form.price);
    const oldPrice = sanitize(form.oldPrice);

    const url = form.affiliateUrl.toLowerCase();
    const isAcceptedLink = 
      url.includes("shopee") || 
      url.includes("shope.ee") ||
      url.includes("amazon") ||
      url.includes("amzn") ||
      url.includes("mercadolivre") ||
      url.includes("meli.li") ||
      url.includes("meli.la");

    if (!isAcceptedLink) {
      setErrorMessage("Use um link válido da Shopee, Amazon ou Mercado Livre para o produto.");
      return;
    }

    if (promoPrice <= 0 || (oldPrice > 0 && promoPrice > oldPrice)) {
      setErrorMessage("Confira os precos: o promocional precisa ser maior que zero. Se o preço antigo for preenchido, deve ser maior que o promocional.");
      return;
    }

    const payload = {
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      oldPrice,
      price: promoPrice,
      discountLabel: form.discountLabel,
      category: selectedCategory?.label ?? form.category,
      categorySlug: form.categorySlug,
      affiliateUrl: form.affiliateUrl,
      cta: form.cta,
      badge: form.badge,
      iconKey: form.iconKey as
        | "chef-hat"
        | "sparkles"
        | "package"
        | "droplets"
        | "utensils"
        | "shield"
        | "bubbles"
        | "heart"
        | "flower-2"
        | "monitor"
        | "smartphone"
        | "tv"
        | "baby"
        | "paw"
        | "store"
        | "globe",
      accentFrom: "#FF6000",
      accentTo: "#E63946",
      imageUrl: form.imageUrl || undefined,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      soldLabel: form.soldLabel,
      benefits: [],
      isNew: true,
      isFavorite: true,
    };

    setIsSubmitting(true);

    try {
      if (editingProductId && String(editingProductId).length > 5) {
        // High IDs (> 5 chars) are likely DB IDs in this context or UUIDs
        await updateProduct(editingProductId, payload, imageFile, removeCurrentImage);
        resetForm();
        setSuccessMessage("Produto atualizado com sucesso.");
        return;
      }

      // If it's a sample (small ID) or a brand new one, we ADD a new record
      await addProduct(payload, imageFile);
      resetForm();
      setSuccessMessage("Produto 'Amostra' agora e um produto REAL na sua vitrine!");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel salvar o produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(product: Product) {
    // Only set ID if it's a real DB product (usually large numbers)
    // For samples, we leave editingProductId as null so it triggers "addProduct" on submit
    setEditingProductId(product.isCustom ? product.id : null);
    setErrorMessage("");
    setSuccessMessage("");
    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      oldPrice: product.oldPrice > 0 ? String(product.oldPrice).replace(".", ",") : "",
      price: String(product.price).replace(".", ","),
      category: product.category,
      categorySlug: product.categorySlug,
      affiliateUrl: product.affiliateUrl,
      cta: product.cta,
      badge: product.badge,
      discountLabel: product.discountLabel,
      iconKey: product.iconKey,
      imageUrl: product.imageUrl ?? "",
      rating: String(product.rating),
      reviewCount: String(product.reviewCount),
      soldLabel: product.soldLabel || "",
    });
    setImageFile(null);
    setRemoveCurrentImage(false);
    
    // Improved scrolling to capture the form's attention
    const formElement = document.getElementById("product-form-top");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(productId: number) {
    try {
      await removeProduct(productId);
      if (editingProductId === productId) {
        resetForm();
      }
      setSuccessMessage("Produto removido com sucesso.");
    } catch {
      setErrorMessage("Nao foi possivel remover o produto.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <form
        id="product-form-top"
        onSubmit={handleSubmit}
        className={`rounded-[2.5rem] border transition-all duration-500 bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-xl relative overflow-hidden ${
          editingProductId || form.name
            ? "border-[var(--brand-primary)] shadow-[0_0_40px_rgba(139,92,246,0.15)] ring-2 ring-[var(--brand-primary)]/20" 
            : "border-[var(--brand-border)]"
        }`}
      >
        <div className={`absolute -top-10 -left-10 h-40 w-40 blur-[60px] rounded-full transition-colors duration-500 ${
          editingProductId ? "bg-[var(--brand-primary)]/30" : "bg-[var(--brand-primary)]/10"
        }`} />
        
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              {editingProductId ? <Pencil size={16} /> : <PlusCircle size={16} />}
              {editingProductId ? "Modo de Edição Ativo" : "Novo Cadastro de Produto"}
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          {editingProductId && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <h1 className="text-2xl font-black text-[var(--brand-text)] line-clamp-1">
                <span className="text-[var(--brand-primary)]">Editando:</span> {form.name}
              </h1>
              <p className="text-xs text-[var(--brand-muted)] font-medium mt-1">
                Altere os campos abaixo e clique em "Salvar Alterações" para aplicar.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Nome Comercial</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: Luminária Inteligente RGB"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Headline (Curta)</span>
              <input
                required
                value={form.shortDescription}
                onChange={(event) => updateField("shortDescription", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: Transforme seu quarto com um clique"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Descrição Detalhada</span>
              <textarea
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows={4}
                maxLength={3000}
                className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Descreva os principais benefícios... (Até 3000 caracteres)"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Preço Original / Sem Desconto (Opcional)</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.oldPrice}
                onChange={(event) => updateField("oldPrice", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: 59,90"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Preço Atual / Real (R$)</span>
              <input
                required
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: 39,90"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Avaliação (0 a 5.0)</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: 4,9"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Qtd de Avaliações</span>
              <input
                type="number"
                min="0"
                value={form.reviewCount}
                onChange={(event) => updateField("reviewCount", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Vendas (Ex: 4mil+ Vendidos)</span>
              <input
                value={form.soldLabel}
                onChange={(event) => updateField("soldLabel", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: 4mil+ Vendidos"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Categoria</span>
              <select
                value={form.categorySlug}
                onChange={(event) => updateField("categorySlug", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0f172a]">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Loja / Marketplace</span>
              <select
                value={form.iconKey}
                onChange={(event) => updateField("iconKey", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
              >
                {storeOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0f172a]">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Texto do Selo</span>
              <input
                value={form.badge}
                onChange={(event) => updateField("badge", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: Mais Vendido"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Porcentagem OFF (Opcional)</span>
              <input
                value={form.discountLabel}
                onChange={(event) => updateField("discountLabel", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
                placeholder="Ex: -30% (Pode deixar em branco)"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <div className="flex items-center justify-between ml-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60">Link de Afiliado (Ex: Shopee)</span>
                <button
                  type="button"
                  onClick={handleScrape}
                  disabled={isScraping || !form.affiliateUrl}
                  className="flex items-center gap-2 rounded-lg bg-[var(--brand-primary)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary)]/20 disabled:opacity-30 border border-[var(--brand-primary)]/20"
                >
                  {isScraping ? (
                    <>Buscando...</>
                  ) : (
                    <>
                      <Wand2 size={12} />
                      Puxar Dados Automático
                    </>
                  )}
                </button>
              </div>
              <input
                required
                type="url"
                value={form.affiliateUrl}
                onChange={(event) => updateField("affiliateUrl", event.target.value)}
                className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08] text-[var(--brand-secondary)] font-medium"
                placeholder="https://shope.ee/..."
              />
            </label>

            <div className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Mídia do Produto</span>
              <div className="flex gap-4 items-start">
                <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 py-8 transition hover:bg-white/[0.08] hover:border-[var(--brand-primary)]/40 group/upload text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 transition-transform group-hover/upload:scale-110">
                    <ImagePlus size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--brand-text)]">Escolher Imagem</p>
                    <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-widest">PNG, JPG ou WEBP</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {form.imageUrl && (
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 group/preview">
                    <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover transition-transform group-hover/preview:scale-110" />
                    <button
                      type="button"
                      onClick={() => {
                        updateField("imageUrl", "");
                        setImageFile(null);
                        setRemoveCurrentImage(true);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-red-500/80 opacity-0 group-hover/preview:opacity-100 transition-opacity text-white font-bold text-[10px] uppercase tracking-widest"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex h-14 min-w-[200px] flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[#7c3aed] text-base font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {editingProductId ? <Pencil size={20} className="relative z-10" /> : <PlusCircle size={20} className="relative z-10" />}
              <span className="relative z-10">{isSubmitting ? "Gravando..." : editingProductId ? "Salvar Alterações" : "Publicar Produto"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="h-14 rounded-2xl border border-white/10 bg-white/5 px-8 text-sm font-bold text-[var(--brand-text)] transition hover:bg-white/10"
              >
                Descartar Edição
              </button>
            )}
          </div>

          {(successMessage || errorMessage) && (
            <div className={`mt-6 rounded-2xl p-4 text-center text-sm font-bold ${
              successMessage ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {successMessage || errorMessage}
            </div>
          )}
        </div>
      </form>

      <div className="space-y-8">
        <div className="rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold tracking-tight text-[var(--brand-text)]">Guia de Redação</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 font-bold text-xs border border-orange-500/20">01</div>
              <p className="text-sm leading-relaxed text-[var(--brand-muted)]">Use títulos chamativos que foquem na solução do problema.</p>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 font-bold text-xs border border-purple-500/20">02</div>
              <p className="text-sm leading-relaxed text-[var(--brand-muted)]">Verifique se o link da Shopee está correto para garantir seu comissionamento.</p>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 font-bold text-xs border border-cyan-500/20">03</div>
              <p className="text-sm leading-relaxed text-[var(--brand-muted)]">Escolha imagens com fundo limpo para destacar o produto na vitrine.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold tracking-tight text-[var(--brand-text)] flex items-center gap-2">
                <UploadCloud size={18} /> Importação em Lote (.csv)
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--brand-muted)] mb-4">
              Faça o upload de uma planilha contendo uma coluna com os links dos produtos (Shopee, Amazon ou ML). O sistema irá raspar e cadastrar um por um.
            </p>

            {importProgress.active ? (
              <div className="rounded-2xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 p-4">
                <div className="flex justify-between text-xs font-bold text-[var(--brand-text)] mb-2">
                  <span>Importando: {importProgress.current} de {importProgress.total}</span>
                  <span>{Math.round((importProgress.current / importProgress.total) * 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[#7c3aed] transition-all duration-300"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
                
                <div className="mt-4 max-h-24 overflow-y-auto space-y-1 custom-scrollbar text-[9px] font-mono text-[var(--brand-muted)]">
                  {importProgress.logs.map((log, idx) => (
                    <div key={idx} className="truncate">{log}</div>
                  ))}
                </div>
              </div>
            ) : (
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 transition hover:bg-white/10 hover:border-[var(--brand-primary)]/50">
                <UploadCloud size={16} className="text-[var(--brand-primary)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]">Escolher Arquivo CSV</span>
                <input type="file" accept=".csv" onChange={handleBatchImport} className="hidden" />
              </label>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-muted)]">Produtos na Vitrine</p>
              <span className="text-2xl font-black text-[var(--brand-primary)]">{customProducts.length}</span>
            </div>
            <Link
              href="/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs font-bold uppercase tracking-widest text-[var(--brand-text)] transition hover:bg-white/10"
            >
              <ExternalLink size={14} />
              Minha Vitrine Ao Vivo
            </Link>
          </div>
        </div>

        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {allProducts.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-white/10 p-12 text-center">
              <p className="text-sm font-medium text-[var(--brand-muted)] italic">Nenhum produto cadastrado até o momento.</p>
            </div>
          ) : (
            allProducts.map((product) => (
              <div
                key={`${product.isCustom ? 'c' : 's'}-${product.id}`}
                className={`group rounded-[2rem] border transition-all hover:bg-white/[0.08] p-5 border-white/5 ${
                  product.isCustom ? 'bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/20' : 'bg-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 relative">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    {product.isCustom ? (
                       <span className="absolute bottom-0 right-0 bg-[var(--brand-primary)] text-[8px] font-black px-1.5 py-0.5 text-white uppercase rounded-tl-lg shadow-lg">Real</span>
                    ) : (
                       <span className="absolute bottom-0 right-0 bg-white/20 text-[6px] font-black px-1.5 py-0.5 text-white uppercase rounded-tl-lg backdrop-blur-sm">Amostra</span>
                    )}
                  </div>
                   <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[var(--brand-text)]">{product.name}</h3>
                    <div className="flex items-center gap-2">
                       <p className="truncate text-[9px] font-black text-[var(--brand-primary)] uppercase tracking-wider">{product.iconKey}</p>
                       <span className="h-1 w-1 bg-white/20 rounded-full" />
                       <p className="truncate text-[9px] font-medium text-[var(--brand-muted)] uppercase tracking-wider">{product.category}</p>
                       {product.isCustom && <div className="h-1 w-1 bg-[var(--brand-primary)] rounded-full animate-pulse" />}
                    </div>
                    <p className="mt-1 truncate text-xs font-bold text-[var(--brand-primary)]">{currency.format(product.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[var(--brand-text)] transition hover:bg-white/10 group-hover:scale-110"
                      title={product.isCustom ? "Editar Produto" : "Transformar em Real"}
                    >
                      <Pencil size={18} />
                    </button>
                    {product.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition hover:bg-red-500/20 group-hover:scale-110"
                        title="Excluir Produto"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
