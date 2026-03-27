import Link from "next/link";
import { ArrowRight, CarFront, Dumbbell, Home, Wrench } from "lucide-react";

const collections = [
  {
    title: "Casa pronta para o dia a dia",
    badge: "Coleção principal",
    href: "/categorias/casa-organizada",
    icon: Home,
    points: ["Organização bonita", "Peças úteis", "Visual clean"],
    gradient: "from-violet-900/80 via-[#0d0a1e] to-[#0a0a12]",
    accent: "text-violet-400",
    iconBg: "bg-violet-500/20 border-violet-500/30",
    badgeBg: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    pillBg: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
    btnStyle: "bg-white text-[#0f172a] hover:bg-violet-50",
    featured: true,
  },
  {
    title: "Treino e rotina ativa",
    badge: "Academia",
    href: "/categorias/academia",
    icon: Dumbbell,
    points: ["Faixas e acessórios", "Home gym", "Praticidade"],
    gradient: "from-[#080f1f] to-[#080f1f]",
    accent: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    pillBg: "bg-white/5 text-[var(--brand-muted)] border border-white/8",
    btnStyle: "border border-white/10 bg-white/5 text-[var(--brand-text)] hover:bg-white/10",
    featured: false,
  },
  {
    title: "Ferramentas e automotiva",
    badge: "Casa e carro",
    href: "/categorias/ferramentas",
    icon: Wrench,
    points: ["Pequenos reparos", "Itens úteis", "Mais autonomia"],
    gradient: "from-[#080f1f] to-[#080f1f]",
    accent: "text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pillBg: "bg-white/5 text-[var(--brand-muted)] border border-white/8",
    btnStyle: "border border-white/10 bg-white/5 text-[var(--brand-text)] hover:bg-white/10",
    featured: false,
  },
];

const extraFeatures = [
  {
    icon: Dumbbell,
    title: "Academia",
    description: "Produtos para treino, mobilidade e rotina ativa.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Wrench,
    title: "Ferramentas",
    description: "Mais praticidade para pequenos reparos e ajustes.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: CarFront,
    title: "Automotiva",
    description: "Itens úteis para deixar o carro mais organizado.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function FeaturedStoreLayout() {
  return (
    <section className="mx-auto max-w-[2000px] px-4 py-12 sm:px-6 lg:px-12">
      {/* Cabeçalho */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-[var(--brand-primary)] to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--brand-primary)]">
              Coleções em destaque
            </p>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--brand-text)] md:text-4xl">
            Setores montados como loja real
          </h2>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-[var(--brand-primary)]/60 to-transparent" />
        </div>
      </div>

      {/* Coleções */}
      <div className="grid gap-4 lg:grid-cols-3">
        {collections.map((collection) => {
          const Icon = collection.icon;

          return (
            <article
              key={collection.title}
              className={`group relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-gradient-to-br ${collection.gradient} p-7 shadow-[0_24px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Efeito de brilho no hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-[1.5rem]" />

              <div className="relative">
                {/* Ícone */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${collection.iconBg} ${collection.accent}`}>
                  <Icon size={22} />
                </div>

                {/* Badge */}
                <div className={`mt-5 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${collection.badgeBg}`}>
                  {collection.badge}
                </div>

                {/* Título */}
                <h3 className="mt-3 text-xl font-black leading-tight text-[var(--brand-text)]">
                  {collection.title}
                </h3>

                {/* Pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {collection.points.map((point) => (
                    <span
                      key={point}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${collection.pillBg}`}
                    >
                      {point}
                    </span>
                  ))}
                </div>

                {/* Botão */}
                <Link
                  href={collection.href}
                  className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${collection.btnStyle}`}
                >
                  Ver setor
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}

        {/* Card expandido com 3 sub-áreas */}
        <article className="rounded-[1.5rem] border border-white/8 bg-[var(--brand-surface)] p-7 shadow-[0_24px_50px_rgba(0,0,0,0.3)] lg:col-span-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-muted)] mb-4">
            Explore por área
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {extraFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`group rounded-2xl border ${f.bg} p-5 transition-all hover:-translate-y-1`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ${f.color} mb-4`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-base font-black text-[var(--brand-text)]">{f.title}</p>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">{f.description}</p>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
