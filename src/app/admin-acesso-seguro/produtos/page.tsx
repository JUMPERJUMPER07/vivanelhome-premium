import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/store/breadcrumbs";
import { AdminLogoutButton } from "@/components/store/admin-logout-button";
import { ProductManager } from "@/components/store/product-manager";
import { StoreSettingsManager } from "@/components/store/store-settings-manager";
import { CollaboratorManager } from "@/components/store/collaborator-manager";
import { ADMIN_PRODUCTS_PATH } from "@/lib/admin-routes";

export const metadata: Metadata = {
  title: "Painel de produtos",
  description: "Cadastre produtos com link da Shopee, Amazon e Mercado Livre para a vitrine da VivanelHOME.",
};

export default function ProductPanelPage() {
  return (
    <section className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Painel", href: ADMIN_PRODUCTS_PATH },
          { label: "Produtos" },
        ]}
      />

      <div className="mt-5 rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 backdrop-blur-md shadow-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              Cadastro manual
            </p>
            <h1 className="mt-3 text-3xl font-black text-[var(--brand-text)] tracking-tight md:text-5xl">
              Adicione produtos e links da Shopee, Amazon e Mercado Livre
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--brand-muted)]">
              Preencha o formulário abaixo com o produto e o link do anúncio. Quando o cliente clicar no botão da oferta, ele será direcionado para a loja correspondente usando a URL cadastrada.
            </p>
          </div>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ProductManager />
        <div className="grid gap-6 auto-rows-min">
          <StoreSettingsManager />
          <CollaboratorManager />
        </div>
      </div>
    </section>
  );
}
