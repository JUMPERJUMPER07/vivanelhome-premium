import type { Product } from "@/data/products";
import { getSupabaseStorageBucket, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type SupabaseProductRow = {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  old_price: number;
  price: number;
  discount_label: string;
  category: string;
  category_slug: string;
  affiliate_url: string;
  cta: string;
  badge: string;
  rating: number;
  review_count: number;
  sold_label: string | null;
  image_url: string | null;
  icon_key: Product["iconKey"];
  accent_from: string;
  accent_to: string;
  benefits: string[];
  is_best_seller: boolean;
  is_flash_deal: boolean;
  is_new: boolean;
  is_favorite: boolean;
  is_custom: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapRowToProduct(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    oldPrice: row.old_price,
    price: row.price,
    discountLabel: row.discount_label,
    category: row.category,
    categorySlug: row.category_slug,
    affiliateUrl: row.affiliate_url,
    cta: row.cta,
    badge: row.badge,
    rating: row.rating,
    reviewCount: row.review_count,
    soldLabel: row.sold_label ?? undefined,
    imageUrl: row.image_url ?? undefined,
    iconKey: row.icon_key,
    accentFrom: row.accent_from,
    accentTo: row.accent_to,
    benefits: row.benefits,
    isBestSeller: row.is_best_seller,
    isFlashDeal: row.is_flash_deal,
    isNew: row.is_new,
    isFavorite: row.is_favorite,
    isCustom: row.is_custom,
  };
}

function mapProductToRow(product: Omit<Product, "id"> | Product) {
  const maybeId = "id" in product ? product.id : undefined;

  return {
    ...(typeof maybeId === "number" ? { id: maybeId } : {}),
    slug: product.slug,
    name: product.name,
    short_description: product.shortDescription,
    description: product.description,
    old_price: product.oldPrice,
    price: product.price,
    discount_label: product.discountLabel,
    category: product.category,
    category_slug: product.categorySlug,
    affiliate_url: product.affiliateUrl,
    cta: product.cta,
    badge: product.badge,
    rating: product.rating,
    review_count: product.reviewCount,
    sold_label: product.soldLabel ?? "",
    image_url: product.imageUrl ?? null,
    icon_key: product.iconKey,
    accent_from: product.accentFrom,
    accent_to: product.accentTo,
    benefits: product.benefits,
    is_best_seller: Boolean(product.isBestSeller),
    is_flash_deal: Boolean(product.isFlashDeal),
    is_new: Boolean(product.isNew),
    is_favorite: Boolean(product.isFavorite),
    is_custom: Boolean(product.isCustom),
  };
}

export async function readCustomProducts() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("custom_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar produtos: ${error.message}`);
  }

  return (data as SupabaseProductRow[]).map(mapRowToProduct);
}

function getFileExtension(file: File) {
  const typeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  if (typeMap[file.type]) {
    return typeMap[file.type];
  }

  const originalName = "name" in file ? file.name : "";
  const ext = originalName.split(".").pop();
  return ext || "png";
}

export async function saveImageFile(file: File, productName: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase Storage nao configurado.");
  }

  const supabase = getSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();
  const ext = getFileExtension(file);
  const filePath = `products/${Date.now()}-${slugify(productName || "produto")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    contentType: file.type || "image/png",
    upsert: false,
  });

  if (error) {
    throw new Error(`Erro ao enviar imagem: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeImageFile(imageUrl?: string) {
  if (!imageUrl || !isSupabaseConfigured()) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();

  try {
    const pathname = new URL(imageUrl).pathname;
    const marker = `/storage/v1/object/public/${bucket}/`;
    const storagePath = pathname.includes(marker)
      ? pathname.split(marker)[1]
      : null;

    if (!storagePath) {
      return;
    }

    await supabase.storage.from(bucket).remove([storagePath]);
  } catch {
    // Ignora URLs malformadas ou arquivos inexistentes.
  }
}

export async function createCustomProduct(product: Omit<Product, "id" | "slug">) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase nao configurado para criar produtos.");
  }

  const supabase = getSupabaseAdminClient();

  // Usa UUID para garantir unicidade do slug mesmo em imports em lote simultâneos.
  // O ID numérico é gerado pelo bigserial do Supabase — sem risco de colisão.
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const slug = `${slugify(product.name || "produto")}-${suffix}`;

  const newProduct: Omit<Product, "id"> = {
    ...product,
    slug,
    isCustom: true,
  };

  const { data, error } = await supabase
    .from("custom_products")
    .insert(mapProductToRow(newProduct))
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar produto: ${error.message}`);
  }

  return mapRowToProduct(data as SupabaseProductRow);
}

export async function findCustomProductById(productId: number) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("custom_products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar produto: ${error.message}`);
  }

  return mapRowToProduct(data as SupabaseProductRow);
}

export async function updateCustomProduct(productId: number, product: Partial<Product>) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase nao configurado para atualizar produtos.");
  }

  const currentProduct = await findCustomProductById(productId);

  if (!currentProduct) {
    return null;
  }

  const updatedProduct: Product = {
    ...currentProduct,
    ...product,
    id: currentProduct.id,
    slug: currentProduct.slug,
    isCustom: true,
  };

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("custom_products")
    .update(mapProductToRow(updatedProduct))
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar produto: ${error.message}`);
  }

  return mapRowToProduct(data as SupabaseProductRow);
}

export async function deleteCustomProduct(productId: number) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase nao configurado para excluir produtos.");
  }

  const productToDelete = await findCustomProductById(productId);

  if (productToDelete?.imageUrl) {
    await removeImageFile(productToDelete.imageUrl);
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("custom_products").delete().eq("id", productId);

  if (error) {
    throw new Error(`Erro ao remover produto: ${error.message}`);
  }

  return productToDelete;
}

export async function findCustomProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return undefined;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("custom_products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return undefined;
    }
    throw new Error(`Erro ao buscar produto por slug: ${error.message}`);
  }

  return mapRowToProduct(data as SupabaseProductRow);
}
