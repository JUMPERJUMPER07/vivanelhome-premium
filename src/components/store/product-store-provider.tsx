"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { products as defaultProducts } from "@/data/products";

type ProductInput = Omit<Product, "id" | "slug" | "reviewCount" | "rating"> & {
  reviewCount?: number;
  rating?: number;
};

type ProductStoreContextValue = {
  defaultProducts: Product[];
  customProducts: Product[];
  allProducts: Product[];
  isLoading: boolean;
  addProduct: (product: ProductInput, imageFile?: File | null) => Promise<void>;
  updateProduct: (productId: number, product: ProductInput, imageFile?: File | null, removeImage?: boolean) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
};

const ProductStoreContext = createContext<ProductStoreContextValue | null>(null);

export function ProductStoreProvider({ 
  children,
  initialProducts = []
}: { 
  children: React.ReactNode;
  initialProducts?: Product[];
}) {
  const [customProducts, setCustomProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/custom-products", { cache: "no-store" });
        const data = (await response.json()) as { products: Product[] };
        setCustomProducts(data.products ?? []);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

  async function addProduct(product: ProductInput, imageFile?: File | null) {
    const formData = new FormData();
    formData.set("name", product.name);
    formData.set("shortDescription", product.shortDescription);
    formData.set("description", product.description);
    formData.set("oldPrice", String(product.oldPrice));
    formData.set("price", String(product.price));
    formData.set("discountLabel", product.discountLabel);
    formData.set("category", product.category);
    formData.set("categorySlug", product.categorySlug);
    formData.set("affiliateUrl", product.affiliateUrl);
    formData.set("cta", product.cta);
    formData.set("badge", product.badge);
    formData.set("iconKey", product.iconKey);
    formData.set("rating", String(product.rating));
    formData.set("reviewCount", String(product.reviewCount));
    formData.set("soldLabel", product.soldLabel || "");
    formData.set("accentFrom", product.accentFrom);
    formData.set("accentTo", product.accentTo);
    formData.set("existingImageUrl", product.imageUrl ?? "");
    formData.set("removeImage", "false");

    if (imageFile) {
      formData.set("image", imageFile);
    }

    const response = await fetch("/api/custom-products", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = "Falha ao criar produto.";
      try {
        const errorData = await response.json();
        const serverError = errorData.error;
        if (serverError && typeof serverError === "object") {
          message = serverError.message || message;
          const details = serverError.details;
          if (details?.fieldErrors) {
            const field = Object.keys(details.fieldErrors)[0];
            const issue = Object.values(details.fieldErrors)[0];
            if (Array.isArray(issue) && issue[0]) {
              message = `${message}: (${field}) ${issue[0]}`;
            }
          }
        }
      } catch {
        // Fallback
      }
      throw new Error(message);
    }

    const data = (await response.json()) as { product: Product };
    setCustomProducts((current) => [data.product, ...current]);
  }

  async function updateProduct(
    productId: number,
    product: ProductInput,
    imageFile?: File | null,
    removeImage = false,
  ) {
    const formData = new FormData();
    formData.set("name", product.name);
    formData.set("shortDescription", product.shortDescription);
    formData.set("description", product.description);
    formData.set("oldPrice", String(product.oldPrice));
    formData.set("price", String(product.price));
    formData.set("discountLabel", product.discountLabel);
    formData.set("category", product.category);
    formData.set("categorySlug", product.categorySlug);
    formData.set("affiliateUrl", product.affiliateUrl);
    formData.set("cta", product.cta);
    formData.set("badge", product.badge);
    formData.set("iconKey", product.iconKey);
    formData.set("rating", String(product.rating));
    formData.set("reviewCount", String(product.reviewCount));
    formData.set("soldLabel", product.soldLabel || "");
    formData.set("accentFrom", product.accentFrom);
    formData.set("accentTo", product.accentTo);
    formData.set("existingImageUrl", product.imageUrl ?? "");
    formData.set("removeImage", String(removeImage));

    if (imageFile) {
      formData.set("image", imageFile);
    }

    const response = await fetch(`/api/custom-products/${productId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      let message = "Falha ao salvar produto.";
      try {
        const errorData = await response.json();
        const serverError = errorData.error;
        if (serverError && typeof serverError === "object") {
          message = serverError.message || message;
          const details = serverError.details;
          if (details?.fieldErrors) {
            const field = Object.keys(details.fieldErrors)[0];
            const issue = Object.values(details.fieldErrors)[0];
            if (Array.isArray(issue) && issue[0]) {
              message = `${message}: (${field}) ${issue[0]}`;
            }
          }
        }
      } catch {
        // Fallback
      }
      throw new Error(message);
    }

    const data = (await response.json()) as { product: Product };

    setCustomProducts((current) =>
      current.map((item) => (item.id === productId ? data.product : item)),
    );
  }

  async function removeProduct(productId: number) {
    const response = await fetch(`/api/custom-products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    setCustomProducts((current) => current.filter((item) => item.id !== productId));
  }

  const value = useMemo(
    () => {
      // Create a map of custom products by slug for easy lookup
      const customSlugs = new Set(customProducts.map(p => p.slug));
      
      // Filter out default products that have been "overridden" by a custom one with the same slug
      const uniqueDefaults = defaultProducts.filter(p => !customSlugs.has(p.slug));
      
      // Combine them: Custom products first, then remaining defaults
      return {
        defaultProducts,
        customProducts,
        allProducts: [...customProducts, ...uniqueDefaults],
        isLoading,
        addProduct,
        updateProduct,
        removeProduct,
      };
    },
    [customProducts, isLoading],
  );

  return <ProductStoreContext.Provider value={value}>{children}</ProductStoreContext.Provider>;
}

export function useProductStore() {
  const context = useContext(ProductStoreContext);

  if (!context) {
    throw new Error("useProductStore must be used inside ProductStoreProvider");
  }

  return context;
}
