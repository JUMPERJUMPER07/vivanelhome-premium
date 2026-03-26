import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { SectionHeader } from "@/components/store/section-header";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-bg)]">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader 
          eyebrow="Legal"
          title="Políticas de Privacidade"
          description="Saiba como protegemos seus dados e garantimos sua segurança ao navegar na VivanelHOME."
        />
        
        <div className="mt-12 space-y-10 text-[var(--brand-muted)] leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">1. Coleta de Informações</h2>
            <p>
              A VivanelHOME não coleta informações financeiras diretamente. Como somos uma vitrine de afiliados, 
              o processamento de pagamentos e a coleta de dados de faturamento ocorrem exclusivamente nas plataformas 
              parceiras (como a Shopee). Podemos coletar dados de navegação anonimizados 
              via cookies para melhorar sua experiência em nosso site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">2. Uso de Cookies</h2>
            <p>
              Utilizamos cookies para entender como os visitantes interagem com nossa vitrine, quais produtos são mais 
              populares e para garantir que os links de afiliados funcionem corretamente, permitindo que sejamos 
              comissionados pelas indicações sem qualquer custo adicional para você.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">3. Links de Terceiros</h2>
            <p>
              Nosso site contém links para sites externos. Não temos controle sobre as políticas de privacidade desses 
              sites e recomendamos que você as leia ao ser redirecionado para concluir uma compra.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">4. Segurança</h2>
            <p>
              Empregamos tecnologias de criptografia e camadas de segurança (SSL) para garantir que sua navegação 
              em nossa vitrine seja protegida e livre de riscos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">5. Alterações na Política</h2>
            <p>
              Esta política pode ser atualizada ocasionalmente para refletir mudanças em nossas práticas ou por razões 
              operacionais, legais ou regulatórias.
            </p>
          </section>

          <p className="pt-8 text-sm italic">Última atualização: 15 de Março de 2026.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
